"use client";

import { useState } from "react";
import { S } from "./landing-styles";

function FeatureCard({
  icon,
  color,
  title,
  body,
}: {
  icon: string;
  color: string;
  title: string;
  body: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        ...S.featureCard,
        background: hovered ? "var(--surface-2)" : "var(--surface)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: color,
          }}
        />
      )}
      <div style={{ ...S.featureIcon, background: `${color}18` }}>
        <span style={{ color }}>{icon}</span>
      </div>
      <div style={S.featureTitle}>{title}</div>
      <p style={{ ...S.bodyText, fontSize: "14px" }}>{body}</p>
    </div>
  );
}

function TestimonialCard({
  quote,
  name,
  role,
  initials,
  color,
}: {
  quote: string;
  name: string;
  role: string;
  initials: string;
  color: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        ...S.testimonialCard,
        borderColor: hovered ? color : "var(--border)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "32px",
          color,
          marginBottom: "12px",
          lineHeight: 1,
        }}
      >
        "
      </div>
      <p style={S.quote}>{quote}</p>
      <div style={S.avatarRow}>
        <div style={{ ...S.avatar, background: color }}>{initials}</div>
        <div>
          <div style={S.avatarName}>{name}</div>
          <div style={S.avatarRole}>{role}</div>
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    icon: "⚡",
    color: "var(--lime)",
    title: "Build in Seconds",
    body: "Drag, drop, configure. Our visual builder makes complex forms feel stupidly simple. No code, no headaches.",
  },
  {
    icon: "🧠",
    color: "var(--violet-light)",
    title: "Conditional Logic",
    body: "Show or hide fields based on user input. Build adaptive, intelligent forms that feel personalized.",
  },
  {
    icon: "📊",
    color: "var(--orange)",
    title: "Deep Analytics",
    body: "Completion rates, drop-off points, time-on-field — every metric you need to optimize your forms.",
  },
  {
    icon: "🔗",
    color: "#06b6d4",
    title: "500+ Integrations",
    body: "Connect Formulate to Slack, HubSpot, Salesforce, Notion, Zapier, and hundreds more — in one click.",
  },
  {
    icon: "✨",
    color: "var(--pink)",
    title: "AI-Powered Fields",
    body: "Let AI auto-suggest field types, detect validation rules, and write field copy based on your intent.",
  },
  {
    icon: "🔒",
    color: "#10b981",
    title: "Enterprise Security",
    body: "SOC 2 Type II, GDPR compliant, SSO, audit logs, data residency. Security-first from day one.",
  },
];

const testimonials = [
  {
    quote:
      "We replaced three different form tools with Formulate. Our lead capture rate went up 40% in the first month.",
    name: "Maya Patel",
    role: "Head of Growth, Luma",
    initials: "MP",
    color: "var(--lime)",
  },
  {
    quote:
      "The conditional logic is miles ahead of anything we've tried. Our onboarding forms feel like a real product now.",
    name: "James Torres",
    role: "Founder, Orbit Labs",
    initials: "JT",
    color: "var(--violet-light)",
  },
  {
    quote:
      "Analytics alone were worth switching. We finally know exactly where people abandon and can fix it immediately.",
    name: "Priya Singh",
    role: "Product Manager, Clearline",
    initials: "PS",
    color: "var(--orange)",
  },
];

export function Features() {
  return (
    <>
            {/* ── FEATURES ── */}
            <section id="templates" style={S.section}>
              <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                <div style={S.label}>Features</div>
                <h2 style={S.h2}>
                  Everything you need.{" "}
                  <span style={S.h2Outline}>Nothing you don&apos;t.</span>
                </h2>
                <div style={S.featuresGrid}>
                  {features.map((f) => (
                    <FeatureCard key={f.title} {...f} />
                  ))}
                </div>
              </div>
            </section>
      
            {/* ── STATS ── */}
            <section
              id="analytics"
              style={{
                ...S.section,
                background: "var(--surface)",
                padding: "80px 40px",
              }}
            >
              <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                <div style={S.statsGrid}>
                  {[
                    { n: "50K+", l: "Forms created" },
                    { n: "12M+", l: "Submissions processed" },
                    { n: "99.9%", l: "Uptime SLA" },
                    { n: "4.9★", l: "Product Hunt rating" },
                  ].map((s) => (
                    <div key={s.n} style={S.statCard}>
                      <div style={S.statNum}>{s.n}</div>
                      <div style={S.statLabel}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
      
            {/* ── INTEGRATIONS MARQUEE ── */}
            <section id="integrations" style={{ ...S.section, paddingTop: "80px", paddingBottom: "0" }}>
              <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                <div style={S.label}>Integrations</div>
                <h2 style={{ ...S.h2, marginBottom: "48px" }}>
                  Plays well with your{" "}
                  <span style={S.h2Outline}>whole stack.</span>
                </h2>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(6, 1fr)",
                    gap: "12px",
                  }}
                >
                  {[
                    { name: "Slack", color: "#4A154B", icon: "💬" },
                    { name: "HubSpot", color: "#FF7A59", icon: "🎯" },
                    { name: "Notion", color: "#fff", icon: "📄" },
                    { name: "Zapier", color: "#FF4A00", icon: "⚡" },
                    { name: "Salesforce", color: "#00A1E0", icon: "☁" },
                    { name: "Stripe", color: "#635BFF", icon: "💳" },
                    { name: "Airtable", color: "#FCB400", icon: "📊" },
                    { name: "Webflow", color: "#4353FF", icon: "🌐" },
                    { name: "Linear", color: "#5E6AD2", icon: "▲" },
                    { name: "Figma", color: "#F24E1E", icon: "🎨" },
                    { name: "GitHub", color: "#24292E", icon: "⬡" },
                    { name: "Make", color: "#6D00CC", icon: "◉" },
                  ].map((int) => (
                    <div
                      key={int.name}
                      style={{
                        background: "var(--surface)",
                        border: "1px solid var(--border)",
                        borderRadius: "14px",
                        padding: "20px 16px",
                        display: "flex",
                        flexDirection: "column" as const,
                        alignItems: "center",
                        gap: "10px",
                        cursor: "pointer",
                        transition: "border-color 0.2s, transform 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "rgba(184,255,53,0.3)";
                        e.currentTarget.style.transform = "translateY(-3px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "var(--border)";
                        e.currentTarget.style.transform = "none";
                      }}
                    >
                      <span style={{ fontSize: "24px" }}>{int.icon}</span>
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "var(--cream-dim)",
                        }}
                      >
                        {int.name}
                      </span>
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    textAlign: "center",
                    marginTop: "32px",
                    paddingBottom: "80px",
                  }}
                >
                  <button
                    style={{
                      background: "transparent",
                      border: "1px solid var(--border)",
                      color: "var(--cream-dim)",
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      fontSize: "14px",
                      padding: "12px 28px",
                      borderRadius: "100px",
                      cursor: "pointer",
                    }}
                  >
                    View all 500+ integrations →
                  </button>
                </div>
              </div>
            </section>
      
            {/* ── TESTIMONIALS ── */}
            <section
              style={{ ...S.section, background: "var(--surface)" }}
            >
              <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                <div style={S.label}>Testimonials</div>
                <h2 style={S.h2}>
                  Don&apos;t take our word{" "}
                  <span style={S.h2Outline}>for it.</span>
                </h2>
                <div style={S.testimonialGrid}>
                  {testimonials.map((t) => (
                    <TestimonialCard key={t.name} {...t} />
                  ))}
                </div>
              </div>
            </section>
    </>
  );
}
