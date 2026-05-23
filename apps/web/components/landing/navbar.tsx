"use client";

import { useEffect, useState } from "react";
import { S } from "./landing-styles";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    </>
  );
}
