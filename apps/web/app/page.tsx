"use client";
import { useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────
   INLINE STYLES — zero dependency, pure CSS vars
───────────────────────────────────────────── */

const S: Record<string, React.CSSProperties> = {
  /* NAV */
  banner: {
    background: "var(--lime)",
    color: "#000",
    textAlign: "center",
    padding: "10px 16px",
    fontSize: "13px",
    fontWeight: 600,
    fontFamily: "var(--font-display)",
    letterSpacing: "0.02em",
    position: "sticky",
    top: 0,
    zIndex: 200,
  },
  nav: {
    position: "sticky",
    top: "40px",
    zIndex: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 40px",
    height: "var(--nav-h)",
    background: "rgba(10,10,10,0.92)",
    backdropFilter: "blur(20px)",
    borderBottom: "1px solid var(--border)",
    /* needed so absolute child can center relative to full nav width */
    //position: "sticky" as const,
  },
  navCenter: {
    position: "absolute" as const,
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: "36px",
    listStyle: "none",
    fontFamily: "var(--font-display)",
    fontSize: "14px",
    fontWeight: 500,
    color: "var(--cream-dim)",
  },
  logo: {
    fontFamily: "var(--font-display)",
    fontWeight: 800,
    fontSize: "22px",
    color: "var(--lime)",
    letterSpacing: "-0.03em",
  },
  navActions: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  btnGhost: {
    background: "transparent",
    color: "var(--cream-dim)",
    fontFamily: "var(--font-display)",
    fontWeight: 500,
    fontSize: "14px",
    padding: "8px 16px",
    border: "1px solid var(--border)",
    borderRadius: "100px",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  btnPrimary: {
    background: "var(--lime)",
    color: "#000",
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: "14px",
    padding: "10px 22px",
    borderRadius: "100px",
    cursor: "pointer",
    border: "none",
    transition: "all 0.2s",
    letterSpacing: "-0.01em",
  },

  /* HERO */
  hero: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    padding: "80px 40px 60px",
    position: "relative" as const,
    overflow: "hidden",
  },
  heroEyebrow: {
    fontFamily: "var(--font-display)",
    fontSize: "12px",
    fontWeight: 600,
    letterSpacing: "0.14em",
    color: "var(--lime)",
    textTransform: "uppercase" as const,
    marginBottom: "28px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  heroTitle: {
    fontFamily: "var(--font-display)",
    fontSize: "clamp(72px, 11vw, 160px)",
    fontWeight: 800,
    lineHeight: 0.9,
    letterSpacing: "-0.04em",
    color: "var(--cream)",
    maxWidth: "1100px",
  },
  heroTitleAccent: {
    color: "transparent",
    WebkitTextStroke: "2px var(--cream-dim)",
  },
  heroSub: {
    maxWidth: "480px",
    marginTop: "48px",
    fontFamily: "var(--font-body)",
    fontSize: "17px",
    lineHeight: 1.65,
    color: "var(--text-muted)",
    borderLeft: "2px solid var(--lime)",
    paddingLeft: "20px",
  },
  heroActions: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginTop: "40px",
  },
  btnLarge: {
    background: "var(--lime)",
    color: "#000",
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: "16px",
    padding: "16px 36px",
    borderRadius: "100px",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  btnOutlineLarge: {
    background: "transparent",
    color: "var(--cream)",
    fontFamily: "var(--font-display)",
    fontWeight: 600,
    fontSize: "16px",
    padding: "16px 36px",
    borderRadius: "100px",
    border: "1px solid rgba(240,234,214,0.2)",
    cursor: "pointer",
  },

  /* TICKER */
  ticker: {
    borderTop: "1px solid var(--border)",
    borderBottom: "1px solid var(--border)",
    padding: "14px 0",
    overflow: "hidden",
    whiteSpace: "nowrap" as const,
  },
  tickerInner: {
    display: "inline-flex",
    gap: "64px",
    animation: "ticker 28s linear infinite",
    fontFamily: "var(--font-display)",
    fontSize: "13px",
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    color: "var(--text-muted)",
  },
  tickerDot: {
    color: "var(--lime)",
    fontSize: "20px",
    lineHeight: 1,
  },

  /* SECTION BASE */
  section: {
    padding: "120px 40px",
    position: "relative" as const,
  },
  label: {
    fontFamily: "var(--font-display)",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.14em",
    textTransform: "uppercase" as const,
    color: "var(--lime)",
    marginBottom: "20px",
  },
  h2: {
    fontFamily: "var(--font-display)",
    fontSize: "clamp(40px, 5vw, 72px)",
    fontWeight: 800,
    lineHeight: 1.0,
    letterSpacing: "-0.03em",
    color: "var(--cream)",
  },
  h2Outline: {
    color: "transparent",
    WebkitTextStroke: "1.5px var(--cream-dim)",
  },
  bodyText: {
    fontFamily: "var(--font-body)",
    fontSize: "16px",
    lineHeight: 1.7,
    color: "var(--text-muted)",
  },

  /* FEATURES */
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "2px",
    marginTop: "80px",
    border: "1px solid var(--border)",
  },
  featureCard: {
    background: "var(--surface)",
    padding: "48px 40px",
    borderRight: "1px solid var(--border)",
    transition: "background 0.3s",
    position: "relative" as const,
    overflow: "hidden",
  },
  featureIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
    marginBottom: "28px",
    flexShrink: 0,
  },
  featureTitle: {
    fontFamily: "var(--font-display)",
    fontSize: "20px",
    fontWeight: 700,
    color: "var(--cream)",
    letterSpacing: "-0.02em",
    marginBottom: "12px",
  },

  /* DEMO / PREVIEW */
  demoWrap: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "24px",
    overflow: "hidden",
    marginTop: "64px",
    position: "relative" as const,
  },
  demoBar: {
    background: "var(--surface-2)",
    padding: "14px 20px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    borderBottom: "1px solid var(--border)",
  },
  dot: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
  },
  demoContent: {
    display: "grid",
    gridTemplateColumns: "260px 1fr",
    minHeight: "460px",
  },
  demoSidebar: {
    background: "rgba(255,255,255,0.02)",
    borderRight: "1px solid var(--border)",
    padding: "24px 16px",
  },
  demoMain: {
    padding: "40px 48px",
  },

  /* STATS */
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "1px",
    background: "var(--border)",
    border: "1px solid var(--border)",
    marginTop: "80px",
  },
  statCard: {
    background: "var(--bg)",
    padding: "48px 40px",
    textAlign: "center" as const,
  },
  statNum: {
    fontFamily: "var(--font-display)",
    fontSize: "64px",
    fontWeight: 800,
    letterSpacing: "-0.04em",
    color: "var(--cream)",
    lineHeight: 1,
    animation: "count-up 0.8s ease both",
  },
  statLabel: {
    fontFamily: "var(--font-body)",
    fontSize: "14px",
    color: "var(--text-muted)",
    marginTop: "8px",
  },

  /* TESTIMONIALS */
  testimonialGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
    marginTop: "64px",
  },
  testimonialCard: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "16px",
    padding: "36px 32px",
    transition: "border-color 0.3s",
  },
  quote: {
    fontFamily: "var(--font-body)",
    fontSize: "15px",
    lineHeight: 1.7,
    color: "var(--cream-dim)",
    marginBottom: "28px",
    fontStyle: "italic",
  },
  avatarRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: "15px",
    color: "#000",
    flexShrink: 0,
  },
  avatarName: {
    fontFamily: "var(--font-display)",
    fontWeight: 600,
    fontSize: "14px",
    color: "var(--cream)",
  },
  avatarRole: {
    fontFamily: "var(--font-body)",
    fontSize: "12px",
    color: "var(--text-muted)",
    marginTop: "2px",
  },

  /* PRICING */
  pricingGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
    marginTop: "64px",
  },
  pricingCard: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "20px",
    padding: "48px 36px",
    position: "relative" as const,
    overflow: "hidden",
    transition: "transform 0.3s, border-color 0.3s",
  },
  pricingCardFeatured: {
    background: "var(--lime)",
    border: "none",
    borderRadius: "20px",
    padding: "48px 36px",
    position: "relative" as const,
    overflow: "hidden",
    transform: "scale(1.04)",
  },
  planName: {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: "13px",
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    marginBottom: "24px",
  },
  planPrice: {
    fontFamily: "var(--font-display)",
    fontWeight: 800,
    fontSize: "56px",
    letterSpacing: "-0.04em",
    lineHeight: 1,
  },
  planPer: {
    fontFamily: "var(--font-body)",
    fontSize: "14px",
    opacity: 0.6,
    marginLeft: "4px",
  },

  /* CTA */
  ctaSection: {
    padding: "120px 40px",
    textAlign: "center" as const,
    position: "relative" as const,
    overflow: "hidden",
  },

  /* FOOTER */
  footer: {
    borderTop: "1px solid var(--border)",
    padding: "64px 40px 40px",
  },
  footerGrid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr 1fr",
    gap: "48px",
    marginBottom: "64px",
  },
  footerLink: {
    display: "block",
    fontFamily: "var(--font-body)",
    fontSize: "14px",
    color: "var(--text-muted)",
    marginBottom: "12px",
    transition: "color 0.2s",
  },
  footerHeading: {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: "13px",
    color: "var(--cream)",
    marginBottom: "20px",
    letterSpacing: "0.04em",
    textTransform: "uppercase" as const,
  },
};

