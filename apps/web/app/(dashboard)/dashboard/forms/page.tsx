"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, Copy, Pencil, Plus, Trash2 } from "lucide-react"
import { trpc } from "~/trpc/client"

export default function FormsPage() {
  const utils = trpc.useUtils()
  const { data: forms, isLoading } = trpc.form.getMyForms.useQuery(
    {},
    { refetchInterval: 5000, refetchOnWindowFocus: true }
  )
  const deleteForm = trpc.form.delete.useMutation({
    onSuccess: async () => {
      await utils.form.getMyForms.invalidate()
    },
  })

  return (
    <div style={{ padding: "40px clamp(24px, 4vw, 56px)", width: "100%", maxWidth: 1360, boxSizing: "border-box" }}>
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: 40,
      }}>
        <div>
          <h1 style={{
            fontFamily: "var(--font-display)", fontWeight: 800,
            fontSize: 28, color: "var(--cream)", letterSpacing: "-0.04em",
            marginBottom: 6,
          }}>My Forms</h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-body)" }}>
            Manage all your forms in one place.
          </p>
        </div>
        <Link href="/dashboard/forms/new" style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "10px 20px",
          background: "var(--lime)", color: "#000",
          fontFamily: "var(--font-display)", fontWeight: 700,
          fontSize: 13, textDecoration: "none",
          borderRadius: 8,
        }}><Plus size={16} /> New Form</Link>
      </div>

      {isLoading ? (
        <div style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-body)" }}>
          Loading...
        </div>
      ) : forms?.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "80px 40px",
          border: "1.5px dashed rgba(255,255,255,0.08)",
          borderRadius: 16,
        }}>
          <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.3 }}>◈</div>
          <h3 style={{
            fontFamily: "var(--font-display)", fontWeight: 700,
            fontSize: 18, color: "var(--cream)", marginBottom: 8,
          }}>No forms yet</h3>
          <p style={{
            fontSize: 14, color: "rgba(255,255,255,0.35)",
            fontFamily: "var(--font-body)", marginBottom: 24,
          }}>Create your first form and start collecting responses.</p>
          <Link href="/dashboard/forms/new" style={{
            display: "inline-flex", padding: "10px 24px",
            background: "var(--lime)", color: "#000",
            fontFamily: "var(--font-display)", fontWeight: 700,
            fontSize: 13, textDecoration: "none", borderRadius: 8,
          }}>+ Create your first form</Link>
        </div>
      ) : (
        <div style={{
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 12, overflow: "hidden",
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "minmax(240px, 1fr) 120px 100px 120px 230px",
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

          {forms?.map((form, i) => (
              <FormRow
              key={form.id}
              form={form}
              isLast={i === (forms?.length ?? 0) - 1}
              onDelete={() => deleteForm.mutate({ id: form.id })}
              deleting={deleteForm.isPending}
            />
          ))}
        </div>
      )}
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
      gridTemplateColumns: "minmax(240px, 1fr) 120px 100px 120px 230px",
      padding: "14px 20px", alignItems: "center",
      borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.04)",
      background: hov ? "rgba(255,255,255,0.02)" : "transparent",
      transition: "background .15s",
    }}
    onMouseEnter={() => setHov(true)}
    onMouseLeave={() => setHov(false)}
    >
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
            }}>{form.description}</div>
          )}
        </div>
      </div>

      <span style={{
        fontSize: 11, fontWeight: 600, padding: "3px 10px",
        borderRadius: 99, fontFamily: "var(--font-display)",
        background: form.visibility === "public"
          ? "rgba(96,165,250,0.12)" : "rgba(184,255,53,0.08)",
        color: form.visibility === "public"
          ? "#60a5fa" : "var(--lime)",
        border: `1px solid ${form.visibility === "public"
          ? "rgba(96,165,250,0.2)" : "rgba(184,255,53,0.18)"}`,
        width: "fit-content",
        textTransform: "capitalize",
      }}>
        {form.visibility ?? "unlisted"}
      </span>

      <div style={{
        fontSize: 14, color: "rgba(255,255,255,0.5)",
        fontFamily: "var(--font-body)",
      }}>{form.submissionCount ?? 0}</div>

      <div style={{
        fontSize: 13, color: "rgba(255,255,255,0.3)",
        fontFamily: "var(--font-body)",
      }}>
        {form.createdAt
          ? new Date(form.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
          : "—"}
      </div>

      <div style={{ display: "flex", gap: 6 }}>
        <button
          onClick={copyLink}
          style={{
            fontSize: 11, color: "rgba(255,255,255,0.35)",
            background: "transparent", cursor: "pointer",
            padding: "4px 8px", borderRadius: 6,
            border: "1px solid rgba(255,255,255,0.08)",
            fontFamily: "var(--font-display)",
            display: "inline-flex", alignItems: "center", gap: 5,
          }}
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? "Copied" : "Copy"}
        </button>
        <Link href={`/dashboard/forms/${form.id}`} style={{
          fontSize: 11, color: "rgba(255,255,255,0.35)",
          textDecoration: "none", padding: "4px 8px",
          borderRadius: 6,
          border: "1px solid rgba(255,255,255,0.08)",
          fontFamily: "var(--font-display)",
          display: "inline-flex", alignItems: "center", gap: 5,
        }}><Pencil size={12} /> Edit</Link>
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
            fontSize: 11,
            color: deleting ? "rgba(255,255,255,0.25)" : "#f87171",
            background: "transparent",
            cursor: deleting ? "not-allowed" : "pointer",
            padding: "4px 8px",
            borderRadius: 6,
            border: "1px solid rgba(248,113,113,0.18)",
            fontFamily: "var(--font-display)",
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          <Trash2 size={12} />
          {confirmDelete ? "Confirm" : "Delete"}
        </button>
      </div>
    </div>
  )
}   
