"use client"

import { useMemo, useState } from "react"
import type { ReactNode } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { trpc } from "~/trpc/client"
import { FormSelector } from "~/components/dashboard/form-selector"

export default function AnalyticsPage() {
  const { data: forms, isLoading } = trpc.form.getMyForms.useQuery(
    {},
    { refetchInterval: 5000, refetchOnWindowFocus: true }
  )
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null)

  const selectedForm = forms?.find(f => f.id === selectedFormId) ?? forms?.[0] ?? null

  const { data: analytics } = trpc.response.getAnalytics.useQuery(
    { formId: selectedForm?.id ?? "" },
    { enabled: !!selectedForm?.id, refetchInterval: 5000, refetchOnWindowFocus: true }
  )

  const totalResponses = analytics?.totalResponses ?? selectedForm?.submissionCount ?? 0
  const rawViews = analytics?.totalViews ?? selectedForm?.viewCount ?? 0
  const effectiveViews = Math.max(rawViews, totalResponses)
  const abandonedViews = Math.max(effectiveViews - totalResponses, 0)
  const completionRate = effectiveViews > 0
    ? Math.round((totalResponses / effectiveViews) * 100)
    : 0

  const overviewData = useMemo(() => [
    { name: "Views", value: effectiveViews, color: "#f0ead6" },
    { name: "Responses", value: totalResponses, color: "#b8ff35" },
    { name: "Incomplete", value: abandonedViews, color: "#60a5fa" },
  ], [abandonedViews, effectiveViews, totalResponses])

  const funnelData = useMemo(() => [
    { stage: "Viewed", count: effectiveViews },
    { stage: "Submitted", count: totalResponses },
  ], [effectiveViews, totalResponses])

  return (
    <div style={{ padding: "40px clamp(24px, 4vw, 56px)", width: "100%", maxWidth: 1360, boxSizing: "border-box" }}>
      <div style={{ marginBottom: 40 }}>
        <h1 style={{
          fontFamily: "var(--font-display)", fontWeight: 800,
          fontSize: 28, color: "var(--cream)", letterSpacing: "-0.04em",
          marginBottom: 6,
        }}>Analytics</h1>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-body)" }}>
          Track views, submissions, and completion quality for each form.
        </p>
      </div>

      <div style={{ marginBottom: 32 }}>
        <FormSelector
          value={selectedForm?.id ?? ""}
          options={forms?.map((form) => ({ id: form.id, title: form.title })) ?? []}
          onChange={setSelectedFormId}
          minWidth={350}
        />
      </div>

      {isLoading ? (
        <LoadingState />
      ) : !selectedForm ? (
        <EmptyState />
      ) : (
        <>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 16, marginBottom: 32,
          }}>
            <StatCard
              label="Total Views"
              value={effectiveViews}
              color="var(--cream)"
              hint={rawViews < totalResponses ? "Corrected from responses" : "Tracked visits"}
            />
            <StatCard
              label="Total Responses"
              value={totalResponses}
              color="var(--lime)"
              hint="Completed submissions"
            />
            <StatCard
              label="Completion Rate"
              value={`${completionRate}%`}
              color="#60a5fa"
              hint={`${totalResponses} of ${effectiveViews} completed`}
            />
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
            gap: 16,
            marginBottom: 24,
          }}>
            <ChartPanel title="Response Funnel" subtitle="Viewed sessions compared with completed submissions.">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={funnelData} margin={{ top: 12, right: 12, left: -18, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis dataKey="stage" tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    <Cell fill="#f0ead6" />
                    <Cell fill="#b8ff35" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartPanel>

            <ChartPanel title="Completion Mix" subtitle="How much traffic turned into responses.">
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={overviewData} margin={{ top: 12, right: 12, left: -18, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} cursor={{ stroke: "rgba(184,255,53,0.2)" }} />
                  <Line type="monotone" dataKey="value" stroke="#b8ff35" strokeWidth={3} dot={{ r: 5, fill: "#b8ff35", strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartPanel>
          </div>

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
                  {totalResponses} completed out of {effectiveViews} views
                  {rawViews < totalResponses && (
                    <span style={{ color: "rgba(184,255,53,0.72)" }}> · reconciled from submissions</span>
                  )}
                </div>
              </div>
              <div style={{
                fontSize: 32, fontWeight: 800,
                color: "var(--lime)", fontFamily: "var(--font-display)",
                letterSpacing: "-0.04em",
              }}>
                {completionRate}%
              </div>
            </div>

            <div style={{
              height: 8, background: "rgba(255,255,255,0.06)",
              borderRadius: 99, overflow: "hidden",
            }}>
              <div style={{
                height: "100%",
                width: `${completionRate}%`,
                background: "linear-gradient(90deg, var(--lime) 0%, #84cc16 100%)",
                borderRadius: 99,
                transition: "width 1s ease",
              }}/>
            </div>
          </div>

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
                { label: "Title", value: selectedForm.title },
                { label: "Status", value: selectedForm.status ?? "draft" },
                { label: "Visibility", value: selectedForm.visibility ?? "unlisted" },
                { label: "Created", value: selectedForm.createdAt
                    ? new Date(selectedForm.createdAt).toLocaleDateString("en-US", {
                        month: "long", day: "numeric", year: "numeric"
                      })
                    : "-" },
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

function StatCard({ label, value, color, hint }: {
  label: string
  value: number | string
  color: string
  hint: string
}) {
  return (
    <div style={{
      padding: "24px 28px",
      background: "rgba(255,255,255,0.02)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 12,
    }}>
      <div style={{
        fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
        textTransform: "uppercase", color: "rgba(255,255,255,0.3)",
        fontFamily: "var(--font-display)",
        marginBottom: 12,
      }}>{label}</div>
      <div style={{
        fontSize: 40, fontWeight: 800, color,
        fontFamily: "var(--font-display)", letterSpacing: "-0.04em",
        lineHeight: 1, marginBottom: 10,
      }}>{value}</div>
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-body)" }}>
        {hint}
      </div>
    </div>
  )
}

function ChartPanel({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: ReactNode
}) {
  return (
    <div style={{
      padding: "24px 28px",
      background: "rgba(255,255,255,0.02)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 12,
    }}>
      <div style={{
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: 15,
        color: "var(--cream)",
        marginBottom: 4,
      }}>{title}</div>
      <div style={{
        fontFamily: "var(--font-body)",
        fontSize: 12,
        color: "rgba(255,255,255,0.35)",
        marginBottom: 18,
      }}>{subtitle}</div>
      {children}
    </div>
  )
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null

  return (
    <div style={{
      background: "#111",
      border: "1px solid rgba(255,255,255,0.12)",
      borderRadius: 8,
      padding: "8px 10px",
      boxShadow: "0 16px 40px rgba(0,0,0,0.35)",
    }}>
      <div style={{ color: "var(--cream)", fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-body)", fontSize: 12 }}>
        {payload[0].value}
      </div>
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
