"use client";

import { S } from "./landing-styles";

export function Footer() {
  return (
    <footer style={S.footer}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
              <div style={S.footerGrid}>
                <div>
                  <div
                    style={{
                      ...S.logo,
                      fontSize: "28px",
                      marginBottom: "16px",
                      display: "block",
                    }}
                  >
                    Formulate
                  </div>
                  <p
                    style={{
                      ...S.bodyText,
                      fontSize: "14px",
                      maxWidth: "280px",
                      marginBottom: "24px",
                    }}
                  >
                    The professional form builder. Build beautiful, powerful forms
                    that convert — in minutes.
                  </p>
                  <div style={{ display: "flex", gap: "12px" }}>
                    {["𝕏", "in", "▶", "🐙"].map((icon) => (
                      <div
                        key={icon}
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "8px",
                          border: "1px solid var(--border)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          fontSize: "14px",
                          color: "var(--text-muted)",
                          transition: "border-color 0.2s, color 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "var(--lime)";
                          e.currentTarget.style.color = "var(--lime)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "var(--border)";
                          e.currentTarget.style.color = "var(--text-muted)";
                        }}
                      >
                        {icon}
                      </div>
                    ))}
                  </div>
                </div>
                {[
                  {
                    heading: "Product",
                    links: [
                      "Builder",
                      "Templates",
                      "Analytics",
                      "Integrations",
                      "AI Features",
                      "Changelog",
                    ],
                  },
                  {
                    heading: "Company",
                    links: [
                      "About",
                      "Blog",
                      "Careers",
                      "Press",
                      "Partners",
                      "Contact",
                    ],
                  },
                  {
                    heading: "Legal",
                    links: [
                      "Privacy Policy",
                      "Terms of Service",
                      "Cookie Policy",
                      "Security",
                      "GDPR",
                    ],
                  },
                ].map((col) => (
                  <div key={col.heading}>
                    <div style={S.footerHeading}>{col.heading}</div>
                    {col.links.map((link) => (
                      <a
                        key={link}
                        href="#"
                        style={S.footerLink}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = "var(--lime)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = "var(--text-muted)")
                        }
                      >
                        {link}
                      </a>
                    ))}
                  </div>
                ))}
              </div>
    
              <div
                style={{
                  borderTop: "1px solid var(--border)",
                  paddingTop: "32px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "13px",
                    color: "var(--text-subtle)",
                  }}
                >
                  © 2025 Formulate, Inc. All rights reserved.
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "12px",
                    color: "var(--text-subtle)",
                    letterSpacing: "0.06em",
                  }}
                >
                  BUILT WITH FORMULATE ◆
                </span>
              </div>
            </div>
          </footer>
  );
}
