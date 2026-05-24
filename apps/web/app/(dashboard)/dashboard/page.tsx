"use client"

import { useState } from "react"
import Link from "next/link"
import { trpc } from "~/trpc/client"

export default function DashboardPage() {
  const { data: forms, isLoading } = trpc.form.getMyForms.useQuery({})
  const { data: me } = trpc.auth.me.useQuery({})

  const publishedForms = forms?.filter(f => f.status === "published") ?? []
  const totalResponses = forms?.reduce((acc, f) => acc + (f.submissionCount ?? 0), 0) ?? 0

  return (
    <div style={{ padding: "40px 48px", maxWidth: 1100 }}>
      {/* Header */}
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "flex-start", marginBottom: 40,
      }}>
        <div>
          <h1 style={{
            fontFamily: "var(--font-display)", fontWeight: 800,
            fontSize: 28, color: "var(--cream)", letterSpacing: "-0.04em",
            marginBottom: 6,
          }}>
            {me ? `Hey, ${me.fullName.split(" ")[0]} 👋` : "Dashboard"}
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-body)" }}>
            Here's what's happening with your forms today.
          </p>
        </div>
        <Link href="/dashboard/forms/new" style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "10px 20px",
          background: "var(--lime)", color: "#000",
          fontFamily: "var(--font-display)", fontWeight: 700,
          fontSize: 13, textDecoration: "none",
          borderRadius: 8, transition: "opacity .15s",
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >
          + New Form
        </Link>
      </div>

      {/* Stats */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
        gap: 16, marginBottom: 40,
      }}>
        {[
          { label: "Total Forms",   value: forms?.length ?? 0,     color: "var(--cream)",        loading: isLoading },
          { label: "Live Forms",    value: publishedForms.length,   color: "var(--lime)",         loading: isLoading },
          { label: "Responses",     value: totalResponses,          color: "#60a5fa",             loading: isLoading },
          { label: "Completion",    value: "—",                     color: "rgba(255,255,255,0.4)", loading: false },
        ].map(s => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Forms list */}
      <div>
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: 16,
        }}>
          <h2 style={{
            fontFamily: "var(--font-display)", fontWeight: 700,
            fontSize: 16, color: "var(--cream)", letterSpacing: "-0.02em",
          }}>Your Forms</h2>
          <Link href="/dashboard/forms" style={{
            fontSize: 13, color: "rgba(255,255,255,0.4)",
            textDecoration: "none", fontFamily: "var(--font-body)",
            transition: "color .15s",
          }}
          onMouseEnter={e => e.currentTarget.style.color = "var(--cream)"}
          onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}
          >
            View all →
          </Link>
        </div>

        {isLoading ? (
          <LoadingSkeleton />
        ) : forms?.length === 0 ? (
          <EmptyState />
        ) : (
          <div style={{
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, overflow: "hidden",
          }}>
            {/* Table header */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 120px 100px 120px 80px",
              padding: "10px 20px",
              background: "rgba(255,255,255,0.02)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}>
              {["Form", "Visibility", "Responses", "Created", ""].map(h => (
                <div key={h} style={{
                  fontSize: 11, fontWeight: 600,
                  color: "rgba(255,255,255,0.3)",
                  letterSpacing: "0.06em", textTransform: "uppercase",
                  fontFamily: "var(--font-display)",
                }}>{h}</div>
              ))}
            </div>

            {/* Rows */}
            {forms?.slice(0, 8).map((form, i) => (
              <FormRow
                key={form.id}
                form={form}
                isLast={i === (forms?.length ?? 0) - 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ── STAT CARD ─────────────────────────────────────────── */
function StatCard({ label, value, color, loading }: {
  label: string; value: number | string; color: string; loading: boolean
}) {
  return (
    <div style={{
      padding: "20px 24px",
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 12,
    }}>
      <div style={{
        fontSize: 11, color: "rgba(255,255,255,0.35)",
        fontFamily: "var(--font-display)", fontWeight: 600,
        letterSpacing: "0.06em", textTransform: "uppercase",
        marginBottom: 10,
      }}>{label}</div>
      <div style={{
        fontSize: 32, fontWeight: 800, color,
        fontFamily: "var(--font-display)", letterSpacing: "-0.04em",
        lineHeight: 1,
        opacity: loading ? 0.3 : 1,
        transition: "opacity .3s",
      }}>
        {loading ? "—" : value}
      </div>
    </div>
  )
}

/* ── FORM ROW ──────────────────────────────────────────── */
function FormRow({ form, isLast }: { form: any; isLast: boolean }) {
  const [hov, setHov] = useState(false)
  const isLive = form.status === "published"

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 120px 100px 120px 80px",
      padding: "14px 20px",
      alignItems: "center",
      borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.04)",
      background: hov ? "rgba(255,255,255,0.02)" : "transparent",
      transition: "background .15s",
    }}
    onMouseEnter={() => setHov(true)}
    onMouseLeave={() => setHov(false)}
    >
      {/* Name */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
          background: isLive ? "var(--lime)" : "rgba(255,255,255,0.2)",
          boxShadow: isLive ? "0 0 6px var(--lime)" : "none",
        }}/>
        <div>
          <div style={{
            fontSize: 14, fontWeight: 600,
            color: "var(--cream)", fontFamily: "var(--font-display)",
          }}>{form.title}</div>
          {form.description && (
            <div style={{
              fontSize: 12, color: "rgba(255,255,255,0.3)",
              fontFamily: "var(--font-body)", marginTop: 2,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              maxWidth: 280,
            }}>{form.description}</div>
          )}
        </div>
      </div>

      {/* Visibility */}
      <div>
        <span style={{
          fontSize: 11, fontWeight: 600, padding: "3px 10px",
          borderRadius: 99, fontFamily: "var(--font-display)",
          background: form.visibility === "public"
            ? "rgba(96,165,250,0.12)" : "rgba(255,255,255,0.06)",
          color: form.visibility === "public"
            ? "#60a5fa" : "rgba(255,255,255,0.35)",
          border: `1px solid ${form.visibility === "public"
            ? "rgba(96,165,250,0.2)" : "rgba(255,255,255,0.08)"}`,
        }}>
          {form.visibility ?? "unlisted"}
        </span>
      </div>

      {/* Responses */}
      <div style={{
        fontSize: 14, color: "rgba(255,255,255,0.5)",
        fontFamily: "var(--font-body)",
      }}>
        {form.submissionCount ?? 0}
      </div>

      {/* Date */}
      <div style={{
        fontSize: 13, color: "rgba(255,255,255,0.3)",
        fontFamily: "var(--font-body)",
      }}>
        {form.createdAt
          ? new Date(form.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
          : "—"}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 8 }}>
        <Link href={`/dashboard/forms/${form.id}`} style={{
          fontSize: 12, color: "rgba(255,255,255,0.35)",
          textDecoration: "none", fontFamily: "var(--font-display)",
          padding: "4px 10px", borderRadius: 6,
          border: "1px solid rgba(255,255,255,0.08)",
          transition: "all .15s",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.color = "var(--cream)"
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"
        }}
        onMouseLeave={e => {
          e.currentTarget.style.color = "rgba(255,255,255,0.35)"
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"
        }}
        >Edit</Link>
      </div>
    </div>
  )
}

/* ── EMPTY STATE ───────────────────────────────────────── */
function EmptyState() {
  return (
    <div style={{
      border: "1px dashed rgba(255,255,255,0.1)",
      borderRadius: 12, padding: "64px 40px",
      textAlign: "center",
    }}>
      <div style={{ fontSize: 40, marginBottom: 16 }}>◈</div>
      <h3 style={{
        fontFamily: "var(--font-display)", fontWeight: 700,
        fontSize: 18, color: "var(--cream)", marginBottom: 8,
        letterSpacing: "-0.02em",
      }}>No forms yet</h3>
      <p style={{
        fontSize: 14, color: "rgba(255,255,255,0.35)",
        fontFamily: "var(--font-body)", marginBottom: 24,
      }}>
        Create your first form and start collecting responses.
      </p>
      <Link href="/dashboard/forms/new" style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "10px 24px",
        background: "var(--lime)", color: "#000",
        fontFamily: "var(--font-display)", fontWeight: 700,
        fontSize: 13, textDecoration: "none", borderRadius: 8,
      }}>
        + Create your first form
      </Link>
    </div>
  )
}

/* ── LOADING SKELETON ──────────────────────────────────── */
function LoadingSkeleton() {
  return (
    <div style={{
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 12, overflow: "hidden",
    }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{
          padding: "16px 20px",
          borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.04)" : "none",
          display: "flex", gap: 16, alignItems: "center",
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: "50%",
            background: "rgba(255,255,255,0.08)", flexShrink: 0,
          }}/>
          <div style={{
            height: 14, borderRadius: 4, flex: 1,
            background: "rgba(255,255,255,0.06)",
            animation: "pulse 1.5s ease infinite",
          }}/>
          <div style={{
            height: 14, borderRadius: 4, width: 80,
            background: "rgba(255,255,255,0.04)",
          }}/>
        </div>
      ))}
      <style>{`@keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:.8} }`}</style>
    </div>
  )
}