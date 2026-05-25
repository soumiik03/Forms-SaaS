import { GlobalProviders } from "~/providers/global";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Formulate | Modern Form Operations",
  description:
    "Create polished forms, publish them with intent, and review responses from a focused workspace.",
  keywords: ["form builder", "SaaS", "drag and drop", "form analytics", "no-code"],
  openGraph: {
    title: "Formulate | Modern Form Operations",
    description: "A clean workspace for building, sharing, and analyzing forms.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <GlobalProviders>{children}</GlobalProviders>
      </body>
    </html>
  );
}
