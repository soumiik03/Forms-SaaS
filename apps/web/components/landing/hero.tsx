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
      <section style={{ ...S.hero, paddingTop: "100px" }} ref={heroRef}>

        {/* Radial bg glow */}
        <div style={{
          position: "absolute",
          top: "10%", left: "50%",
          transform: "translateX(-50%)",
          width: "700px", height: "700px",
          background: "radial-gradient(circle, rgba(184,255,53,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}/>

        {/* Only worm — bottom right */}
        <FloatingShape style={{
          bottom: "120px", right: "12%",
          animation: "float2 8s ease-in-out infinite",
        }}>
          <div className="parallax-shape">
            <WormShape />
          </div>
        </FloatingShape>

        {/* Eyebrow */}
        <div style={S.heroEyebrow}>
          <span style={{
            width: "6px", height: "6px", borderRadius: "50%",
            background: "var(--lime)", display: "inline-block",
            animation: "blink 1.5s ease infinite",
          }}/>
          Professional Form Builder
        </div>

        {/* Title */}
        <h1 style={S.heroTitle}>
          Build forms
          <br />
          <span style={S.heroTitleAccent}>that convert.</span>
        </h1>

        {/* Sub */}
        <p style={S.heroSub}>
          Formulate — A wildly powerful form builder built for professionals.
          Drag, drop, and launch beautiful forms with logic, analytics, and
          integrations in minutes.
        </p>

        {/* Single CTA */}
        <div style={S.heroActions}>
          <button style={S.btnLarge}>
            Start building free
            <span style={{
              width: "24px", height: "24px", borderRadius: "50%",
              background: "rgba(0,0,0,0.2)",
              display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: "13px",
            }}>↓</span>
          </button>
        </div>

        {/* Stats — bigger, cleaner, no fake trust badges */}
        <div style={{
          marginTop: "72px",
          display: "flex",
          alignItems: "center",
          gap: "48px",
        }}>
          {[
            { n: "50K+",  l: "Forms built" },
            { n: "12M+",  l: "Submissions" },
            { n: "4.9★",  l: "Average rating" },
          ].map((s, i) => (
            <div key={s.n} style={{ display: "flex", alignItems: "center", gap: "48px" }}>
              {i > 0 && (
                <div style={{
                  height: "48px", width: "1px",
                  background: "var(--border)",
                  marginRight: "-24px",
                }}/>
              )}
              <div>
                <div style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "40px",
                  color: "var(--cream)",
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                }}>
                  {s.n}
                </div>
                <div style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "13px",
                  color: "var(--text-muted)",
                  marginTop: "6px",
                }}>
                  {s.l}
                </div>
              </div>
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