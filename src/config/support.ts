/**
 * Support page configuration: the public receiving addresses for crypto
 * donations and the illustrations used by the Support feature.
 *
 * ─── Receiving addresses ────────────────────────────────────────────────
 * Paste each PUBLIC receiving address below, exactly as your wallet shows
 * it for that network. Leave a value as `null` until you have it: the
 * Support page then shows a "not configured yet" note for that network
 * instead of a QR code.
 *
 *  - ethereum: your Ethereum Mainnet address (0x…, 42 characters).
 *  - bnb:      your BNB Smart Chain (BEP-20) address (0x…, 42 characters).
 *              MetaMask uses the same 0x address on both EVM networks, but
 *              it is configured separately so each network stays explicit.
 *  - bitcoin:  a NATIVE Bitcoin address (bc1…, 1…, or 3…). Not an 0x
 *              address — an Ethereum/BNB address cannot receive BTC.
 *
 * These are public receiving addresses, safe to publish. NEVER put a
 * private key, seed/recovery phrase or wallet password in this file or
 * anywhere in the repository.
 *
 * An address that doesn't match its network's format is treated as not
 * configured, so a typo never produces a QR code for a wrong address.
 */
export const SUPPORT_ADDRESSES: Record<SupportNetworkId, string | null> = {
  ethereum: "0x4988bd4266D0b1279c8607F53A8c8C82aDF994a7",
  bnb: "0x4988bd4266D0b1279c8607F53A8c8C82aDF994a7",
  bitcoin: "bc1qxpc77z06cwmdu6dw47c4h7ajw9wpchq73hg0hz",
};

/**
 * ─── Illustrations ──────────────────────────────────────────────────────
 * The coffee character (footer callout), one avatar per crypto network,
 * the waving and mug characters for the Support page's other two tabs,
 * and the closing thank-you. The Support page's top illustration follows
 * the selected tab (and, on Crypto, the selected network). Files live in
 * public/support/; keep `width`/`height` equal to each file's pixel size.
 */
const avatar = (src: string) => ({ src, width: 1024, height: 1536 }) as const;

export const SUPPORT_IMAGES = {
  character: {
    src: "/support/support-character.webp",
    width: 1536,
    height: 1024,
  },
  ethereum: avatar("/support/support-ethereum.webp"),
  bnb: avatar("/support/support-bnb.webp"),
  bitcoin: avatar("/support/support-bitcoin.webp"),
  /** The Support page's closing thank-you. */
  thanks: { src: "/support/support-thanks.webp", width: 1254, height: 1254 },
  /** Support tabs: Connect (waving) and Other payment methods (mug). */
  connect: avatar("/support/support-connect.webp"),
  payments: avatar("/support/support-payments.webp"),
} as const;

/** Each network's coin logo, shown beside its name (512×512). */
export const SUPPORT_LOGOS: Record<SupportNetworkId, string> = {
  ethereum: "/support/logo-ethereum.png",
  bnb: "/support/logo-bnb.png",
  bitcoin: "/support/logo-bitcoin.png",
};

export type SupportNetworkId = "ethereum" | "bnb" | "bitcoin";

export interface SupportNetwork {
  id: SupportNetworkId;
  /** Not translated: the network's own name and ticker. */
  name: string;
  ticker: string;
  address: string | null;
  image: (typeof SUPPORT_IMAGES)[SupportNetworkId];
  logo: string;
}

const ADDRESS_FORMAT: Record<SupportNetworkId, RegExp> = {
  ethereum: /^0x[0-9a-fA-F]{40}$/,
  bnb: /^0x[0-9a-fA-F]{40}$/,
  // Native Bitcoin only: bech32/bech32m (bc1…) or legacy/P2SH (1…, 3…).
  bitcoin: /^(bc1[02-9ac-hj-np-z]{11,71}|[13][1-9A-HJ-NP-Za-km-z]{25,34})$/,
};

function configuredAddress(id: SupportNetworkId): string | null {
  const address = SUPPORT_ADDRESSES[id]?.trim();
  return address && ADDRESS_FORMAT[id].test(address) ? address : null;
}

/** The three networks, in display order, with validated addresses. */
export const SUPPORT_NETWORKS: SupportNetwork[] = [
  {
    id: "ethereum",
    name: "Ethereum Mainnet",
    ticker: "ETH",
    address: configuredAddress("ethereum"),
    image: SUPPORT_IMAGES.ethereum,
    logo: SUPPORT_LOGOS.ethereum,
  },
  {
    id: "bnb",
    name: "BNB Smart Chain",
    ticker: "BNB",
    address: configuredAddress("bnb"),
    image: SUPPORT_IMAGES.bnb,
    logo: SUPPORT_LOGOS.bnb,
  },
  {
    id: "bitcoin",
    name: "Bitcoin",
    ticker: "BTC",
    address: configuredAddress("bitcoin"),
    image: SUPPORT_IMAGES.bitcoin,
    logo: SUPPORT_LOGOS.bitcoin,
  },
];

/**
 * ─── Connect tab ────────────────────────────────────────────────────────
 * Which of the site's own social profiles (src/content/site/site.data.ts
 * → socialLinks) the Connect tab lists, in order. URLs come from there,
 * so they're never duplicated; a platform without an enabled link there
 * is simply left out.
 */
export const SUPPORT_SOCIALS = ["youtube", "instagram", "telegram"] as const;

/**
 * ─── Other payment methods ──────────────────────────────────────────────
 * Data-driven, so another provider is one more entry here (plus its name
 * and text in the message files under support.methods.<id>).
 *
 *  - `url: null` → shown as "Coming soon", with no button.
 *  - `onlyIn` → shown only to visitors from these countries (ISO codes),
 *    read from the hosting platform's geolocation header (Vercel:
 *    x-vercel-ip-country). Without that header (e.g. local dev) the
 *    method is shown.
 *
 * The site only links out: no payment form, card details or payment
 * status here. Paste each link exactly as the provider gives it.
 */
export interface PaymentMethod {
  id: "blubank" | "paypal" | "buymeacoffee";
  url: string | null;
  logo: string;
  /** Transparent logo: shown on a white tile so it reads on the dark card. */
  logoOnTile?: boolean;
  onlyIn?: readonly string[];
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    // Public Blubank link: supporters in Iran pay any amount in tomans.
    id: "blubank",
    url: "https://blubiz.sb24.com/s/ZGx5GOip",
    logo: "/support/logo-blubank.png",
    onlyIn: ["IR"],
  },
  { id: "paypal", url: null, logo: "/support/logo-paypal.png", logoOnTile: true },
  {
    id: "buymeacoffee",
    url: null,
    logo: "/support/logo-buymeacoffee.png",
    logoOnTile: true,
  },
];
