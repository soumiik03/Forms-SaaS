"use client";

import Link from "next/link";
import { S } from "./landing-styles";

export function Footer() {
  const links = [
    { label: "Builder", href: "#builder" },
    { label: "Analytics", href: "#analytics" },
    { label: "Pricing", href: "#pricing" },
    { label: "Explore", href: "/explore" },
  ];

  return (
    <footer style={S.footer}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "48px",
            alignItems: "flex-start",
            marginBottom: "56px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div style={{ ...S.logo, fontSize: "28px", marginBottom: "16px" }}>
              Formulate
            </div>
            <p
              style={{
                ...S.bodyText,
                fontSize: "14px",
                maxWidth: "320px",
                marginBottom: 0,
              }}
            >
              A modern form workspace for building, publishing, and reviewing
              responses with clarity.
            </p>
          </div>

          <div style={{ display: "flex", gap: "28px", flexWrap: "wrap" }}>
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                style={{
                  ...S.footerLink,
                  marginBottom: 0,
                  textDecoration: "none",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid var(--border)",
            paddingTop: "28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              color: "var(--text-subtle)",
            }}
          >
            (c) 2026 Formulate. All rights reserved.
          </span>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "12px",
              color: "var(--text-subtle)",
              letterSpacing: "0.06em",
            }}
          >
            BUILT FOR CLEAN DATA COLLECTION
          </span>
        </div>
      </div>
    </footer>
  );
}
