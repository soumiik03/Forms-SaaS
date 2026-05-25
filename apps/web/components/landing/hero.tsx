"use client";

import { useEffect, useRef } from "react";
import { S } from "./landing-styles";

function FloatingShape({
  style,
  children,
}: {
  style: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <div style={{ position: "absolute", pointerEvents: "none", ...style }}>
      {children}
    </div>
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

const tickerItems = [
  "Visual Builder",
  "Public And Unlisted Forms",
  "Response Tracking",
  "Completion Analytics",
  "Field Validation",
  "Shareable Form Links",
  "Email Confirmations",
  "No-code Publishing",
];

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      const shapes = hero.querySelectorAll<HTMLElement>(".parallax-shape");
      shapes.forEach((el, i) => {
        const depth = (i + 1) * 0.6;
        el.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      <section id="hero" style={S.hero} ref={heroRef}>
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
          Modern form operations
        </div>

        {/* 3-line hero title — fills the viewport width nicely at 100% zoom */}
        <h1 style={S.heroTitle}>
          <span style={{ display: "block" }}>
            Design
          </span>
          <span style={{ display: "block" }}>
            polished forms
          </span>
          <span style={{ ...S.heroTitleAccent, display: "block" }}>
            people trust.
          </span>
        </h1>
      </section>

      <div style={S.ticker}>
        <div style={S.tickerInner}>
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={`${item}-${i}`} style={{ display: "flex", alignItems: "center", gap: "24px" }}>
              {item}
              {i < tickerItems.length * 2 - 1 && <span style={S.tickerDot}>/</span>}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}