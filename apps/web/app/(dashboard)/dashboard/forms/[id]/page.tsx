"use client"

import { useEffect, useMemo, useState } from "react"
import type { CSSProperties } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react"
import { trpc } from "~/trpc/client"

type FieldType = "text" | "email" | "number" | "textarea" | "select" | "checkbox" | "radio" | "rating" | "date"

type EditableField = {
  id: string
  type: FieldType
  label: string
  placeholder: string
  required: boolean
  options: string[]
}

const FIELD_TYPES: { type: FieldType; label: string }[] = [
  { type: "text", label: "Short Text" },
  { type: "textarea", label: "Long Text" },
  { type: "email", label: "Email" },
  { type: "number", label: "Number" },
  { type: "select", label: "Dropdown" },
  { type: "radio", label: "Radio" },
  { type: "checkbox", label: "Checkbox" },
  { type: "rating", label: "Rating" },
  { type: "date", label: "Date" },
]

function newField(type: FieldType): EditableField {
  return {
    id: `new-${Math.random().toString(36).slice(2, 9)}`,
    type,
    label: FIELD_TYPES.find((field) => field.type === type)?.label ?? "Field",
    placeholder: "",
    required: false,
    options: type === "select" || type === "radio" || type === "checkbox"
      ? ["Option 1", "Option 2"]
      : [],
  }
}

