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

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

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

  return (
    <>
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
    </>
  );
}
