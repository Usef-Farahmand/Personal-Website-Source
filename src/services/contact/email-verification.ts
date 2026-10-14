/**
 * Email address checks for the contact form, in two layers:
 *
 * 1. `isValidEmailSyntax` — a strict, synchronous shape check (RFC 5321
 *    length limits, dot-atom local part, real domain labels, alphabetic
 *    TLD). Runs on every submit before anything touches the network.
 * 2. `verifyEmailDomain` — asks public DNS-over-HTTPS resolvers whether
 *    the domain can actually receive mail (MX records, or the A/AAAA
 *    fallback RFC 5321 §5.1 allows). This catches typos like
 *    `gmail.cm` or made-up domains that a regex happily accepts — the
 *    confirmation email would otherwise bounce silently.
 *
 * The DNS check fails *open*: if no resolver answers (timeout, network
 * filtering, offline), the address is accepted on the strength of the
 * syntax check alone. It only rejects on a definitive answer — the
 * domain doesn't exist, explicitly refuses mail (null MX), or has no
 * mail or address records at all.
 */

const LOCAL_PART =
  /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*$/;
const DOMAIN_LABEL = /^[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/;
const TLD = /^([A-Za-z]{2,63}|xn--[A-Za-z0-9-]{1,59})$/;

export function isValidEmailSyntax(email: string): boolean {
  if (email.length > 254) return false;

  const at = email.lastIndexOf("@");
  if (at <= 0 || at !== email.indexOf("@")) return false;

  const local = email.slice(0, at);
  const domain = email.slice(at + 1);

  if (local.length > 64 || !LOCAL_PART.test(local)) return false;
  if (domain.length > 253) return false;

  const labels = domain.split(".");
  if (labels.length < 2) return false;
  if (!labels.every((label) => DOMAIN_LABEL.test(label))) return false;

  return TLD.test(labels[labels.length - 1]);
}

type DomainVerdict = "valid" | "invalid" | "unknown";

const DNS_RESOLVERS = [
  "https://cloudflare-dns.com/dns-query",
  "https://dns.google/resolve",
];
const DNS_TIMEOUT_MS = 4000;

const DNS_STATUS_NXDOMAIN = 3;
const DNS_TYPE_MX = 15;

interface DnsJsonAnswer {
  type: number;
  data: string;
}

interface DnsJsonResponse {
  Status: number;
  Answer?: DnsJsonAnswer[];
}

/** One lookup against the first resolver that answers; null if none did. */
async function queryDns(
  name: string,
  type: "MX" | "A" | "AAAA"
): Promise<DnsJsonResponse | null> {
  for (const resolver of DNS_RESOLVERS) {
    try {
      const url = `${resolver}?name=${encodeURIComponent(name)}&type=${type}`;
      const response = await fetch(url, {
        headers: { accept: "application/dns-json" },
        signal: AbortSignal.timeout(DNS_TIMEOUT_MS),
      });
      if (!response.ok) continue;
      return (await response.json()) as DnsJsonResponse;
    } catch {
      // Timed out or blocked — try the next resolver.
    }
  }
  return null;
}

function hasAnswer(response: DnsJsonResponse, type: number): boolean {
  return Boolean(response.Answer?.some((answer) => answer.type === type));
}

async function lookupDomain(domain: string): Promise<DomainVerdict> {
  const mx = await queryDns(domain, "MX");
  if (!mx) return "unknown";
  if (mx.Status === DNS_STATUS_NXDOMAIN) return "invalid";
  if (mx.Status !== 0) return "unknown";

  const mxRecords = (mx.Answer ?? []).filter((a) => a.type === DNS_TYPE_MX);
  if (mxRecords.length > 0) {
    // Null MX (RFC 7505): "0 ." means the domain explicitly accepts no mail.
    const isNullMx = mxRecords.every((record) =>
      /^0\s+\.?$/.test(record.data.trim())
    );
    return isNullMx ? "invalid" : "valid";
  }

  // No MX — mail falls back to the domain's own address records.
  for (const type of ["A", "AAAA"] as const) {
    const records = await queryDns(domain, type);
    if (!records) return "unknown";
    if (records.Status === 0 && hasAnswer(records, type === "A" ? 1 : 28)) {
      return "valid";
    }
  }
  return "invalid";
}

const verdictCache = new Map<string, Promise<DomainVerdict>>();

/**
 * True unless DNS definitively says the address's domain can't receive
 * mail. Results are cached per domain for the page's lifetime, so
 * re-submitting after fixing another field doesn't repeat the lookup.
 */
export async function verifyEmailDomain(email: string): Promise<boolean> {
  const domain = email.slice(email.lastIndexOf("@") + 1).toLowerCase();

  let verdict = verdictCache.get(domain);
  if (!verdict) {
    verdict = lookupDomain(domain);
    verdictCache.set(domain, verdict);
  }
  return (await verdict) !== "invalid";
}