export default function EditFormPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const utils = trpc.useUtils()
  const { data: forms, isLoading: formsLoading } = trpc.form.getMyForms.useQuery({})
  const form = useMemo(() => forms?.find((item) => item.id === id), [forms, id])
  const { data: serverFields, isLoading: fieldsLoading } = trpc.field.getFormFields.useQuery(
    { formId: id },
    { enabled: !!id }
  )

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [visibility, setVisibility] = useState<"public" | "unlisted">("unlisted")
  const [fields, setFields] = useState<EditableField[]>([])
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null)
  const [initialized, setInitialized] = useState(false)
  const [saving, setSaving] = useState(false)

  const updateForm = trpc.form.update.useMutation()
  const publishForm = trpc.form.publish.useMutation()
  const unpublishForm = trpc.form.unpublish.useMutation()
  const addField = trpc.field.addField.useMutation()
  const updateField = trpc.field.updateField.useMutation()
  const deleteField = trpc.field.deleteField.useMutation()

  const activeField = fields.find((field) => field.id === activeFieldId) ?? null
  const isLoading = formsLoading || fieldsLoading

  useEffect(() => {
    if (!form || !serverFields || initialized) return

    setTitle(form.title)
    setDescription(form.description ?? "")
    setVisibility((form.visibility ?? "unlisted") as "public" | "unlisted")
    setFields(serverFields.map((field: any) => ({
      id: field.id,
      type: field.type,
      label: field.label,
      placeholder: field.placeholder ?? "",
      required: Boolean(field.required),
      options: Array.isArray(field.options) ? field.options : [],
    })))
    setInitialized(true)
  }, [form, serverFields, initialized])

  const patchField = (fieldId: string, patch: Partial<EditableField>) => {
    setFields((current) => current.map((field) => field.id === fieldId ? { ...field, ...patch } : field))
  }

  const removeField = async (fieldId: string) => {
    setFields((current) => current.filter((field) => field.id !== fieldId))
    if (activeFieldId === fieldId) setActiveFieldId(null)
    if (!fieldId.startsWith("new-")) {
      await deleteField.mutateAsync({ fieldId })
      await utils.field.getFormFields.invalidate({ formId: id })
    }
  }

  const save = async (publish = form?.status === "published") => {
    if (!form) return
    setSaving(true)

    try {
      await updateForm.mutateAsync({
        id,
        title: title.trim() || "Untitled Form",
        description,
      })

      for (let index = 0; index < fields.length; index++) {
        const field = fields[index]!
        const payload = {
          type: field.type,
          label: field.label.trim() || "Untitled field",
          placeholder: field.placeholder,
          required: field.required,
          order: index,
          options: field.options.length > 0 ? field.options : undefined,
        }

        if (field.id.startsWith("new-")) {
          await addField.mutateAsync({ formId: id, ...payload })
        } else {
          await updateField.mutateAsync({ fieldId: field.id, ...payload })
        }
      }

      if (publish) {
        await publishForm.mutateAsync({ id, visibility })
      } else {
        await unpublishForm.mutateAsync({ id })
      }

      await utils.form.getMyForms.invalidate()
      await utils.field.getFormFields.invalidate({ formId: id })
      router.push("/dashboard/forms")
    } finally {
      setSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div style={{ padding: 48, color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-body)" }}>
        Loading form...
      </div>
    )
  }

  if (!form) {
    return (
      <div style={{ padding: 48 }}>
        <h1 style={{ color: "var(--cream)", fontFamily: "var(--font-display)", fontSize: 24 }}>
          Form not found
        </h1>
        <button onClick={() => router.push("/dashboard/forms")} style={ghostButton}>
          Back to forms
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px minmax(0,1fr) 300px", minHeight: "100vh", background: "#080808" }}>
      <aside style={sidePanel}>
        <div style={panelLabel}>Field Types</div>
        {FIELD_TYPES.map((field) => (
          <button
            key={field.type}
            type="button"
            onClick={() => {
              const next = newField(field.type)
              setFields((current) => [...current, next])
              setActiveFieldId(next.id)
            }}
            style={fieldTypeButton}
          >
            <Plus size={14} />
            {field.label}
          </button>
        ))}
      </aside>

      <main style={{ minWidth: 0 }}>
        <header style={topBar}>
          <button type="button" onClick={() => router.push("/dashboard/forms")} style={iconButton}>
            <ArrowLeft size={16} />
          </button>
          <div style={{ minWidth: 0 }}>
            <div style={{ color: "var(--cream)", fontFamily: "var(--font-display)", fontWeight: 700 }}>
              Edit form
            </div>
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, fontFamily: "var(--font-body)" }}>
              Update fields, visibility, and publishing status.
            </div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
            <select
              value={visibility}
              onChange={(event) => setVisibility(event.target.value as "public" | "unlisted")}
              style={{
                ...selectStyle,
                background: visibility === "unlisted" ? "rgba(184,255,53,0.08)" : "rgba(96,165,250,0.1)",
                borderColor: visibility === "unlisted" ? "rgba(184,255,53,0.22)" : "rgba(96,165,250,0.24)",
                color: visibility === "unlisted" ? "var(--lime)" : "#60a5fa",
              }}
            >
              <option value="unlisted" style={optionStyle}>Unlisted</option>
              <option value="public" style={optionStyle}>Public</option>
            </select>
            <button type="button" disabled={saving} onClick={() => save(false)} style={ghostButton}>
              Save draft
            </button>
            <button type="button" disabled={saving} onClick={() => save(true)} style={primaryButton}>
              <Save size={14} />
              {saving ? "Saving..." : "Save & publish"}
            </button>
          </div>
        </header>

        <div style={{ padding: "40px clamp(28px, 5vw, 72px)" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Form title"
              style={titleInput}
            />
            <input
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Add a description"
              style={descriptionInput}
            />

            <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "18px 0 28px" }} />

            {fields.length === 0 ? (
              <div style={emptyState}>Add a field type from the left panel to start rebuilding this form.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {fields.map((field) => (
                  <button
                    key={field.id}
                    type="button"
                    onClick={() => setActiveFieldId(field.id)}
                    style={{
                      ...fieldCard,
                      borderColor: activeFieldId === field.id ? "rgba(184,255,53,0.35)" : "rgba(255,255,255,0.08)",
                      background: activeFieldId === field.id ? "rgba(184,255,53,0.05)" : "rgba(255,255,255,0.02)",
                    }}
                  >
                    <span style={{ color: "var(--cream)", fontWeight: 700 }}>{field.label}</span>
                    <span style={{ color: "rgba(255,255,255,0.35)", textTransform: "capitalize" }}>{field.type}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <aside style={sidePanel}>
        {activeField ? (
          <FieldEditor
            field={activeField}
            onChange={(patch) => patchField(activeField.id, patch)}
            onDelete={() => removeField(activeField.id)}
          />
        ) : (
          <div style={{ color: "rgba(255,255,255,0.32)", fontSize: 13, fontFamily: "var(--font-body)", padding: 12 }}>
            Select a field to edit its settings.
          </div>
        )}
      </aside>
    </div>
  )
}

function FieldEditor({
  field,
  onChange,
  onDelete,
}: {
  field: EditableField
  onChange: (patch: Partial<EditableField>) => void
  onDelete: () => void
}) {
  return (
    <div>
      <div style={panelLabel}>Field Settings</div>
      <label style={labelStyle}>Label</label>
      <input value={field.label} onChange={(event) => onChange({ label: event.target.value })} style={inputStyle} />

      {field.type !== "radio" && field.type !== "checkbox" && field.type !== "rating" && (
        <>
          <label style={labelStyle}>Placeholder</label>
          <input value={field.placeholder} onChange={(event) => onChange({ placeholder: event.target.value })} style={inputStyle} />
        </>
      )}

      <label style={{ ...labelStyle, display: "flex", alignItems: "center", gap: 8 }}>
        <input
          type="checkbox"
          checked={field.required}
          onChange={(event) => onChange({ required: event.target.checked })}
        />
        Required
      </label>

      {(field.type === "select" || field.type === "radio" || field.type === "checkbox") && (
        <div style={{ marginTop: 18 }}>
          <div style={labelStyle}>Options</div>
          {field.options.map((option, index) => (
            <input
              key={index}
              value={option}
              onChange={(event) => {
                const next = [...field.options]
                next[index] = event.target.value
                onChange({ options: next })
              }}
              style={{ ...inputStyle, marginBottom: 8 }}
            />
          ))}
          <button
            type="button"
            onClick={() => onChange({ options: [...field.options, `Option ${field.options.length + 1}`] })}
            style={ghostButton}
          >
            Add option
          </button>
        </div>
      )}

      <button type="button" onClick={onDelete} style={{ ...dangerButton, marginTop: 24 }}>
        <Trash2 size={14} />
        Delete field
      </button>
    </div>
  )
}

const sidePanel: CSSProperties = {
  background: "#0D0D0D",
  borderRight: "1px solid rgba(255,255,255,0.06)",
  padding: 16,
  overflowY: "auto",
}

const topBar: CSSProperties = {
  height: 64,
  borderBottom: "1px solid rgba(255,255,255,0.06)",
  background: "#0D0D0D",
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "0 24px",
}

const panelLabel: CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.28)",
  fontFamily: "var(--font-display)",
  marginBottom: 14,
}

const fieldTypeButton: CSSProperties = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: 9,
  border: "none",
  background: "transparent",
  color: "var(--cream-dim)",
  padding: "9px 10px",
  borderRadius: 8,
  cursor: "pointer",
  fontFamily: "var(--font-display)",
  fontSize: 13,
}

const iconButton: CSSProperties = {
  width: 32,
  height: 32,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.03)",
  color: "var(--cream-dim)",
  cursor: "pointer",
}

