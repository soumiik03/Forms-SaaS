"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, Copy, Pencil, Plus, Trash2 } from "lucide-react"
import { trpc } from "~/trpc/client"

export default function DashboardPage() {
  const utils = trpc.useUtils()
  const { data: forms, isLoading } = trpc.form.getMyForms.useQuery(
    {},
    { refetchInterval: 5000, refetchOnWindowFocus: true }
  )
  const { data: me } = trpc.auth.me.useQuery({})
  const deleteForm = trpc.form.delete.useMutation({
    onSuccess: async () => {
      await utils.form.getMyForms.invalidate()
    },
  })

  const publishedForms = forms?.filter(f => f.status === "published") ?? []
  const totalResponses = forms?.reduce((acc, f) => acc + (f.submissionCount ?? 0), 0) ?? 0
  const totalViews = forms?.reduce(
    (acc, f) => acc + Math.max(f.viewCount ?? 0, f.submissionCount ?? 0),
    0
  ) ?? 0
  const completionRate = totalViews > 0 ? Math.round((totalResponses / totalViews) * 100) : 0

  return (
    <div style={{ padding: "40px clamp(24px, 4vw, 56px)", width: "100%", maxWidth: 1360, boxSizing: "border-box" }}>
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
            {me ? `Hey, ${me.fullName.split(" ")[0]}` : "Dashboard"}
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
          <Plus size={16} />
          New Form
        </Link>
      </div>

      {/* Stats */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
        gap: 16, marginBottom: 40,
      }}>
        {[
          { label: "Total Forms", value: forms?.length ?? 0, color: "var(--cream)", loading: isLoading },
          { label: "Live Forms", value: publishedForms.length, color: "var(--lime)", loading: isLoading },
          { label: "Responses", value: totalResponses, color: "#60a5fa", loading: isLoading },
          { label: "Completion", value: `${completionRate}%`, color: totalViews > 0 ? "#10b981" : "rgba(255,255,255,0.4)", loading: isLoading },
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
            View all
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
              gridTemplateColumns: "minmax(240px, 1fr) 120px 100px 120px 300px",
              padding: "10px 20px",
              background: "rgba(255,255,255,0.02)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}>
              {["Form", "Visibility", "Responses", "Created", "Actions"].map(h => (
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
                isLast={i === Math.min(forms.length, 8) - 1}
                onDelete={() => deleteForm.mutate({ id: form.id })}
                deleting={deleteForm.isPending}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

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
        {loading ? "-" : value}
      </div>
    </div>
  )
}

function FormRow({
  form,
  isLast,
  onDelete,
  deleting,
}: {
  form: any
  isLast: boolean
  onDelete: () => void
  deleting: boolean
}) {
  const [hov, setHov] = useState(false)
  const [copied, setCopied] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const isLive = form.status === "published"

  const copyLink = async () => {
    const url = `${window.location.origin}/f/${form.slug}`

    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1300)
    } catch {
      window.prompt("Copy this form link:", url)
    }
  }

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "minmax(240px, 1fr) 120px 100px 120px 300px",
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
            ? "rgba(96,165,250,0.12)" : "rgba(184,255,53,0.08)",
          color: form.visibility === "public"
            ? "#60a5fa" : "var(--lime)",
          border: `1px solid ${form.visibility === "public"
            ? "rgba(96,165,250,0.2)" : "rgba(184,255,53,0.18)"}`,
          textTransform: "capitalize",
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
          : "-"}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button
          type="button"
          onClick={copyLink}
          style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.35)",
            background: "transparent",
            padding: "4px 10px",
            borderRadius: 6,
            border: "1px solid rgba(255,255,255,0.08)",
            cursor: "pointer",
            fontFamily: "var(--font-display)",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          <span style={{
            display: "inline-block",
            width: copied ? 42 : 58,
            transition: "width .2s ease",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}>
            {copied ? "Copied" : "Copy link"}
          </span>
        </button>

        <Link href={`/dashboard/forms/${form.id}`} style={{
          fontSize: 12, color: "rgba(255,255,255,0.35)",
          textDecoration: "none", fontFamily: "var(--font-display)",
          display: "inline-flex", alignItems: "center", gap: 6,
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
        ><Pencil size={13} /> Edit</Link>
        <button
          type="button"
          onClick={() => {
            if (!confirmDelete) {
              setConfirmDelete(true)
              window.setTimeout(() => setConfirmDelete(false), 2200)
              return
            }
            onDelete()
          }}
          disabled={deleting}
          style={{
            fontSize: 12,
            color: deleting ? "rgba(255,255,255,0.25)" : "#f87171",
            background: "transparent",
            padding: "4px 10px",
            borderRadius: 6,
            border: "1px solid rgba(248,113,113,0.18)",
            cursor: deleting ? "not-allowed" : "pointer",
            fontFamily: "var(--font-display)",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Trash2 size={13} />
          {confirmDelete ? "Confirm" : "Delete"}
        </button>
      </div>
    </div>
  )
}

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
        <Plus size={16} />
        Create your first form
      </Link>
    </div>
  )
}

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
