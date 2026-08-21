"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type NavLink = {
  href: string;
  label: string;
  icon: ReactNode;
  /** Destination page exists but its functionality isn't built yet
   *  (Media Library / Settings, per section 4) — the link itself still
   *  works, this only labels the destination. */
  soon?: boolean;
};

type NavGroup = {
  label: string;
  links: NavLink[];
};

function DashboardIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-4 w-4 shrink-0"
    >
      <rect x="3" y="3" width="6" height="6" rx="1" />
      <rect x="11" y="3" width="6" height="6" rx="1" />
      <rect x="3" y="11" width="6" height="6" rx="1" />
      <rect x="11" y="11" width="6" height="6" rx="1" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-4 w-4 shrink-0"
    >
      <path
        strokeLinejoin="round"
        d="M3 6a1 1 0 0 1 1-1h3.5l1.5 2H16a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6Z"
      />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-4 w-4 shrink-0"
    >
      <rect x="3" y="4" width="14" height="12" rx="1.5" />
      <circle cx="7.5" cy="8.5" r="1.25" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m5 14 3.5-3.5L11 13l2-2 3 3"
      />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-4 w-4 shrink-0"
    >
      <circle cx="10" cy="10" r="2.5" />
      <path
        strokeLinecap="round"
        d="M10 3v1.5M10 15.5V17M17 10h-1.5M4.5 10H3M14.9 5.1l-1.1 1.1M6.2 13.7l-1.1 1.1M14.9 14.9l-1.1-1.1M6.2 6.2 5.1 5.1"
      />
    </svg>
  );
}

const DASHBOARD_LINK: NavLink = {
  href: "/admin",
  label: "Dashboard",
  icon: <DashboardIcon />,
};

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Content",
    links: [
      { href: "/admin/projects", label: "Projects", icon: <FolderIcon /> },
      { href: "/admin/articles", label: "Articles", icon: <FolderIcon /> },
    ],
  },
  {
    label: "Media",
    links: [
      {
        href: "/admin/media",
        label: "Media Library",
        icon: <ImageIcon />,
      },
    ],
  },
  {
    label: "Settings",
    links: [
      {
        href: "/admin/settings",
        label: "General",
        icon: <GearIcon />,
        soon: true,
      },
    ],
  },
];

function isLinkActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavItem({
  link,
  pathname,
  onNavigate,
}: {
  link: NavLink;
  pathname: string;
  onNavigate: () => void;
}) {
  const active = isLinkActive(pathname, link.href);

  return (
    <li>
      <Link
        href={link.href}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${
          active
            ? "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
            : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-100"
        }`}
      >
        {link.icon}
        <span className="flex-1">{link.label}</span>
        {link.soon ? (
          <span className="rounded-full bg-neutral-100 px-1.5 py-0.5 text-[10px] font-normal tracking-wide text-neutral-500 uppercase dark:bg-neutral-800 dark:text-neutral-400">
            Soon
          </span>
        ) : null}
      </Link>
    </li>
  );
}

/**
 * Persistent on desktop, an off-canvas drawer on smaller screens
 * (section 9). `isMobileOpen`/`onNavigate` are owned by `AdminShell` so
 * the header's toggle button and this drawer share one source of truth.
 */
export default function AdminSidebar({
  isMobileOpen,
  onNavigate,
}: {
  isMobileOpen: boolean;
  onNavigate: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav
      id="admin-sidebar"
      aria-label="Admin"
      className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col overflow-y-auto border-r border-neutral-200 bg-white p-4 transition-transform duration-200 ease-out md:sticky md:top-0 md:z-auto md:h-screen md:w-64 md:translate-x-0 dark:border-neutral-800 dark:bg-neutral-950 ${
        isMobileOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"
      }`}
    >
      <div className="px-1 pb-4">
        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          useffarahmand.com
        </p>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Local CMS
        </p>
      </div>

      <ul className="space-y-1">
        <NavItem
          link={DASHBOARD_LINK}
          pathname={pathname}
          onNavigate={onNavigate}
        />
      </ul>

      {NAV_GROUPS.map((group) => (
        <div key={group.label} className="mt-5">
          <p className="px-3 text-xs font-semibold tracking-wide text-neutral-400 uppercase dark:text-neutral-500">
            {group.label}
          </p>
          <ul className="mt-1.5 space-y-1">
            {group.links.map((link) => (
              <NavItem
                key={link.href}
                link={link}
                pathname={pathname}
                onNavigate={onNavigate}
              />
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
