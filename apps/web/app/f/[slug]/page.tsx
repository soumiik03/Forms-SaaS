"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { trpc } from "~/trpc/client"

type FieldType =
  | "text"
  | "email"
  | "number"
  | "textarea"
  | "select"
  | "checkbox"
  | "radio"
  | "rating"
  | "date"

interface FormField {
  id: string
  type: FieldType
  label: string
  placeholder?: string | null
  required: boolean | null
  options?: string[] | null
}

interface FormData {
  id: string
  title: string
  description?: string | null
  accentColor?: string | null
  successMessage?: string | null
  fields: FormField[]
}

export default function PublicFormPage() {
  const { slug } = useParams<{ slug: string }>()

  const { data: form, isLoading, error } = trpc.form.getBySlug.useQuery(
    { slug },
    { retry: false }
  )

  if (isLoading) return <LoadingScreen />
  if (error || !form) return <NotFoundScreen />

  return <FormFiller form={form as unknown as FormData} slug={slug} />
}

function FormFiller({ form, slug }: { form: FormData; slug: string }) {
  const [answers, setAnswers] = useState<Record<string, unknown>>({})
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [respondentEmail, setRespondentEmail] = useState("")
  const [submitError, setSubmitError] = useState("")

  const submit = trpc.response.submit.useMutation({
    onSuccess: () => setSubmitted(true),
    onError: err => setSubmitError(err.message),
  })

  const setAnswer = (fieldId: string, value: unknown) => {
    setAnswers(prev => ({ ...prev, [fieldId]: value }))
    setErrors(prev => ({ ...prev, [fieldId]: "" }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError("")

    const newErrors: Record<string, string> = {}

    form.fields?.forEach(field => {
      if (!field.required) return

      const val = answers[field.id]
      const isMissing =
        val === undefined ||
        val === null ||
        val === "" ||
        (Array.isArray(val) && val.length === 0)

      if (isMissing) {
        newErrors[field.id] = "This field is required"
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    submit.mutate({
      formSlug: slug,
      answers,
      respondentEmail: respondentEmail || undefined,
    })
  }

  if (submitted) return <SuccessScreen message={form.successMessage ?? undefined} />

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080808",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "60px 24px 100px",
    }}>
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 48,
        background: "rgba(8,8,8,0.9)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        zIndex: 50,
      }}>
        <span style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 14,
          color: "var(--cream)",
          letterSpacing: "-0.02em",
        }}>
          Formulate
        </span>
        <span style={{
          fontSize: 12,
          color: "rgba(255,255,255,0.3)",
          fontFamily: "var(--font-body)",
        }}>
          Powered by Formulate
        </span>
      </div>

      <div style={{
        width: "100%",
        maxWidth: 640,
        marginTop: 48,
      }}>
        <div style={{ marginBottom: 40 }}>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(24px, 4vw, 36px)",
            color: "var(--cream)",
            letterSpacing: "-0.03em",
            marginBottom: 10,
          }}>
            {form.title}
          </h1>

          {form.description && (
            <p style={{
              fontSize: 15,
              color: "rgba(255,255,255,0.45)",
              fontFamily: "var(--font-body)",
              lineHeight: 1.7,
            }}>
              {form.description}
            </p>
          )}

          <div style={{
            height: 2,
            marginTop: 24,
            background: "linear-gradient(90deg, var(--lime) 0%, transparent 100%)",
            opacity: 0.4,
          }} />
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {form.fields?.map(field => (
              <FormFieldInput
                key={field.id}
                field={field}
                value={answers[field.id]}
                error={errors[field.id]}
                onChange={val => setAnswer(field.id, val)}
              />
            ))}
          </div>

          <div style={{
            marginTop: 32,
            padding: "20px 0",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}>
            <label style={{
              fontSize: 13,
              fontWeight: 600,
              color: "rgba(255,255,255,0.4)",
              fontFamily: "var(--font-display)",
              display: "block",
              marginBottom: 8,
              letterSpacing: "0.02em",
            }}>
              Your email (optional - to receive a copy)
            </label>

            <input
              type="email"
              value={respondentEmail}
              onChange={e => setRespondentEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8,
                padding: "11px 14px",
                color: "var(--cream)",
                fontSize: 14,
                fontFamily: "var(--font-body)",
                outline: "none",
              }}
              onFocus={e => e.currentTarget.style.borderColor = "rgba(184,255,53,0.3)"}
              onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
            />
          </div>

          <button
            type="submit"
            disabled={submit.isPending}
            style={{
              width: "100%",
              marginTop: 8,
              padding: "14px",
              background: submit.isPending ? "rgba(184,255,53,0.5)" : "var(--lime)",
              color: "#000",
              border: "none",
              borderRadius: 10,
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 15,
              cursor: submit.isPending ? "not-allowed" : "pointer",
              transition: "opacity .15s",
            }}
          >
            {submit.isPending ? "Submitting..." : "Submit"}
          </button>
          {submitError && (
            <p style={{
              marginTop: 12,
              fontSize: 13,
              color: "#f87171",
              fontFamily: "var(--font-body)",
              textAlign: "center",
            }}>
              {submitError}
            </p>
          )}
        </form>
      </div>
    </div>
  )
}

