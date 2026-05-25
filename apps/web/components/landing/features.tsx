"use client";

import { useState } from "react";
import { BarChart3, Eye, FileText, Link2, Lock, MousePointer2 } from "lucide-react";
import { S } from "./landing-styles";

function FeatureCard({
  icon,
  color,
  title,
  body,
}: {
  icon: React.ReactNode;
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
      <div style={{ ...S.featureIcon, background: `${color}18`, color }}>
        {icon}
      </div>
      <div style={S.featureTitle}>{title}</div>
      <p style={{ ...S.bodyText, fontSize: "14px" }}>{body}</p>
    </div>
  );
}

const features = [
  {
    icon: <MousePointer2 size={22} />,
    color: "var(--lime)",
    title: "Fast visual building",
    body: "Add fields, tune labels, set required answers, and publish without leaving the builder.",
  },
  {
    icon: <Lock size={22} />,
    color: "#10b981",
    title: "Controlled visibility",
    body: "Keep a form unlisted for direct sharing or make it public when it belongs in Explore.",
  },
  {
    icon: <BarChart3 size={22} />,
    color: "#60a5fa",
    title: "Live performance context",
    body: "Monitor views, responses, and completion rate from the dashboard as submissions arrive.",
  },
  {
    icon: <FileText size={22} />,
    color: "var(--orange)",
    title: "Clean response review",
    body: "Open submissions, scan answers, and understand what came in without spreadsheet friction.",
  },
  {
    icon: <Link2 size={22} />,
    color: "#06b6d4",
    title: "Shareable form links",
    body: "Copy a polished public link with one click and send it anywhere your audience already is.",
  },
  {
    icon: <Eye size={22} />,
    color: "var(--pink)",
    title: "Focused form experience",
    body: "Respondents get a quiet, branded page that keeps attention on the questions that matter.",
  },
];

export function Features() {
  return (
    <>
      <section id="templates" style={S.section}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={S.label}>Capabilities</div>
          <h2 style={S.h2}>
            A composed workflow for{" "}
            <span style={S.h2Outline}>serious data collection.</span>
          </h2>
          <div style={S.featuresGrid}>
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      <section
        id="analytics"
        style={{
          padding: "88px 40px",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "minmax(0, 0.9fr) minmax(0, 1.1fr)",
            gap: "56px",
            alignItems: "center",
          }}
        >
          <div>
            <div style={S.label}>Analytics</div>
            <h2 style={{ ...S.h2, fontSize: "clamp(36px, 4vw, 58px)" }}>
              Know what is happening after you share.
            </h2>
          </div>
          <p style={{ ...S.bodyText, margin: 0 }}>
            Formulate tracks views, submitted responses, and completion rate so
            teams can spot whether a form is being seen, finished, and worth
            improving.
          </p>
        </div>
      </section>

      <section id="integrations" style={{ ...S.section, background: "var(--surface)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={S.label}>Publishing</div>
          <h2 style={{ ...S.h2, marginBottom: "24px" }}>
            Share forms with the{" "}
            <span style={S.h2Outline}>right audience.</span>
          </h2>
          <p style={{ ...S.bodyText, maxWidth: 680, marginBottom: 0 }}>
            Use public forms when discovery matters, or keep a form unlisted
            when only people with the direct link should access it.
          </p>
        </div>
      </section>
    </>
  );
}
