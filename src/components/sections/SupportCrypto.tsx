"use client";

import Image from "next/image";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { nextTabIndex } from "@/lib/tabKeys";
import { Check, Copy, Info, ShieldAlert } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/cn";
import type { SupportNetwork, SupportNetworkId } from "@/config/support";

type CopyState = "idle" | "copied" | "failed";

/**
 * The Support page's Crypto tab: one sub-tab per network (Ethereum
 * Mainnet, BNB Smart Chain, Bitcoin) with its coin logo, and for the
 * selected one its own receiving address, a QR code generated locally
 * from that exact address, a copy button and a network-specific safety
 * note. Read-only — no wallet connection, no transactions. The selection
 * is controlled by SupportExperience, whose illustration follows it.
 *
 * A network without a configured address (config/support.ts) shows a
 * short "not configured yet" note instead of any QR code or address.
 */
export function SupportCrypto({
  networks,
  activeId,
  onSelect,
  labels,
}: {
  networks: SupportNetwork[];
  /** Controlled by the Support page, whose illustration follows it. */
  activeId: SupportNetworkId;
  onSelect: (id: SupportNetworkId) => void;
  labels: {
    tablist: string;
    address: string;
    copy: string;
    copied: string;
    copyFailed: string;
    qrLabel: string;
    notConfigured: string;
    safety: Record<SupportNetworkId, string>;
  };
}) {
  const select = onSelect;
  const [copy, setCopy] = useState<{ id: SupportNetworkId; state: CopyState }>({
    id: networks[0].id,
    state: "idle",
  });
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const addressRef = useRef<HTMLInputElement>(null);
  const baseId = useId();
  const active = networks.find((n) => n.id === activeId) ?? networks[0];
  const copyState = copy.id === active.id ? copy.state : "idle";

  async function copyAddress() {
    if (!active.address) return;
    const id = active.id;
    let ok = false;
    try {
      await navigator.clipboard.writeText(active.address);
      ok = true;
    } catch {
      // Clipboard API blocked (permissions, insecure context): fall back
      // to copying the selected text of the address field.
      const input = addressRef.current;
      if (input) {
        input.focus();
        input.select();
        ok = document.execCommand("copy");
      }
    }
    setCopy({ id, state: ok ? "copied" : "failed" });
    window.setTimeout(
      () =>
        setCopy((current) =>
          current.id === id ? { id, state: "idle" } : current
        ),
      2500
    );
  }

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const index = networks.findIndex((n) => n.id === activeId);
    const next = nextTabIndex(event, index, networks.length);
    if (next === null) return;
    const id = networks[next].id;
    select(id);
    tabRefs.current[id]?.focus();
  }

  const panelId = `${baseId}-panel`;

  return (
    <div className="flex flex-col gap-6">
      <div
        role="tablist"
        aria-label={labels.tablist}
        className="grid grid-cols-3 gap-2 sm:gap-3"
      >
        {networks.map((network) => {
          const selected = network.id === activeId;
          return (
            <button
              key={network.id}
              ref={(el) => {
                tabRefs.current[network.id] = el;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${network.id}`}
              aria-selected={selected}
              aria-controls={panelId}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(network.id)}
              onKeyDown={onTabKeyDown}
              className={cn(
                "flex min-h-[4.5rem] flex-col items-center justify-center gap-1 rounded-xl border px-2 py-3 text-center transition-colors",
                selected
                  ? "border-[#f6b40e] bg-[#f6b40e]/10"
                  : "border-border bg-surface/60 hover:border-[#f6b40e]/50"
              )}
            >
              <Image
                src={network.logo}
                width={512}
                height={512}
                alt=""
                sizes="2rem"
                className="h-8 w-8"
              />
              <span
                dir="ltr"
                className={cn(
                  "text-lg font-bold",
                  selected ? "text-[#f6b40e]" : "text-text-primary"
                )}
              >
                {network.ticker}
              </span>
              <span dir="ltr" className="text-text-secondary text-xs">
                {network.name}
              </span>
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={panelId}
        aria-labelledby={`${baseId}-tab-${active.id}`}
        className="border-border bg-surface/60 grid gap-6 rounded-2xl border p-5 sm:p-8 md:grid-cols-[minmax(0,1fr)_minmax(0,14rem)]"
      >
        <div className="flex min-w-0 flex-col gap-5">
          <div className="flex items-center gap-4">
            <Image
              src={active.logo}
              width={512}
              height={512}
              alt=""
              sizes="3.5rem"
              className="h-12 w-12 shrink-0 sm:h-14 sm:w-14"
            />
            <div className="min-w-0">
              <p
                dir="ltr"
                className="text-text-primary text-xl font-bold rtl:text-right"
              >
                {active.name}
              </p>
              <p className="font-mono text-sm text-[#f6b40e]">
                {active.ticker}
              </p>
            </div>
          </div>

          {active.address ? (
            <div className="flex flex-col gap-2">
              <label
                htmlFor={`${baseId}-address`}
                className="text-text-secondary text-xs font-semibold ltr:tracking-wider ltr:uppercase"
              >
                {labels.address}
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  ref={addressRef}
                  id={`${baseId}-address`}
                  readOnly
                  dir="ltr"
                  value={active.address}
                  onFocus={(e) => e.currentTarget.select()}
                  className="border-border bg-background text-text-primary min-w-0 flex-1 rounded-md border px-3 py-2.5 font-mono text-sm"
                />
                <button
                  type="button"
                  onClick={copyAddress}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-[#f6b40e] px-4 py-2.5 text-sm font-semibold text-[#0f1d3a] transition-[filter] hover:brightness-110"
                >
                  {copyState === "copied" ? (
                    <Check className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Copy className="h-4 w-4" aria-hidden="true" />
                  )}
                  {copyState === "copied" ? labels.copied : labels.copy}
                </button>
              </div>
              <p
                role="status"
                className={cn(
                  "min-h-5 text-xs",
                  copyState === "failed"
                    ? "text-red-400"
                    : "text-text-secondary"
                )}
              >
                {copyState === "copied"
                  ? labels.copied
                  : copyState === "failed"
                    ? labels.copyFailed
                    : ""}
              </p>
            </div>
          ) : (
            <p className="border-border bg-background/60 text-text-secondary flex items-start gap-2 rounded-md border px-3 py-3 text-sm">
              <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {labels.notConfigured}
            </p>
          )}

          <p className="text-text-secondary flex items-start gap-2 rounded-md border border-[#f6b40e]/30 bg-[#f6b40e]/5 px-3 py-3 text-sm">
            <ShieldAlert
              className="mt-0.5 h-4 w-4 shrink-0 text-[#f6b40e]"
              aria-hidden="true"
            />
            {labels.safety[active.id]}
          </p>
        </div>

        {/* QR only for a real, configured address. */}
        {active.address && (
          <div className="flex items-center justify-center">
            <div className="rounded-xl bg-white p-3 shadow-lg">
              <QRCodeSVG
                value={active.address}
                size={200}
                level="M"
                role="img"
                aria-label={labels.qrLabel
                  .replace("{network}", active.name)
                  .replace("{address}", active.address)}
                className="h-auto w-full max-w-[12rem]"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
