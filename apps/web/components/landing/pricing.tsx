"use client";

import { useState } from "react";
import { S } from "./landing-styles";

function PricingCard({
  name,
  price,
  features,
  featured,
  cta,
}: {
  name: string;
  price: string;
  features: string[];
  featured?: boolean;
  cta: string;
}) {
  const [hovered, setHovered] = useState(false);
  const dark = !featured;
  return (
    <div
      style={{
        ...(featured ? S.pricingCardFeatured : S.pricingCard),
        borderColor:
          !featured && hovered ? "rgba(184,255,53,0.3)" : "var(--border)",
        transform: featured
          ? "scale(1.04)"
          : hovered
          ? "translateY(-4px)"
          : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          ...S.planName,
          color: featured ? "#000" : "var(--lime)",
        }}
      >
        {featured && (
          <span
            style={{
              background: "#000",
              color: "var(--lime)",
              borderRadius: "100px",
              padding: "2px 10px",
              fontSize: "10px",
              marginRight: "8px",
            }}
          >
            POPULAR
          </span>
        )}
        {name}
      </div>
      <div
        style={{
          ...S.planPrice,
          color: featured ? "#000" : "var(--cream)",
        }}
      >
        {price}
        <span style={{ ...S.planPer, color: featured ? "#000" : undefined }}>
          /mo
        </span>
      </div>
      <div
        style={{
          height: "1px",
          background: featured ? "rgba(0,0,0,0.15)" : "var(--border)",
          margin: "28px 0",
        }}
      />
      <ul style={{ listStyle: "none", marginBottom: "32px" }}>
        {features.map((f) => (
          <li
            key={f}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
              marginBottom: "12px",
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              color: featured ? "rgba(0,0,0,0.75)" : "var(--cream-dim)",
            }}
          >
            <span
              style={{
                color: featured ? "#000" : "var(--lime)",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              ✓
            </span>
            {f}
          </li>
        ))}
      </ul>
      <button
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: "100px",
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: "15px",
          cursor: "pointer",
          border: featured ? "none" : "1.5px solid rgba(184,255,53,0.4)",
          background: featured ? "#000" : "transparent",
          color: featured ? "var(--lime)" : "var(--cream)",
          transition: "all 0.2s",
        }}
      >
        {cta}
      </button>
    </div>
  );
}

const plans = [
  {
    name: "Starter",
    price: "$0",
    features: [
      "5 active forms",
      "100 submissions/mo",
      "Basic analytics",
      "Email notifications",
      "Formulate branding",
    ],
    cta: "Get started free",
  },
  {
    name: "Pro",
    price: "$29",
    features: [
      "Unlimited forms",
      "10,000 submissions/mo",
      "Advanced analytics",
      "Conditional logic",
      "Custom domain",
      "50+ integrations",
      "Remove branding",
    ],
    cta: "Start free trial",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    features: [
      "Everything in Pro",
      "Unlimited submissions",
      "SSO & SAML",
      "SOC 2 compliance",
      "Dedicated support",
      "SLA guarantee",
      "Custom contracts",
    ],
    cta: "Talk to sales",
  },
];

export function Pricing() {
  return (
    <>
            {/* ── PRICING ── */}
            <section id="pricing" style={S.section}>
              <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                <div style={{ ...S.label, textAlign: "center" }}>Pricing</div>
                <h2
                  style={{
                    ...S.h2,
                    textAlign: "center",
                    marginBottom: "12px",
                  }}
                >
                  Simple,{" "}
                  <span style={S.h2Outline}>honest pricing.</span>
                </h2>
                <p
                  style={{
                    ...S.bodyText,
                    textAlign: "center",
                    marginBottom: "0",
                  }}
                >
                  Start free. Scale when you&apos;re ready. No hidden fees.
                </p>
                <div style={S.pricingGrid}>
                  {plans.map((p) => (
                    <PricingCard key={p.name} {...p} />
                  ))}
                </div>
              </div>
            </section>
      
            {/* ── CTA ── */}
            <section style={S.ctaSection}>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(184,255,53,0.08) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />
      
              <div
                style={{
                  position: "relative",
                  maxWidth: "720px",
                  margin: "0 auto",
                }}
              >
                <div style={{ ...S.label, justifyContent: "center" }}>
                  Get started today
                </div>
                <h2
                  style={{
                    ...S.h2,
                    fontSize: "clamp(48px, 7vw, 96px)",
                    marginBottom: "24px",
                  }}
                >
                  Build forms
                  <br />
                  <span style={S.h2Outline}>that work.</span>
                </h2>
                <p
                  style={{
                    ...S.bodyText,
                    marginBottom: "48px",
                  }}
                >
                  Join 50,000+ teams who use Formulate to collect data that matters.
                  Free to start, powerful to scale.
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "16px",
                  }}
                >
                  <button style={{ ...S.btnLarge, fontSize: "17px", padding: "18px 44px" }}>
                    Start building free ↓
                  </button>
                  <button
                    style={{
                      ...S.btnOutlineLarge,
                      fontSize: "17px",
                      padding: "18px 44px",
                    }}
                  >
                    Talk to sales
                  </button>
                </div>
              </div>
            </section>
    </>
  );
}
