"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { S } from "./landing-styles";

const planFeatures = [
  "Create and publish forms",
  "Public and unlisted sharing",
  "Response collection",
  "Views and completion analytics",
  "Email confirmations",
];

export function Pricing() {
  return (
    <>
      <section id="pricing" style={S.section}>
        <div style={{ maxWidth: "880px", margin: "0 auto" }}>
          <div style={{ ...S.label, textAlign: "center" }}>Access</div>
          <h2 style={{ ...S.h2, textAlign: "center", marginBottom: "12px" }}>
            Start building with{" "}
            <span style={S.h2Outline}>the workspace you have.</span>
          </h2>
          <p style={{ ...S.bodyText, textAlign: "center", marginBottom: 0 }}>
            Formulate is ready for teams that need a clean way to build, share,
            and review forms without unnecessary setup.
          </p>

          <div
            style={{
              maxWidth: 520,
              margin: "56px auto 0",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 18,
              padding: "36px",
            }}
          >
            <div style={S.planName}>Included today</div>
            <div style={{ ...S.planPrice, color: "var(--cream)", marginBottom: 24 }}>
              Free
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px" }}>
              {planFeatures.map((feature) => (
                <li
                  key={feature}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    marginBottom: 12,
                    fontFamily: "var(--font-body)",
                    fontSize: 14,
                    color: "var(--cream-dim)",
                  }}
                >
                  <Check size={16} color="var(--lime)" style={{ flexShrink: 0, marginTop: 2 }} />
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              style={{
                ...S.btnLarge,
                justifyContent: "center",
                textDecoration: "none",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              Get started free
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

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

        <div style={{ position: "relative", maxWidth: "720px", margin: "0 auto" }}>
          <div style={{ ...S.label, justifyContent: "center" }}>
            Get started today
          </div>
          <h2
            style={{
              ...S.h2,
              fontSize: "clamp(44px, 7vw, 86px)",
              marginBottom: "24px",
            }}
          >
            Publish forms
            <br />
            <span style={S.h2Outline}>with confidence.</span>
          </h2>
          <p style={{ ...S.bodyText, marginBottom: "40px" }}>
            Build your form, choose how it should be shared, and watch the
            response data update from the dashboard.
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Link
              href="/register"
              style={{
                ...S.btnLarge,
                fontSize: "17px",
                padding: "18px 44px",
                textDecoration: "none",
              }}
            >
              Start building free
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