const ghostButton: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "8px 14px",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 8,
  color: "var(--cream-dim)",
  fontFamily: "var(--font-display)",
  fontWeight: 600,
  fontSize: 13,
  cursor: "pointer",
}

const primaryButton: CSSProperties = {
  ...ghostButton,
  background: "var(--lime)",
  border: "none",
  color: "#000",
}

const dangerButton: CSSProperties = {
  ...ghostButton,
  color: "#f87171",
  border: "1px solid rgba(248,113,113,0.18)",
}

const selectStyle: CSSProperties = {
  border: "1px solid",
  borderRadius: 8,
  fontFamily: "var(--font-display)",
  fontWeight: 600,
  fontSize: 13,
  padding: "8px 12px",
  cursor: "pointer",
  outline: "none",
}

const optionStyle: CSSProperties = {
  background: "#111",
  color: "#f0ead6",
}

const titleInput: CSSProperties = {
  width: "100%",
  background: "transparent",
  border: "none",
  outline: "none",
  fontSize: 30,
  fontWeight: 800,
  color: "var(--cream)",
  fontFamily: "var(--font-display)",
}

const descriptionInput: CSSProperties = {
  width: "100%",
  background: "transparent",
  border: "none",
  outline: "none",
  fontSize: 14,
  color: "rgba(255,255,255,0.45)",
  fontFamily: "var(--font-body)",
  marginTop: 8,
}

const fieldCard: CSSProperties = {
  width: "100%",
  textAlign: "left",
  padding: "18px 20px",
  border: "1px solid",
  borderRadius: 10,
  cursor: "pointer",
  fontFamily: "var(--font-display)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}

const labelStyle: CSSProperties = {
  display: "block",
  color: "rgba(255,255,255,0.42)",
  fontSize: 12,
  fontWeight: 700,
  fontFamily: "var(--font-display)",
  margin: "16px 0 8px",
}

const inputStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 8,
  padding: "9px 11px",
  color: "var(--cream)",
  fontSize: 13,
  fontFamily: "var(--font-body)",
  outline: "none",
}

const emptyState: CSSProperties = {
  border: "1.5px dashed rgba(255,255,255,0.08)",
  borderRadius: 12,
  padding: "56px 32px",
  textAlign: "center",
  color: "rgba(255,255,255,0.35)",
  fontFamily: "var(--font-body)",
  fontSize: 14,
}
