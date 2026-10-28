"use client";

import Image from "next/image";
import {
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { CreditCard, Heart, Coins } from "lucide-react";
import { SupportCrypto } from "@/components/sections/SupportCrypto";
import { nextTabIndex } from "@/lib/tabKeys";
import { cn } from "@/lib/cn";
import {
  SUPPORT_IMAGES,
  type SupportNetwork,
  type SupportNetworkId,
} from "@/config/support";

type MainTab = "connect" | "crypto" | "payments";

const TABS: { id: MainTab; Icon: typeof Heart }[] = [
  { id: "connect", Icon: Heart },
  { id: "crypto", Icon: Coins },
  { id: "payments", Icon: CreditCard },
];

/**
 * The Support page's three ways to help — Connect (follow and share),
 * Crypto (ETH / BNB / BTC) and Other payment methods — as an ARIA tablist
 * with Connect selected first. One shared illustration follows the
 * selection: waving for Connect, the selected network's avatar for
 * Crypto, the coffee mug for payments. Every illustration sits in the
 * same fixed box and cross-fades, so switching never shifts the layout.
 * Panels stay mounted (hidden), so the crypto selection survives tab
 * changes. Connect and payment panels are server-rendered and passed in.
 */
export function SupportExperience({
  networks,
  connectPanel,
  paymentsPanel,
  cryptoIntro,
  labels,
  cryptoLabels,
}: {
  networks: SupportNetwork[];
  connectPanel: ReactNode;
  paymentsPanel: ReactNode;
  cryptoIntro: ReactNode;
  labels: {
    tablist: string;
    tabs: Record<MainTab, string>;
    imageAlt: Record<"connect" | "payments" | SupportNetworkId, string>;
  };
  cryptoLabels: Parameters<typeof SupportCrypto>[0]["labels"];
}) {
  const [tab, setTab] = useState<MainTab>("connect");
  const [network, setNetwork] = useState<SupportNetworkId>(networks[0].id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const baseId = useId();

  const illustrations = [
    { key: "connect", image: SUPPORT_IMAGES.connect, shown: tab === "connect" },
    ...networks.map((n) => ({
      key: n.id,
      image: n.image,
      shown: tab === "crypto" && network === n.id,
    })),
    {
      key: "payments",
      image: SUPPORT_IMAGES.payments,
      shown: tab === "payments",
    },
  ] as const;

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const index = TABS.findIndex((t) => t.id === tab);
    const next = nextTabIndex(event, index, TABS.length);
    if (next === null) return;
    const id = TABS[next].id;
    setTab(id);
    tabRefs.current[id]?.focus();
  }

  return (
    <div className="flex flex-col gap-8">
      <div
        role="tablist"
        aria-label={labels.tablist}
        className="border-border bg-surface/60 grid grid-cols-3 gap-1 rounded-xl border p-1"
      >
        {TABS.map(({ id, Icon }) => {
          const selected = id === tab;
          return (
            <button
              key={id}
              ref={(el) => {
                tabRefs.current[id] = el;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setTab(id)}
              onKeyDown={onKeyDown}
              className={cn(
                "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-2 py-1.5 text-center text-xs font-semibold transition-colors sm:text-sm",
                selected
                  ? "bg-[#f6b40e] text-[#0f1d3a]"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              <Icon
                className="hidden h-4 w-4 shrink-0 sm:block"
                aria-hidden="true"
              />
              <span className="leading-tight">{labels.tabs[id]}</span>
            </button>
          );
        })}
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-12">
        {/* Shared illustration (above the content on phones). */}
        <div className="relative mx-auto aspect-[2/3] w-full max-w-[11rem] sm:max-w-[13rem] lg:sticky lg:top-24 lg:order-last lg:max-w-none">
          {illustrations.map(({ key, image, shown }) => (
            <Image
              key={key}
              src={image.src}
              width={image.width}
              height={image.height}
              alt={shown ? labels.imageAlt[key] : ""}
              aria-hidden={!shown}
              priority={key === "connect"}
              sizes="(min-width: 1024px) 18rem, 13rem"
              className={cn(
                "absolute inset-0 h-full w-full object-contain transition-opacity duration-500 motion-reduce:transition-none",
                shown ? "opacity-100" : "opacity-0"
              )}
            />
          ))}
        </div>

        <div className="min-w-0">
          <div
            role="tabpanel"
            id={`${baseId}-panel-connect`}
            aria-labelledby={`${baseId}-tab-connect`}
            hidden={tab !== "connect"}
          >
            {connectPanel}
          </div>
          <div
            role="tabpanel"
            id={`${baseId}-panel-crypto`}
            aria-labelledby={`${baseId}-tab-crypto`}
            hidden={tab !== "crypto"}
          >
            {cryptoIntro}
            <SupportCrypto
              networks={networks}
              activeId={network}
              onSelect={setNetwork}
              labels={cryptoLabels}
            />
          </div>
          <div
            role="tabpanel"
            id={`${baseId}-panel-payments`}
            aria-labelledby={`${baseId}-tab-payments`}
            hidden={tab !== "payments"}
          >
            {paymentsPanel}
          </div>
        </div>
      </div>
    </div>
  );
}
