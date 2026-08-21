import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "useffarahmand.com — Local CMS",
  description: "Local-only content administration. Not publicly accessible.",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-neutral-50 text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-100">
        {children}
      </body>
    </html>
  );
}
