"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { trpc } from "~/trpc/client"

type FieldType = "text" | "email" | "number" | "textarea" | "select" | "checkbox" | "radio" | "rating" | "date"

interface Field {
  id: string
  type: FieldType
  label: string
  placeholder: string
  required: boolean
  options: string[]
}

// ── Inline SVG icon components ─────────────────────────────────────────────
function IconText() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 7 4 4 20 4 20 7"/>
      <line x1="9" y1="20" x2="15" y2="20"/>
      <line x1="12" y1="4" x2="12" y2="20"/>
    </svg>
  )
}

function IconTextarea() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <line x1="7" y1="8" x2="17" y2="8"/>
      <line x1="7" y1="12" x2="17" y2="12"/>
      <line x1="7" y1="16" x2="13" y2="16"/>
    </svg>
  )
}

function IconEmail() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  )
}

function IconNumber() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="9" x2="20" y2="9"/>
      <line x1="4" y1="15" x2="20" y2="15"/>
      <line x1="10" y1="3" x2="8" y2="21"/>
      <line x1="16" y1="3" x2="14" y2="21"/>
    </svg>
  )
}

function IconSelect() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="2"/>
      <path d="m8 12 4 4 4-4"/>
    </svg>
  )
}

function IconRadio() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none"/>
    </svg>
  )
}

function IconCheckbox() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3"/>
      <polyline points="9 12 11 14 15 10"/>
    </svg>
  )
}

function IconRating() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  )
}

function IconDate() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  )
}

function IconArrowRight({ size = 14, strokeWidth = 2.5 }: { size?: number; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  )
}

function IconChevronDown({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  )
}

// ────────────────────────────────────────────────────────────────────────────

const FIELD_TYPES: { type: FieldType; icon: React.ReactNode; label: string }[] = [
  { type: "text",     icon: <IconText />,     label: "Short Text" },
  { type: "textarea", icon: <IconTextarea />, label: "Long Text" },
  { type: "email",    icon: <IconEmail />,    label: "Email" },
  { type: "number",   icon: <IconNumber />,   label: "Number" },
  { type: "select",   icon: <IconSelect />,   label: "Dropdown" },
  { type: "radio",    icon: <IconRadio />,    label: "Radio" },
  { type: "checkbox", icon: <IconCheckbox />, label: "Checkbox" },
  { type: "rating",   icon: <IconRating />,   label: "Rating" },
  { type: "date",     icon: <IconDate />,     label: "Date" },
]

function generateId() {
  return Math.random().toString(36).slice(2, 9)
}