/* ─────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────── */

function FloatingShape({
  style,
  children,
}: {
  style: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        position: "absolute",
        pointerEvents: "none",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function FlowerShape() {
  return (
    <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
      <ellipse
        cx="45" cy="22" rx="18" ry="26"
        fill="url(#fl1)"
        transform="rotate(0 45 45)"
      />
      <ellipse
        cx="45" cy="22" rx="18" ry="26"
        fill="url(#fl2)"
        transform="rotate(90 45 45)"
      />
      <ellipse
        cx="45" cy="22" rx="18" ry="26"
        fill="url(#fl3)"
        transform="rotate(180 45 45)"
      />
      <ellipse
        cx="45" cy="22" rx="18" ry="26"
        fill="url(#fl4)"
        transform="rotate(270 45 45)"
      />
      <defs>
        <linearGradient id="fl1" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#f97316" />
          <stop offset="1" stopColor="#fb923c" />
        </linearGradient>
        <linearGradient id="fl2" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#a855f7" />
          <stop offset="1" stopColor="#ec4899" />
        </linearGradient>
        <linearGradient id="fl3" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#b8ff35" />
          <stop offset="1" stopColor="#84cc16" />
        </linearGradient>
        <linearGradient id="fl4" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#06b6d4" />
          <stop offset="1" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function WormShape() {
  return (
    <svg width="48" height="120" viewBox="0 0 48 120" fill="none">
      <path
        d="M24 0 C44 20, 4 40, 24 60 C44 80, 4 100, 24 120"
        stroke="url(#wg)"
        strokeWidth="14"
        strokeLinecap="round"
        fill="none"
      />
      <defs>
        <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#8b5cf6" />
          <stop offset="0.5" stopColor="#a78bfa" />
          <stop offset="1" stopColor="#ec4899" />
        </linearGradient>
      </defs>
    </svg>
  );
}

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

/* ─────────────────────────────────────────────
   MOCK FORM BUILDER PREVIEW
───────────────────────────────────────────── */
const FIELD_TYPES = [
  { icon: "T", label: "Text Input" },
  { icon: "✉", label: "Email" },
  { icon: "☎", label: "Phone" },
  { icon: "↓", label: "Dropdown" },
  { icon: "⊙", label: "Radio" },
  { icon: "☑", label: "Checkbox" },
  { icon: "📅", label: "Date" },
  { icon: "★", label: "Rating" },
];

function FormBuilderPreview() {
  const [activeField, setActiveField] = useState(1);
  const [fields, setFields] = useState([
    { id: 1, type: "Text Input", label: "Full Name", required: true },
    { id: 2, type: "Email", label: "Email Address", required: true },
    { id: 3, type: "Dropdown", label: "Company Size", required: false },
  ]);

  const addField = (type: string) => {
    setFields([
      ...fields,
      { id: Date.now(), type, label: `New ${type}`, required: false },
    ]);
  };

  return (
    <div style={S.demoWrap}>
      <div style={S.demoBar}>
        <div style={{ ...S.dot, background: "#ff5f57" }} />
        <div style={{ ...S.dot, background: "#ffbd2e" }} />
        <div style={{ ...S.dot, background: "#28c840" }} />
        <span
          style={{
            marginLeft: "16px",
            fontFamily: "var(--font-body)",
            fontSize: "12px",
            color: "var(--text-muted)",
          }}
        >
          formulate.io/builder — Contact Form
        </span>
        <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
          {["Preview", "Share", "Publish"].map((b) => (
            <button
              key={b}
              style={{
                background:
                  b === "Publish" ? "var(--lime)" : "rgba(255,255,255,0.05)",
                color: b === "Publish" ? "#000" : "var(--cream-dim)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                padding: "4px 12px",
                fontSize: "12px",
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      <div style={S.demoContent}>
        {/* Sidebar */}
        <div style={S.demoSidebar}>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "10px",
              fontWeight: 700,
              color: "var(--text-subtle)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}
          >
            Field Types
          </div>
          {FIELD_TYPES.map((f) => (
            <div
              key={f.label}
              onClick={() => addField(f.label)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "9px 12px",
                borderRadius: "8px",
                marginBottom: "4px",
                cursor: "pointer",
                transition: "background 0.15s",
                background: "rgba(255,255,255,0.02)",
                fontSize: "13px",
                fontFamily: "var(--font-body)",
                color: "var(--cream-dim)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(184,255,53,0.08)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.02)")
              }
            >
              <span
                style={{
                  width: "26px",
                  height: "26px",
                  background: "rgba(184,255,53,0.1)",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  color: "var(--lime)",
                }}
              >
                {f.icon}
              </span>
              {f.label}
            </div>
          ))}
        </div>

        {/* Canvas */}
        <div style={S.demoMain}>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "22px",
              color: "var(--cream)",
              marginBottom: "6px",
              letterSpacing: "-0.02em",
            }}
          >
            Contact Us
          </div>
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              color: "var(--text-muted)",
              marginBottom: "28px",
            }}
          >
            We'd love to hear from you. Fill out the form below.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {fields.map((field) => (
              <div
                key={field.id}
                onClick={() => setActiveField(field.id)}
                style={{
                  background:
                    activeField === field.id
                      ? "rgba(184,255,53,0.05)"
                      : "rgba(255,255,255,0.02)",
                  border: `1px solid ${
                    activeField === field.id
                      ? "rgba(184,255,53,0.3)"
                      : "var(--border)"
                  }`,
                  borderRadius: "10px",
                  padding: "16px 20px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "12px",
                    fontWeight: 600,
                    color:
                      activeField === field.id
                        ? "var(--lime)"
                        : "var(--cream)",
                    marginBottom: "8px",
                  }}
                >
                  {field.label}
                  {field.required && (
                    <span style={{ color: "#f97316", marginLeft: "4px" }}>
                      *
                    </span>
                  )}
                </div>
                <div
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    borderRadius: "6px",
                    padding: "10px 14px",
                    fontSize: "13px",
                    color: "var(--text-subtle)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {field.type === "Dropdown" ? "Select an option ▾" : `Enter ${field.label.toLowerCase()}…`}
                </div>
              </div>
            ))}
            <div
              style={{
                border: "1.5px dashed rgba(184,255,53,0.2)",
                borderRadius: "10px",
                padding: "16px",
                textAlign: "center",
                fontSize: "13px",
                color: "var(--text-subtle)",
                fontFamily: "var(--font-body)",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "rgba(184,255,53,0.5)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "rgba(184,255,53,0.2)")
              }
              onClick={() => addField("Text Input")}
            >
              + Click a field type to add
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PRICING CARD
───────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */
export default function Page() {
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Parallax on hero text */
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const onMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const x = (clientX / w - 0.5) * 20;
      const y = (clientY / h - 0.5) * 10;
      const shapes = hero.querySelectorAll<HTMLElement>(".parallax-shape");
      shapes.forEach((el, i) => {
        const depth = (i + 1) * 0.6;
        el.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const tickerItems = [
    "Drag & Drop Builder",
    "Conditional Logic",
    "Real-time Analytics",
    "500+ Integrations",
    "Multi-step Forms",
    "AI-powered Fields",
    "Custom Domains",
    "Team Collaboration",
  ];

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

  return (
    <>
      {/* ── ANNOUNCEMENT BANNER ── */}
      <div style={S.banner}>
        🎉 Formulate is now free for everyone — Introducing the Free tier →
      </div>

      {/* ── NAV ── */}
      <nav
        style={{
          ...S.nav,
          boxShadow: scrolled ? "0 4px 40px rgba(0,0,0,0.4)" : "none",
        }}
      >
        <div style={S.logo}>Formulate</div>

        {/* Truly centered — absolutely positioned so logo+actions don't shift it */}
        <ul style={S.navCenter}>
          {[
            { label: "Builder", id: "builder" },
            { label: "Templates", id: "templates" },
            { label: "Integrations", id: "integrations" },
            { label: "Analytics", id: "analytics" },
            { label: "Pricing", id: "pricing" },
          ].map(({ label, id }) => (
            <li
              key={label}
              style={{ cursor: "pointer", listStyle: "none" }}
              onClick={() =>
                document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
              }
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--lime)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--cream-dim)")
              }
            >
              {label}
            </li>
          ))}
        </ul>

        <div style={S.navActions}>
          <button style={S.btnGhost}>Log in</button>
          <button style={S.btnPrimary}>Get Formulate ↓</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={S.hero} ref={heroRef}>
        {/* Radial bg glow */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "700px",
            height: "700px",
            background:
              "radial-gradient(circle, rgba(184,255,53,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Floating shapes */}
        <FloatingShape
          style={{
            top: "60px",
            left: "380px",
            animation: "float 6s ease-in-out infinite",
          }}
        >
          <div className="parallax-shape">
            <FlowerShape />
          </div>
        </FloatingShape>

        <FloatingShape
          style={{
            bottom: "120px",
            right: "12%",
            animation: "float2 8s ease-in-out infinite",
          }}
        >
          <div className="parallax-shape">
            <WormShape />
          </div>
        </FloatingShape>

        <FloatingShape
          style={{
            top: "30%",
            right: "8%",
            animation: "spin-slow 20s linear infinite",
          }}
        >
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <rect
              x="4"
              y="4"
              width="56"
              height="56"
              rx="12"
              stroke="rgba(184,255,53,0.2)"
              strokeWidth="1.5"
              strokeDasharray="8 4"
            />
            <circle cx="32" cy="32" r="8" fill="rgba(184,255,53,0.15)" />
          </svg>
        </FloatingShape>

        <div style={S.heroEyebrow}>
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "var(--lime)",
              display: "inline-block",
              animation: "blink 1.5s ease infinite",
            }}
          />
          Professional Form Builder
        </div>

        <h1 style={S.heroTitle}>
          Build forms
          <br />
          <span style={S.heroTitleAccent}>that convert.</span>
        </h1>

        <p style={S.heroSub}>
          Formulate — A wildly powerful form builder built for professionals.
          Drag, drop, and launch beautiful forms with logic, analytics, and
          integrations in minutes.
        </p>

        <div style={S.heroActions}>
          <button style={S.btnLarge}>
            Start building free
            <span
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                background: "rgba(0,0,0,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "13px",
              }}
            >
              ↓
            </span>
          </button>
          <button style={S.btnOutlineLarge}>Watch 2-min demo →</button>
        </div>

        <div
          style={{
            marginTop: "80px",
            display: "flex",
            alignItems: "center",
            gap: "32px",
          }}
        >
          {[
            { n: "50K+", l: "Forms built" },
            { n: "12M+", l: "Submissions" },
            { n: "4.9★", l: "Average rating" },
          ].map((s) => (
            <div key={s.n}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "24px",
                  color: "var(--cream)",
                  letterSpacing: "-0.03em",
                }}
              >
                {s.n}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "12px",
                  color: "var(--text-muted)",
                }}
              >
                {s.l}
              </div>
            </div>
          ))}
          <div
            style={{
              height: "40px",
              width: "1px",
              background: "var(--border)",
              margin: "0 4px",
            }}
          />
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              color: "var(--text-muted)",
            }}
          >
            Trusted by teams at
          </div>
          {["Notion", "Linear", "Loom", "Figma"].map((b) => (
            <div
              key={b}
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "14px",
                color: "var(--text-subtle)",
                letterSpacing: "-0.01em",
              }}
            >
              {b}
            </div>
          ))}
        </div>
      </section>

      {/* ── TICKER ── */}
      <div style={S.ticker}>
        <div style={S.tickerInner}>
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: "24px" }}>
              {item}
              {i < tickerItems.length * 2 - 1 && (
                <span style={S.tickerDot}>◆</span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* ── FORM BUILDER DEMO ── */}
      <section
        id="builder"
        style={{ ...S.section, background: "var(--surface)" }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={S.label}>The Builder</div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: "40px",
            }}
          >
            <h2 style={{ ...S.h2, maxWidth: "540px" }}>
              Every form,{" "}
              <span style={S.h2Outline}>exactly how you imagine it.</span>
            </h2>
            <p style={{ ...S.bodyText, maxWidth: "320px" }}>
              Click any field type in the sidebar to add it to your form. It&apos;s
              that fast. Try it right here.
            </p>
          </div>
          <FormBuilderPreview />
        </div>
      </section>

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

      {/* ── FOOTER ── */}
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
    </>
  );
}
