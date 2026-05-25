"use client"

import { useState } from "react"
import { trpc } from "~/trpc/client"

export default function ResponsesPage() {
  const { data: forms } = trpc.form.getMyForms.useQuery({})
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null)

  const selectedForm = forms?.find(f => f.id === selectedFormId) ?? forms?.[0] ?? null

  const { data: responses, isLoading } = trpc.response.getResponses.useQuery(
    { formId: selectedForm?.id ?? "" },
    { enabled: !!selectedForm?.id }
  )

  return (
    <div style={{ padding: "40px 48px", maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <h1 style={{
          fontFamily: "var(--font-display)", fontWeight: 800,
          fontSize: 28, color: "var(--cream)", letterSpacing: "-0.04em",
          marginBottom: 6,
        }}>Responses</h1>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-body)" }}>
          View all submissions across your forms.
        </p>
      </div>

      {/* Form selector */}
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between", marginBottom: 24,
      }}>
        <select
          value={selectedForm?.id ?? ""}
          onChange={e => setSelectedFormId(e.target.value)}
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8, padding: "9px 16px",
            color: "var(--cream)", fontSize: 14,
            fontFamily: "var(--font-display)", fontWeight: 500,
            outline: "none", cursor: "pointer", minWidth: 280,
          }}
        >
          {forms?.map(f => (
            <option key={f.id} value={f.id}>{f.title}</option>
          ))}
        </select>

        <div style={{
          fontSize: 13, color: "rgba(255,255,255,0.35)",
          fontFamily: "var(--font-body)",
        }}>
          {responses?.length ?? 0} total responses
        </div>
      </div>

      {/* Responses table */}
      {isLoading ? (
        <LoadingSkeleton />
      ) : !responses || responses.length === 0 ? (
        <EmptyState />
      ) : (
        <div style={{
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 12, overflow: "hidden",
        }}>
          {/* Table header */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "180px 1fr 120px",
            padding: "10px 20px",
            background: "rgba(255,255,255,0.02)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}>
            {["Submitted", "Answers", "Email"].map(h => (
              <div key={h} style={{
                fontSize: 11, fontWeight: 600,
                color: "rgba(255,255,255,0.3)",
                letterSpacing: "0.06em", textTransform: "uppercase",
                fontFamily: "var(--font-display)",
              }}>{h}</div>
            ))}
          </div>

          {/* Rows */}
          {responses.map((response: any, i: number) => (
            <ResponseRow
              key={response.id}
              response={response}
              isLast={i === responses.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function ResponseRow({ response, isLast }: { response: any; isLast: boolean }) {
  const [expanded, setExpanded] = useState(false)
  const [hov, setHov] = useState(false)

  const answers = response.answers as Record<string, unknown>
  const answerCount = Object.keys(answers).length

  return (
    <>
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          display: "grid",
          gridTemplateColumns: "180px 1fr 120px",
          padding: "14px 20px",
          alignItems: "center",
          borderBottom: isLast && !expanded
            ? "none" : "1px solid rgba(255,255,255,0.04)",
          background: hov ? "rgba(255,255,255,0.02)" : "transparent",
          cursor: "pointer", transition: "background .15s",
        }}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
      >
        {/* Date */}
        <div style={{
          fontSize: 13, color: "rgba(255,255,255,0.5)",
          fontFamily: "var(--font-body)",
        }}>
          {response.submittedAt
            ? new Date(response.submittedAt).toLocaleString("en-US", {
                month: "short", day: "numeric",
                hour: "2-digit", minute: "2-digit",
              })
            : "—"}
        </div>

        {/* Answer count */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{
            fontSize: 12, fontWeight: 600,
            padding: "3px 10px", borderRadius: 99,
            background: "rgba(184,255,53,0.08)",
            color: "var(--lime)", fontFamily: "var(--font-display)",
            border: "1px solid rgba(184,255,53,0.15)",
          }}>
            {answerCount} field{answerCount !== 1 ? "s" : ""}
          </span>
          <span style={{
            fontSize: 12, color: "rgba(255,255,255,0.3)",
            fontFamily: "var(--font-body)",
          }}>
            {expanded ? "▲ Hide" : "▼ View"} answers
          </span>
        </div>

        {/* Email */}
        <div style={{
          fontSize: 13, color: "rgba(255,255,255,0.4)",
          fontFamily: "var(--font-body)",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {response.respondentEmail ?? "—"}
        </div>
      </div>

      {/* Expanded answers */}
      {expanded && (
        <div style={{
          padding: "16px 20px 20px 20px",
          background: "rgba(255,255,255,0.01)",
          borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.04)",
        }}>
          <div style={{
            display: "flex", flexDirection: "column", gap: 10,
            maxWidth: 640,
          }}>
            {Object.entries(answers).map(([fieldId, value]) => (
              <div key={fieldId} style={{
                padding: "12px 16px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 8,
              }}>
                <div style={{
                  fontSize: 11, fontWeight: 600,
                  color: "rgba(255,255,255,0.3)",
                  fontFamily: "var(--font-display)",
                  letterSpacing: "0.04em", marginBottom: 6,
                  textTransform: "uppercase",
                }}>
                  Field {fieldId.slice(0, 8)}
                </div>
                <div style={{
                  fontSize: 14, color: "var(--cream)",
                  fontFamily: "var(--font-body)",
                }}>
                  {Array.isArray(value)
                    ? value.join(", ")
                    : String(value ?? "—")}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

function LoadingSkeleton() {
  return (
    <div style={{
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 12, overflow: "hidden",
    }}>
      {[1, 2, 3, 4].map(i => (
        <div key={i} style={{
          padding: "16px 20px",
          borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.04)" : "none",
          display: "flex", gap: 16,
        }}>
          <div style={{
            height: 14, width: 120, borderRadius: 4,
            background: "rgba(255,255,255,0.06)",
            animation: "pulse 1.5s ease infinite",
          }}/>
          <div style={{
            height: 14, flex: 1, borderRadius: 4,
            background: "rgba(255,255,255,0.04)",
          }}/>
        </div>
      ))}
      <style>{`@keyframes pulse{0%,100%{opacity:.4}50%{opacity:.8}}`}</style>
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
      <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.3 }}>◎</div>
      <h3 style={{
        fontFamily: "var(--font-display)", fontWeight: 700,
        fontSize: 18, color: "var(--cream)", marginBottom: 8,
      }}>No responses yet</h3>
      <p style={{
        fontSize: 14, color: "rgba(255,255,255,0.35)",
        fontFamily: "var(--font-body)",
      }}>
        Share your form link to start collecting responses.
      </p>
    </div>
  )
}