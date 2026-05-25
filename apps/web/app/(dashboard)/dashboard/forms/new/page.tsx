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

const FIELD_TYPES: { type: FieldType; icon: string; label: string }[] = [
  { type: "text", icon: "T", label: "Short Text" },
  { type: "textarea", icon: "¶", label: "Long Text" },
  { type: "email", icon: "✉", label: "Email" },
  { type: "number", icon: "#", label: "Number" },
  { type: "select", icon: "↓", label: "Dropdown" },
  { type: "radio", icon: "⊙", label: "Radio" },
  { type: "checkbox", icon: "☑", label: "Checkbox" },
  { type: "rating", icon: "★", label: "Rating" },
  { type: "date", icon: "📅", label: "Date" },
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
            <select
              value={visibility}
              onChange={e => setVisibility(e.target.value as "public" | "unlisted")}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8,
                color: "var(--cream-dim)",
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 13,
                padding: "7px 14px",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="unlisted">🔒 Unlisted</option>
              <option value="public">🌐 Public</option>
            </select>

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
              }}
            >
              Publish →
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

function FieldTypeBtn({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
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
        width: 28,
        height: 28,
        borderRadius: 6,
        flexShrink: 0,
        background: "rgba(184,255,53,0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 13,
        color: "var(--lime)",
      }}>
        {icon}
      </span>

      <span style={{
        fontSize: 13,
        color: "var(--cream-dim)",
        fontFamily: "var(--font-body)",
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