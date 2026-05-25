"use client"

import { useState } from "react"
import { trpc } from "~/trpc/client"

export default function AnalyticsPage() {
  const { data: forms, isLoading } = trpc.form.getMyForms.useQuery({})
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null)

  const selectedForm = forms?.find(f => f.id === selectedFormId) ?? forms?.[0] ?? null

  const { data: analytics } = trpc.response.getAnalytics.useQuery(
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
        }}>Analytics</h1>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-body)" }}>
          Track performance across all your forms.
        </p>
      </div>

      {/* Form selector */}
      <div style={{ marginBottom: 32 }}>
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
      </div>

      {isLoading ? (
        <LoadingState />
      ) : !selectedForm ? (
        <EmptyState />
      ) : (
        <>
          {/* Stats cards */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16, marginBottom: 32,
          }}>
            <StatCard
              label="Total Views"
              value={analytics?.totalViews ?? 0}
              color="var(--cream)"
              icon="👁"
            />
            <StatCard
              label="Total Responses"
              value={analytics?.totalResponses ?? 0}
              color="var(--lime)"
              icon="◎"
            />
            <StatCard
              label="Completion Rate"
              value={`${analytics?.completionRate ?? 0}%`}
              color="#60a5fa"
              icon="◐"
            />
          </div>

          {/* Completion bar */}
          <div style={{
            padding: "28px 32px",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, marginBottom: 24,
          }}>
            <div style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "center", marginBottom: 16,
            }}>
              <div>
                <div style={{
                  fontSize: 14, fontWeight: 700,
                  color: "var(--cream)", fontFamily: "var(--font-display)",
                  marginBottom: 4,
                }}>Completion Rate</div>
                <div style={{
                  fontSize: 12, color: "rgba(255,255,255,0.35)",
                  fontFamily: "var(--font-body)",
                }}>
                  {analytics?.totalResponses ?? 0} completed out of {analytics?.totalViews ?? 0} views
                </div>
              </div>
              <div style={{
                fontSize: 32, fontWeight: 800,
                color: "var(--lime)", fontFamily: "var(--font-display)",
                letterSpacing: "-0.04em",
              }}>
                {analytics?.completionRate ?? 0}%
              </div>
            </div>

            {/* Progress bar */}
            <div style={{
              height: 8, background: "rgba(255,255,255,0.06)",
              borderRadius: 99, overflow: "hidden",
            }}>
              <div style={{
                height: "100%",
                width: `${analytics?.completionRate ?? 0}%`,
                background: "linear-gradient(90deg, var(--lime) 0%, #84cc16 100%)",
                borderRadius: 99,
                transition: "width 1s ease",
              }}/>
            </div>
          </div>

          {/* Form info */}
          <div style={{
            padding: "24px 32px",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12,
          }}>
            <div style={{
              fontSize: 12, fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase", color: "rgba(255,255,255,0.25)",
              marginBottom: 16, fontFamily: "var(--font-display)",
            }}>Form Details</div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Title",      value: selectedForm.title },
                { label: "Status",     value: selectedForm.status ?? "draft" },
                { label: "Visibility", value: selectedForm.visibility ?? "unlisted" },
                { label: "Created",    value: selectedForm.createdAt
                    ? new Date(selectedForm.createdAt).toLocaleDateString("en-US", {
                        month: "long", day: "numeric", year: "numeric"
                      })
                    : "—" },
              ].map(row => (
                <div key={row.label} style={{
                  display: "flex", justifyContent: "space-between",
                  alignItems: "center",
                  paddingBottom: 12,
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                }}>
                  <span style={{
                    fontSize: 13, color: "rgba(255,255,255,0.4)",
                    fontFamily: "var(--font-body)",
                  }}>{row.label}</span>
                  <span style={{
                    fontSize: 13, fontWeight: 600,
                    color: "var(--cream)", fontFamily: "var(--font-display)",
                    textTransform: "capitalize",
                  }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function StatCard({ label, value, color, icon }: {
  label: string; value: number | string; color: string; icon: string
}) {
  return (
    <div style={{
      padding: "24px 28px",
      background: "rgba(255,255,255,0.02)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 12,
    }}>
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "flex-start", marginBottom: 16,
      }}>
        <div style={{
          fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
          textTransform: "uppercase", color: "rgba(255,255,255,0.3)",
          fontFamily: "var(--font-display)",
        }}>{label}</div>
        <span style={{ fontSize: 16, opacity: 0.6 }}>{icon}</span>
      </div>
      <div style={{
        fontSize: 40, fontWeight: 800, color,
        fontFamily: "var(--font-display)", letterSpacing: "-0.04em",
        lineHeight: 1,
      }}>{value}</div>
    </div>
  )
}

function LoadingState() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
      {[1,2,3].map(i => (
        <div key={i} style={{
          height: 120, borderRadius: 12,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
          animation: "pulse 1.5s ease infinite",
        }}/>
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
      <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.3 }}>◐</div>
      <h3 style={{
        fontFamily: "var(--font-display)", fontWeight: 700,
        fontSize: 18, color: "var(--cream)", marginBottom: 8,
      }}>No forms yet</h3>
      <p style={{
        fontSize: 14, color: "rgba(255,255,255,0.35)",
        fontFamily: "var(--font-body)",
      }}>Create and publish a form to see analytics here.</p>
    </div>
  )
}