export default function NewFormPage() {
  const router = useRouter()
  const [title, setTitle] = useState("Untitled Form")
  const [description, setDescription] = useState("")
  const [fields, setFields] = useState<Field[]>([])
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [editingTitle, setEditingTitle] = useState(false)
  const [visibility, setVisibility] = useState<"public" | "unlisted">("unlisted")
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const createForm = trpc.form.create.useMutation()
  const addField = trpc.field.addField.useMutation()
  const publishForm = trpc.form.publish.useMutation()

  const activeField = fields.find(f => f.id === activeFieldId) ?? null

  const handleAddField = (type: FieldType) => {
    const newField: Field = {
      id: generateId(),
      type,
      label: FIELD_TYPES.find(f => f.type === type)?.label ?? "Field",
      placeholder: "",
      required: false,
      options: type === "select" || type === "radio" || type === "checkbox"
        ? ["Option 1", "Option 2"]
        : [],
    }

    setFields(prev => [...prev, newField])
    setActiveFieldId(newField.id)
  }

  const updateField = (id: string, patch: Partial<Field>) => {
    setFields(prev => prev.map(f => f.id === id ? { ...f, ...patch } : f))
  }

  const deleteField = (id: string) => {
    setFields(prev => prev.filter(f => f.id !== id))
    if (activeFieldId === id) setActiveFieldId(null)
  }

  const moveField = (id: string, dir: "up" | "down") => {
    setFields(prev => {
      const idx = prev.findIndex(f => f.id === id)
      if (dir === "up" && idx === 0) return prev
      if (dir === "down" && idx === prev.length - 1) return prev

      const next = [...prev]
      const swap = dir === "up" ? idx - 1 : idx + 1
      ;[next[idx], next[swap]] = [next[swap]!, next[idx]!]

      return next
    })
  }

  const handleSave = async (publish = false) => {
    setSaving(true)

    try {
      const form = await createForm.mutateAsync({ title, description })

      for (let i = 0; i < fields.length; i++) {
        const f = fields[i]!

        await addField.mutateAsync({
          formId: form.id,
          type: f.type,
          label: f.label,
          placeholder: f.placeholder,
          required: f.required,
          order: i,
          options: f.options.length > 0 ? f.options : undefined,
        })
      }

      if (publish) {
        await publishForm.mutateAsync({
          id: form.id,
          visibility,
        })
      }

      router.push("/dashboard")
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ display: "flex", height: "100vh", background: "#080808" }}>
      <aside style={{
        width: 200,
        flexShrink: 0,
        borderRight: "1px solid rgba(255,255,255,0.06)",
        background: "#0D0D0D",
        display: "flex",
        flexDirection: "column",
        padding: "16px 10px",
        overflowY: "auto",
      }}>
        <div style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.25)",
          padding: "4px 10px",
          marginBottom: 8,
          fontFamily: "var(--font-display)",
        }}>
          Field Types
        </div>

        {FIELD_TYPES.map(ft => (
          <FieldTypeBtn
            key={ft.type}
            icon={ft.icon}
            label={ft.label}
            onClick={() => handleAddField(ft.type)}
          />
        ))}
      </aside>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{
          height: 56,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          flexShrink: 0,
          background: "#0D0D0D",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => router.push("/dashboard")}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "rgba(255,255,255,0.4)",
                fontSize: 18,
                lineHeight: 1,
                display: "flex",
                alignItems: "center",
              }}
            >
              ←
            </button>

            {editingTitle ? (
              <input
                autoFocus
                value={title}
                onChange={e => setTitle(e.target.value)}
                onBlur={() => setEditingTitle(false)}
                onKeyDown={e => e.key === "Enter" && setEditingTitle(false)}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(184,255,53,0.4)",
                  borderRadius: 6,
                  padding: "4px 10px",
                  color: "var(--cream)",
                  fontSize: 15,
                  fontWeight: 700,
                  fontFamily: "var(--font-display)",
                  outline: "none",
                  minWidth: 200,
                }}
              />
            ) : (
              <span
                onClick={() => setEditingTitle(true)}
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "var(--cream)",
                  letterSpacing: "-0.02em",
                  fontFamily: "var(--font-display)",
                  cursor: "text",
                  padding: "4px 8px",
                  borderRadius: 6,
                  border: "1px solid transparent",
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "transparent"}
              >
                {title}
              </span>
            )}
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>

            {/* ── Custom dropdown ── */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setDropdownOpen(o => !o)}
                onBlur={() => setTimeout(() => setDropdownOpen(false), 120)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "7px 14px",
                  background: visibility === "unlisted"
                    ? "rgba(184,255,53,0.08)"
                    : "rgba(96,165,250,0.1)",
                  border: visibility === "unlisted"
                    ? "1px solid rgba(184,255,53,0.22)"
                    : "1px solid rgba(96,165,250,0.24)",
                  borderRadius: 8,
                  color: visibility === "unlisted" ? "#b8ff35" : "#60a5fa",
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                  outline: "none",
                  transition: "all 0.15s",
                  whiteSpace: "nowrap",
                }}
              >
                {visibility === "unlisted" ? "Unlisted" : "Public"}
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  opacity: 0.8,
                  transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.15s",
                }}>
                  <IconChevronDown size={13} />
                </span>
              </button>

              {dropdownOpen && (
                <div style={{
                  position: "absolute",
                  top: "calc(100% + 6px)",
                  right: 0,
                  minWidth: "100%",
                  background: "#111",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10,
                  overflow: "hidden",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
                  zIndex: 50,
                }}>
                  {[
                    { value: "unlisted", label: "Unlisted", color: "#b8ff35" },
                    { value: "public",   label: "Public",   color: "#60a5fa" },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onMouseDown={() => {
                        setVisibility(opt.value as "public" | "unlisted")
                        setDropdownOpen(false)
                      }}
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "10px 16px",
                        background: visibility === opt.value
                          ? "rgba(255,255,255,0.06)"
                          : "transparent",
                        border: "none",
                        borderBottom: opt.value === "unlisted"
                          ? "1px solid rgba(255,255,255,0.06)"
                          : "none",
                        color: opt.color,
                        fontFamily: "var(--font-display)",
                        fontWeight: 600,
                        fontSize: 13,
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "background 0.12s",
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                      onMouseLeave={e => e.currentTarget.style.background = visibility === opt.value ? "rgba(255,255,255,0.06)" : "transparent"}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* ── end custom dropdown ── */}

            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              style={{
                padding: "7px 18px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8,
                color: "var(--cream-dim)",
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 13,
                cursor: saving ? "not-allowed" : "pointer",
                opacity: saving ? 0.5 : 1,
              }}
            >
              {saving ? "Saving..." : "Save draft"}
            </button>

            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              style={{
                padding: "7px 18px",
                background: "var(--lime)",
                color: "#000",
                border: "none",
                borderRadius: 8,
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 13,
                cursor: saving ? "not-allowed" : "pointer",
                opacity: saving ? 0.5 : 1,
                display: "flex",
                alignItems: "center",
                gap: 7,
              }}
            >
              Publish
              <span style={{ display: "inline-flex", alignItems: "center" }}>
                <IconArrowRight size={13} strokeWidth={2.5} />
              </span>
            </button>
          </div>
        </div>

        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "40px 60px",
        }}>
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <div style={{ marginBottom: 32 }}>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Form title"
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontSize: 28,
                  fontWeight: 800,
                  color: "var(--cream)",
                  fontFamily: "var(--font-display)",
                  letterSpacing: "-0.03em",
                  marginBottom: 8,
                }}
              />

              <input
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Add a description (optional)"
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontSize: 14,
                  color: "rgba(255,255,255,0.4)",
                  fontFamily: "var(--font-body)",
                }}
              />

              <div style={{
                height: 1,
                background: "rgba(255,255,255,0.06)",
                marginTop: 16,
              }} />
            </div>

            {fields.length === 0 ? (
              <EmptyCanvas />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {fields.map((field, i) => (
                  <FieldCard
                    key={field.id}
                    field={field}
                    isActive={activeFieldId === field.id}
                    isFirst={i === 0}
                    isLast={i === fields.length - 1}
                    onClick={() => setActiveFieldId(field.id)}
                    onDelete={() => deleteField(field.id)}
                    onMove={dir => moveField(field.id, dir)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <aside style={{
        width: 280,
        flexShrink: 0,
        borderLeft: "1px solid rgba(255,255,255,0.06)",
        background: "#0D0D0D",
        overflowY: "auto",
        padding: "16px",
      }}>
        {activeField ? (
          <FieldProperties
            field={activeField}
            onChange={patch => updateField(activeField.id, patch)}
          />
        ) : (
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            gap: 8,
            opacity: 0.3,
          }}>
            <div style={{ fontSize: 32 }}>◈</div>
            <div style={{
              fontSize: 12,
              color: "var(--cream-dim)",
              fontFamily: "var(--font-display)",
              textAlign: "center",
            }}>
              Click a field to edit its properties
            </div>
          </div>
        )}
      </aside>
    </div>
  )
}

function FieldTypeBtn({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  const [hov, setHov] = useState(false)

  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 10px",
        borderRadius: 8,
        marginBottom: 2,
        background: hov ? "rgba(184,255,53,0.08)" : "transparent",
        border: "none",
        cursor: "pointer",
        width: "100%",
        transition: "background .15s",
        textAlign: "left",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <span style={{
        width: 30,
        height: 30,
        borderRadius: 7,
        flexShrink: 0,
        background: hov ? "rgba(184,255,53,0.18)" : "rgba(184,255,53,0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--lime)",
        transition: "background .15s",
      }}>
        {icon}
      </span>

      <span style={{
        fontSize: 14,
        color: hov ? "var(--cream)" : "var(--cream-dim)",
        fontFamily: "var(--font-body)",
        transition: "color .15s",
      }}>
        {label}
      </span>
    </button>
  )
}

function FieldCard({ field, isActive, isFirst, isLast, onClick, onDelete, onMove }: {
  field: Field
  isActive: boolean
  isFirst: boolean
  isLast: boolean
  onClick: () => void
  onDelete: () => void
  onMove: (dir: "up" | "down") => void
}) {
  const [hov, setHov] = useState(false)

  return (
    <div
      onClick={onClick}
      style={{
        padding: "20px 24px",
        background: isActive ? "rgba(184,255,53,0.04)" : hov ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.01)",
        border: `1px solid ${isActive ? "rgba(184,255,53,0.3)" : "rgba(255,255,255,0.07)"}`,
        borderRadius: 10,
        cursor: "pointer",
        transition: "all .15s",
        position: "relative",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div style={{
        fontSize: 13,
        fontWeight: 600,
        color: isActive ? "var(--lime)" : "var(--cream)",
        fontFamily: "var(--font-display)",
        marginBottom: 8,
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}>
        {field.label}
        {field.required && <span style={{ color: "#f87171", fontSize: 11 }}>*</span>}
      </div>

      <FieldPreview field={field} />

      {(hov || isActive) && (
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 12,
            display: "flex",
            gap: 4,
          }}
          onClick={e => e.stopPropagation()}
        >
          <ActionBtn onClick={() => onMove("up")} disabled={isFirst}>↑</ActionBtn>
          <ActionBtn onClick={() => onMove("down")} disabled={isLast}>↓</ActionBtn>
          <ActionBtn onClick={onDelete} danger>✕</ActionBtn>
        </div>
      )}
    </div>
  )
}

function ActionBtn({ onClick, disabled, danger, children }: {
  onClick: () => void
  disabled?: boolean
  danger?: boolean
  children: React.ReactNode
}) {
  const [hov, setHov] = useState(false)

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 24,
        height: 24,
        borderRadius: 4,
        background: danger && hov
          ? "rgba(248,113,113,0.15)"
          : hov
            ? "rgba(255,255,255,0.08)"
            : "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        color: danger
          ? hov ? "#f87171" : "rgba(255,255,255,0.3)"
          : "rgba(255,255,255,0.4)",
        fontSize: 11,
        cursor: disabled ? "default" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: disabled ? 0.3 : 1,
        transition: "all .15s",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {children}
    </button>
  )
}

function FieldPreview({ field }: { field: Field }) {
  const base: React.CSSProperties = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 6,
    padding: "9px 12px",
    fontSize: 13,
    color: "rgba(255,255,255,0.25)",
    fontFamily: "var(--font-body)",
    width: "100%",
  }

  if (field.type === "textarea") {
    return (
      <div style={{ ...base, minHeight: 72, display: "flex", alignItems: "flex-start" }}>
        {field.placeholder || "Long answer text..."}
      </div>
    )
  }

  if (field.type === "select") {
    return (
      <div style={{ ...base, display: "flex", justifyContent: "space-between" }}>
        <span>Select an option</span>
        <span>▾</span>
      </div>
    )
  }

  if (field.type === "radio" || field.type === "checkbox") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {field.options.slice(0, 3).map((opt, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 14,
              height: 14,
              borderRadius: field.type === "radio" ? "50%" : 3,
              border: "1.5px solid rgba(255,255,255,0.2)",
              flexShrink: 0,
            }} />
            <span style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.4)",
              fontFamily: "var(--font-body)",
            }}>
              {opt}
            </span>
          </div>
        ))}
      </div>
    )
  }

  if (field.type === "rating") {
    return (
      <div style={{ display: "flex", gap: 6 }}>
        {[1, 2, 3, 4, 5].map(n => (
          <span key={n} style={{ fontSize: 20, color: "rgba(255,255,255,0.15)" }}>★</span>
        ))}
      </div>
    )
  }

  if (field.type === "date") {
    return (
      <div style={{ ...base, display: "flex", justifyContent: "space-between" }}>
        <span>MM / DD / YYYY</span>
        <span style={{ fontSize: 14 }}>📅</span>
      </div>
    )
  }

  return (
    <div style={base}>
      {field.placeholder || `Enter ${field.label.toLowerCase()}...`}
    </div>
  )
}

