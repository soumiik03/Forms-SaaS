"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { authStore } from "~/lib/auth"
import { trpc } from "~/trpc/client"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!authStore.isLoggedIn()) {
      router.replace("/login")
    } else {
      setReady(true)
    }
  }, [router])

  if (!ready) {
    return (
      <div style={{
        minHeight: "100vh", background: "#080808",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          border: "2px solid rgba(255,255,255,0.08)",
          borderTop: "2px solid var(--lime)",
          animation: "spin 0.8s linear infinite",
        }}/>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", background: "#080808", display: "flex" }}>
      <Sidebar pathname={pathname} router={router} />
      <main style={{ flex: 1, marginLeft: 220, minHeight: "100vh" }}>
        {children}
      </main>
    </div>
  )
}

function Sidebar({ pathname, router }: { pathname: string; router: ReturnType<typeof useRouter> }) {
  const logout = trpc.auth.logout.useMutation({
    onSuccess: () => {
      authStore.clearToken()
      router.push("/login")
    },
  })

  const navItems = [
    { icon: "▦", label: "Overview",  href: "/dashboard" },
    { icon: "◈", label: "My Forms",  href: "/dashboard/forms" },
    { icon: "◎", label: "Responses", href: "/dashboard/responses" },
    { icon: "◐", label: "Analytics", href: "/dashboard/analytics" },
    { icon: "◻", label: "Explore",   href: "/explore" },
  ]

  return (
    <aside style={{
      width: 220, height: "100vh",
      position: "fixed", left: 0, top: 0,
      background: "#0D0D0D",
      borderRight: "1px solid rgba(255,255,255,0.06)",
      display: "flex", flexDirection: "column",
      padding: "0 0 24px",
      zIndex: 50,
    }}>
      {/* Logo */}
      <div style={{
        padding: "20px 20px 16px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <Link href="/dashboard" style={{
          display: "flex", alignItems: "center", gap: 8,
          textDecoration: "none",
        }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2L18 6.5V13.5L10 18L2 13.5V6.5L10 2Z"
              stroke="var(--lime)" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M10 2V18M2 6.5L10 11L18 6.5"
              stroke="var(--lime)" strokeWidth="1.5" strokeLinejoin="round"/>
          </svg>
          <span style={{
            fontFamily: "var(--font-display)", fontWeight: 700,
            fontSize: 15, color: "var(--cream)", letterSpacing: "-0.02em",
          }}>Formulate</span>
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 10px" }}>
        <div style={{
          fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
          textTransform: "uppercase", color: "rgba(255,255,255,0.25)",
          padding: "4px 10px", marginBottom: 6,
        }}>Workspace</div>

        {navItems.map(item => {
          const active = pathname === item.href
          return (
            <Link key={item.href} href={item.href} style={{
              display: "flex", alignItems: "center", gap: 9,
              padding: "8px 10px", borderRadius: 8, marginBottom: 2,
              background: active ? "rgba(184,255,53,0.08)" : "transparent",
              textDecoration: "none",
              transition: "background .15s",
            }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.04)" }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent" }}
            >
              <span style={{ fontSize: 12, color: active ? "var(--lime)" : "rgba(255,255,255,0.35)" }}>
                {item.icon}
              </span>
              <span style={{
                fontSize: 13, fontWeight: active ? 600 : 400,
                color: active ? "var(--cream)" : "rgba(255,255,255,0.5)",
                fontFamily: "var(--font-display)",
              }}>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "0 10px" }}>
        <div style={{
          height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 12,
        }}/>
        <Link href="/dashboard/settings" style={{
          display: "flex", alignItems: "center", gap: 9,
          padding: "8px 10px", borderRadius: 8, marginBottom: 4,
          textDecoration: "none",
          color: "rgba(255,255,255,0.4)",
        }}
        onMouseEnter={e => e.currentTarget.style.color = "var(--cream)"}
        onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}
        >
          <span style={{ fontSize: 12 }}>⚙</span>
          <span style={{ fontSize: 13, fontFamily: "var(--font-display)" }}>Settings</span>
        </Link>

        <button onClick={() => logout.mutate({})} style={{
          width: "100%", display: "flex", alignItems: "center", gap: 9,
          padding: "8px 10px", borderRadius: 8,
          background: "transparent", border: "none", cursor: "pointer",
          color: "rgba(255,255,255,0.4)",
          transition: "color .15s",
        }}
        onMouseEnter={e => e.currentTarget.style.color = "#f87171"}
        onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}
        >
          <span style={{ fontSize: 12 }}>→</span>
          <span style={{ fontSize: 13, fontFamily: "var(--font-display)" }}>
            {logout.isPending ? "Signing out..." : "Sign out"}
          </span>
        </button>
      </div>
    </aside>
  )
}