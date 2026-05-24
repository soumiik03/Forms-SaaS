import { GlobalProviders } from "~/providers/global";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Formulate — Build Forms That Convert",
  description:
    "Formulate is the wildly powerful form builder for professionals. Drag, drop, and deploy beautiful forms with logic, analytics, and integrations — in minutes.",
  keywords: ["form builder", "SaaS", "drag and drop", "form analytics", "no-code"],
  openGraph: {
    title: "Formulate — Build Forms That Convert",
    description: "The professional-grade form builder. No code required.",
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