function FieldProperties({ field, onChange }: { field: Field; onChange: (p: Partial<Field>) => void }) {
  return (
    <div>
      <div style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.25)",
        marginBottom: 20,
        fontFamily: "var(--font-display)",
      }}>
        Field Settings
      </div>

      <PropGroup label="Label">
        <PropInput
          value={field.label}
          onChange={v => onChange({ label: v })}
          placeholder="Field label"
        />
      </PropGroup>

      {field.type !== "radio" && field.type !== "checkbox" && field.type !== "rating" && (
        <PropGroup label="Placeholder">
          <PropInput
            value={field.placeholder}
            onChange={v => onChange({ placeholder: v })}
            placeholder="Placeholder text"
          />
        </PropGroup>
      )}

      <PropGroup label="Required">
        <Toggle
          value={field.required}
          onChange={v => onChange({ required: v })}
        />
      </PropGroup>

      {(field.type === "select" || field.type === "radio" || field.type === "checkbox") && (
        <PropGroup label="Options">
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {field.options.map((opt, i) => (
              <div key={i} style={{ display: "flex", gap: 6 }}>
                <input
                  value={opt}
                  onChange={e => {
                    const next = [...field.options]
                    next[i] = e.target.value
                    onChange({ options: next })
                  }}
                  style={{
                    flex: 1,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 6,
                    padding: "6px 10px",
                    color: "var(--cream)",
                    fontSize: 13,
                    fontFamily: "var(--font-body)",
                    outline: "none",
                  }}
                />

                <button
                  onClick={() => onChange({ options: field.options.filter((_, j) => j !== i) })}
                  style={{
                    width: 28,
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 6,
                    color: "rgba(255,255,255,0.3)",
                    cursor: "pointer",
                    fontSize: 12,
                  }}
                >
                  ✕
                </button>
              </div>
            ))}

            <button
              onClick={() => onChange({ options: [...field.options, `Option ${field.options.length + 1}`] })}
              style={{
                padding: "6px",
                background: "rgba(255,255,255,0.03)",
                border: "1px dashed rgba(255,255,255,0.1)",
                borderRadius: 6,
                color: "rgba(255,255,255,0.3)",
                cursor: "pointer",
                fontSize: 12,
                fontFamily: "var(--font-body)",
              }}
            >
              + Add option
            </button>
          </div>
        </PropGroup>
      )}
    </div>
  )
}

function PropGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{
        fontSize: 11,
        fontWeight: 600,
        color: "rgba(255,255,255,0.4)",
        fontFamily: "var(--font-display)",
        marginBottom: 8,
        letterSpacing: "0.04em",
      }}>
        {label}
      </div>
      {children}
    </div>
  )
}

function PropInput({ value, onChange, placeholder }: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 6,
        padding: "8px 10px",
        color: "var(--cream)",
        fontSize: 13,
        fontFamily: "var(--font-body)",
        outline: "none",
        transition: "border-color .15s",
      }}
      onFocus={e => e.currentTarget.style.borderColor = "rgba(184,255,53,0.3)"}
      onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
    />
  )
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      onClick={() => onChange(!value)}
      style={{
        width: 40,
        height: 22,
        borderRadius: 99,
        background: value ? "var(--lime)" : "rgba(255,255,255,0.1)",
        position: "relative",
        cursor: "pointer",
        transition: "background .2s",
      }}
    >
      <div style={{
        position: "absolute",
        top: 3,
        left: value ? 21 : 3,
        width: 16,
        height: 16,
        borderRadius: "50%",
        background: value ? "#000" : "rgba(255,255,255,0.4)",
        transition: "left .2s",
      }} />
    </div>
  )
}

function EmptyCanvas() {
  return (
    <div style={{
      border: "1.5px dashed rgba(255,255,255,0.08)",
      borderRadius: 12,
      padding: "60px 40px",
      textAlign: "center",
    }}>
      <div style={{ fontSize: 36, marginBottom: 16, opacity: 0.3 }}>◈</div>
      <div style={{
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: 16,
        color: "var(--cream)",
        marginBottom: 8,
        opacity: 0.5,
      }}>
        No fields yet
      </div>
      <div style={{
        fontSize: 13,
        color: "rgba(255,255,255,0.25)",
        fontFamily: "var(--font-body)",
      }}>
        Click a field type on the left to add it here
      </div>
    </div>
  )
}