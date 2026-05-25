"use client"
import { useState } from "react"
import Link from "next/link"
import { trpc } from "~/trpc/client"

export default function ExplorePage() {
  const { data: forms, isLoading } = trpc.form.getPublicForms.useQuery({})

  return (
    <div style={{ minHeight: "100vh", background: "#080808" }}>
      {/* Navbar */}
      <nav style={{
        height: 56, display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "0 48px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(8,8,8,0.9)", backdropFilter: "blur(12px)",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <Link href="/" style={{
          fontFamily: "var(--font-display)", fontWeight: 700,
          fontSize: 16, color: "var(--cream)", textDecoration: "none",
          letterSpacing: "-0.02em",
        }}>Formulate</Link>
        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/dashboard" style={{
            fontSize: 14, color: "rgba(255,255,255,0.58)",
            textDecoration: "none", padding: "7px 16px",
            fontFamily: "var(--font-display)", fontWeight: 500,
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 8,
          }}>Back to dashboard</Link>
          <Link href="/login" style={{
            fontSize: 14, color: "rgba(255,255,255,0.5)",
            textDecoration: "none", padding: "7px 16px",
            fontFamily: "var(--font-display)", fontWeight: 500,
          }}>Sign in</Link>
          <Link href="/register" style={{
            fontSize: 14, color: "#000",
            background: "var(--lime)",
            textDecoration: "none", padding: "7px 18px",
            fontFamily: "var(--font-display)", fontWeight: 700,
            borderRadius: 8,
          }}>Get started</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 48px" }}>
        {/* Header */}
        <div style={{ marginBottom: 56 }}>
          <p style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.16em",
            textTransform: "uppercase", color: "var(--lime)",
            marginBottom: 16, fontFamily: "var(--font-display)",
          }}>Explore</p>
          <h1 style={{
            fontFamily: "var(--font-display)", fontWeight: 800,
            fontSize: "clamp(32px, 5vw, 56px)",
            color: "var(--cream)", letterSpacing: "-0.03em",
            lineHeight: 1.05, marginBottom: 16,
          }}>
            Discover public forms
          </h1>
          <p style={{
            fontSize: 16, color: "rgba(255,255,255,0.45)",
            fontFamily: "var(--font-body)", lineHeight: 1.7,
            maxWidth: 480,
          }}>
            Browse forms created by the Formulate community.
            Fill them out directly — no account needed.
          </p>
        </div>

        {/* Forms grid */}
        {isLoading ? (
          <LoadingGrid />
        ) : forms?.length === 0 ? (
          <EmptyState />
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 16,
          }}>
            {forms?.map((form: any) => (
              <FormCard key={form.id} form={form} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function FormCard({ form }: { form: any }) {
  const [hov, setHov] = useState(false)

  return (
    <Link
      href={`/f/${form.slug}`}
      style={{
        display: "block", textDecoration: "none",
        padding: "28px",
        background: hov ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${hov ? "rgba(184,255,53,0.2)" : "rgba(255,255,255,0.07)"}`,
        borderRadius: 12,
        transition: "all .2s",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* Icon */}
      <div style={{
        width: 44, height: 44, borderRadius: 10,
        background: "rgba(184,255,53,0.08)",
        border: "1px solid rgba(184,255,53,0.15)",
        display: "flex", alignItems: "center",
        justifyContent: "center", marginBottom: 20,
        fontSize: 20,
      }}>◈</div>

      {/* Title */}
      <h3 style={{
        fontFamily: "var(--font-display)", fontWeight: 700,
        fontSize: 16, color: "var(--cream)",
        letterSpacing: "-0.02em", marginBottom: 8,
      }}>{form.title}</h3>

      {/* Description */}
      {form.description && (
        <p style={{
          fontSize: 13, color: "rgba(255,255,255,0.4)",
          fontFamily: "var(--font-body)", lineHeight: 1.6,
          marginBottom: 20,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>{form.description}</p>
      )}

      {/* Footer */}
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between", marginTop: "auto",
        paddingTop: 16,
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}>
        <span style={{
          fontSize: 12, color: "rgba(255,255,255,0.3)",
          fontFamily: "var(--font-body)",
        }}>
          {form.submissionCount ?? 0} responses
        </span>
        <span style={{
          fontSize: 12, fontWeight: 600,
          color: hov ? "var(--lime)" : "rgba(255,255,255,0.3)",
          fontFamily: "var(--font-display)",
          transition: "color .2s",
        }}>
          Fill out →
        </span>
      </div>
    </Link>
  )
}

function LoadingGrid() {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: 16,
    }}>
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} style={{
          height: 180, borderRadius: 12,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
          animation: "pulse 1.5s ease infinite",
        }}/>
      ))}
      <style>{`@keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:.8} }`}</style>
    </div>
  )
}

function EmptyState() {
  return (
    <div style={{
      textAlign: "center", padding: "80px 40px",
      border: "1.5px dashed rgba(255,255,255,0.08)",
      borderRadius: 16,
    }}>
      <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>◈</div>
      <h3 style={{
        fontFamily: "var(--font-display)", fontWeight: 700,
        fontSize: 20, color: "var(--cream)", marginBottom: 8,
        letterSpacing: "-0.02em",
      }}>No public forms yet</h3>
      <p style={{
        fontSize: 14, color: "rgba(255,255,255,0.35)",
        fontFamily: "var(--font-body)", marginBottom: 28,
      }}>
        Be the first to publish a public form on Formulate.
      </p>
      <Link href="/register" style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "10px 24px",
        background: "var(--lime)", color: "#000",
        fontFamily: "var(--font-display)", fontWeight: 700,
        fontSize: 13, textDecoration: "none", borderRadius: 8,
      }}>Create a form →</Link>
    </div>
  )
}