function FormFieldInput({ field, value, error, onChange }: {
  field: FormField
  value: unknown
  error?: string
  onChange: (val: unknown) => void
}) {
  const inputBase: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: `1px solid ${error ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.08)"}`,
    borderRadius: 8,
    padding: "11px 14px",
    color: "var(--cream)",
    fontSize: 14,
    fontFamily: "var(--font-body)",
    outline: "none",
    transition: "border-color .15s",
  }

  return (
    <div>
      <label style={{
        display: "block",
        marginBottom: 8,
        fontSize: 14,
        fontWeight: 600,
        color: "var(--cream)",
        fontFamily: "var(--font-display)",
      }}>
        {field.label}
        {field.required && (
          <span style={{ color: "#f87171", marginLeft: 4 }}>*</span>
        )}
      </label>

      {field.type === "textarea" && (
        <textarea
          value={(value as string) ?? ""}
          onChange={e => onChange(e.target.value)}
          placeholder={field.placeholder ?? undefined}
          rows={4}
          style={{ ...inputBase, resize: "vertical" }}
          onFocus={e => e.currentTarget.style.borderColor = "rgba(184,255,53,0.3)"}
          onBlur={e => e.currentTarget.style.borderColor = error ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.08)"}
        />
      )}

      {(field.type === "text" ||
        field.type === "email" ||
        field.type === "number" ||
        field.type === "date") && (
        <input
          type={field.type}
          value={(value as string | number) ?? ""}
          onChange={e => {
            if (field.type === "number") {
              onChange(e.target.value === "" ? "" : Number(e.target.value))
              return
            }

            onChange(e.target.value)
          }}
          placeholder={field.placeholder ?? undefined}
          style={inputBase}
          onFocus={e => e.currentTarget.style.borderColor = "rgba(184,255,53,0.3)"}
          onBlur={e => e.currentTarget.style.borderColor = error ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.08)"}
        />
      )}

      {field.type === "select" && (
        <select
          value={(value as string) ?? ""}
          onChange={e => onChange(e.target.value)}
          style={{ ...inputBase, background: "#111", cursor: "pointer" }}
        >
          <option value="" disabled style={{ background: "#111", color: "rgba(255,255,255,0.45)" }}>Select an option</option>
          {field.options?.map(opt => (
            <option key={opt} value={opt} style={{ background: "#111", color: "#f0ead6" }}>{opt}</option>
          ))}
        </select>
      )}

      {field.type === "radio" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {field.options?.map(opt => (
            <label key={opt} style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
            }}>
              <div style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                border: `2px solid ${value === opt ? "var(--lime)" : "rgba(255,255,255,0.2)"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "border-color .15s",
              }}>
                {value === opt && (
                  <div style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "var(--lime)",
                  }} />
                )}
              </div>

              <input
                type="radio"
                name={field.id}
                value={opt}
                checked={value === opt}
                onChange={() => onChange(opt)}
                style={{ display: "none" }}
              />

              <span style={{
                fontSize: 14,
                color: "var(--cream-dim)",
                fontFamily: "var(--font-body)",
              }}>
                {opt}
              </span>
            </label>
          ))}
        </div>
      )}

      {field.type === "checkbox" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {field.options?.map(opt => {
            const checked = Array.isArray(value) && (value as string[]).includes(opt)
            return (
              <label key={opt} style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                cursor: "pointer",
              }}>
                <div style={{
                  width: 18,
                  height: 18,
                  borderRadius: 4,
                  border: `2px solid ${checked ? "var(--lime)" : "rgba(255,255,255,0.2)"}`,
                  background: checked ? "var(--lime)" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "all .15s",
                }}>
                  {checked && (
                    <span style={{ fontSize: 11, color: "#000", fontWeight: 700 }}>✓</span>
                  )}
                </div>

                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    const prev = Array.isArray(value) ? (value as string[]) : []
                    onChange(checked ? prev.filter(v => v !== opt) : [...prev, opt])
                  }}
                  style={{ display: "none" }}
                />

                <span style={{
                  fontSize: 14,
                  color: "var(--cream-dim)",
                  fontFamily: "var(--font-body)",
                }}>
                  {opt}
                </span>
              </label>
            )
          })}
        </div>
      )}

      {field.type === "rating" && (
        <div style={{ display: "flex", gap: 8 }}>
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              style={{
                fontSize: 28,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: typeof value === "number" && value >= n ? "#facc15" : "rgba(255,255,255,0.15)",
                transition: "color .15s, transform .1s",
                padding: 0,
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.2)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            >
              ★
            </button>
          ))}
        </div>
      )}

      {error && (
        <p style={{
          marginTop: 6,
          fontSize: 12,
          color: "#f87171",
          fontFamily: "var(--font-body)",
        }}>
          {error}
        </p>
      )}
    </div>
  )
}

function LoadingScreen() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#080808",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: 16,
    }}>
      <div style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        border: "2px solid rgba(255,255,255,0.06)",
        borderTop: "2px solid var(--lime)",
        animation: "spin 0.8s linear infinite",
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <span style={{
        fontSize: 14,
        color: "rgba(255,255,255,0.3)",
        fontFamily: "var(--font-body)",
      }}>
        Loading form...
      </span>
    </div>
  )
}

function NotFoundScreen() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#080808",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: 12,
      textAlign: "center",
      padding: 40,
    }}>
      <div style={{ fontSize: 48, marginBottom: 8 }}>◈</div>
      <h1 style={{
        fontFamily: "var(--font-display)",
        fontWeight: 800,
        fontSize: 24,
        color: "var(--cream)",
        letterSpacing: "-0.03em",
      }}>
        Form not found
      </h1>
      <p style={{
        fontSize: 15,
        color: "rgba(255,255,255,0.4)",
        fontFamily: "var(--font-body)",
        maxWidth: 360,
      }}>
        This form doesn't exist, has been unpublished, or the link is incorrect.
      </p>
    </div>
  )
}

function SuccessScreen({ message }: { message?: string }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#080808",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: 16,
      textAlign: "center",
      padding: 40,
    }}>
      <div style={{
        width: 64,
        height: 64,
        borderRadius: "50%",
        background: "rgba(184,255,53,0.1)",
        border: "2px solid rgba(184,255,53,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 28,
        marginBottom: 8,
      }}>
        ✓
      </div>
      <h1 style={{
        fontFamily: "var(--font-display)",
        fontWeight: 800,
        fontSize: 28,
        color: "var(--cream)",
        letterSpacing: "-0.03em",
      }}>
        Response submitted!
      </h1>
      <p style={{
        fontSize: 15,
        color: "rgba(255,255,255,0.45)",
        fontFamily: "var(--font-body)",
        maxWidth: 400,
        lineHeight: 1.7,
      }}>
        {message ?? "Thank you for your response. It has been recorded successfully."}
      </p>
      <a href="/" style={{
        marginTop: 8,
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "10px 24px",
        background: "var(--lime)",
        color: "#000",
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: 13,
        textDecoration: "none",
        borderRadius: 8,
      }}>
        Back to Formulate
      </a>
    </div>
  )
}
