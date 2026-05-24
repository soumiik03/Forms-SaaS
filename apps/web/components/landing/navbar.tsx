"use client";

import { useEffect, useState } from "react";
import { S } from "./landing-styles";
import Link from "next/link";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 48px",
        height: "68px",
        background: scrolled
          ? "rgba(10, 10, 10, 0.82)"
          : "rgba(10, 10, 10, 0.55)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderBottom: scrolled
          ? "1px solid rgba(255,255,255,0.07)"
          : "1px solid transparent",
        transition: "background 0.3s ease, border-color 0.3s ease",
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: "21px",
          color: "var(--cream)",
          letterSpacing: "-0.04em",
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          minWidth: "140px",
        }}
      >
        {/* Tiny cube icon like Cursor */}
        <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
          <path d="M10 2L18 6.5V13.5L10 18L2 13.5V6.5L10 2Z" stroke="var(--cream)" strokeWidth="1.5" strokeLinejoin="round"/>
          <path d="M10 2V18M2 6.5L10 11L18 6.5" stroke="var(--cream)" strokeWidth="1.5" strokeLinejoin="round"/>
        </svg>
        Formulate
      </Link>

      {/* Center links — absolutely centered like Cursor */}
      <ul
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          margin: 0,
          padding: 0,
          listStyle: "none",
        }}
      >
        {[
          { label: "Builder",      id: "builder" },
          { label: "Templates",    id: "templates" },
          { label: "Integrations", id: "integrations" },
          { label: "Analytics",    id: "analytics" },
          { label: "Pricing",      id: "pricing" },
        ].map(({ label, id }) => (
          <NavLink key={label} label={label} id={id} />
        ))}
      </ul>

      {/* Right actions */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          minWidth: "140px",
          justifyContent: "flex-end",
        }}
      >
        <Link
          href="/login"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            fontSize: "15px",
            color: "rgba(200,192,168,0.6)",
            textDecoration: "none",
            padding: "8px 16px",
            borderRadius: "8px",
            transition: "color 0.15s, background 0.15s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = "var(--cream)";
            e.currentTarget.style.background = "rgba(255,255,255,0.06)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = "rgba(200,192,168,0.6)";
            e.currentTarget.style.background = "transparent";
          }}
        >
          Sign in
        </Link>

        <Link
          href="/register"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: "15px",
            color: "#0a0a0a",
            textDecoration: "none",
            padding: "8px 20px",
            borderRadius: "8px",
            background: "var(--cream)",
            border: "1px solid rgba(255,255,255,0.15)",
            transition: "opacity 0.15s",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          Get started
        </Link>
      </div>
    </nav>
  );
}

function NavLink({ label, id }: { label: string; id: string }) {
  const [hov, setHov] = useState(false);

  const scrollTo = () => {
    const el = document.getElementById(id);
    if (!el) return;
    const navH = 68;
    const top = el.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <li
      style={{
        cursor: "pointer",
        listStyle: "none",
        padding: "7px 16px",
        borderRadius: "8px",
        color: hov ? "var(--cream)" : "rgba(200,192,168,0.55)",
        background: hov ? "rgba(255,255,255,0.07)" : "transparent",
        transition: "color 0.15s, background 0.15s",
        fontSize: "15px",
        fontFamily: "var(--font-display)",
        fontWeight: 500,
        letterSpacing: "-0.01em",
        userSelect: "none",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={scrollTo}
    >
      {label}
    </li>
  );
}