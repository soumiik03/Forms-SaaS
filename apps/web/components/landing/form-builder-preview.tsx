"use client";

import { useState } from "react";
import { S } from "./landing-styles";

const FIELD_TYPES = [
  { icon: "T", label: "Text Input" },
  { icon: "✉", label: "Email" },
  { icon: "☎", label: "Phone" },
  { icon: "↓", label: "Dropdown" },
  { icon: "⊙", label: "Radio" },
  { icon: "☑", label: "Checkbox" },
  { icon: "📅", label: "Date" },
  { icon: "★", label: "Rating" },
];

function FormBuilderPreview() {
  const [activeField, setActiveField] = useState(1);
  const [fields, setFields] = useState([
    { id: 1, type: "Text Input", label: "Full Name", required: true },
    { id: 2, type: "Email", label: "Email Address", required: true },
    { id: 3, type: "Dropdown", label: "Company Size", required: false },
  ]);

  const addField = (type: string) => {
    setFields([
      ...fields,
      { id: Date.now(), type, label: `New ${type}`, required: false },
    ]);
  };

  return (
    <div style={S.demoWrap}>
      <div style={S.demoBar}>
        <div style={{ ...S.dot, background: "#ff5f57" }} />
        <div style={{ ...S.dot, background: "#ffbd2e" }} />
        <div style={{ ...S.dot, background: "#28c840" }} />
        <span
          style={{
            marginLeft: "16px",
            fontFamily: "var(--font-body)",
            fontSize: "12px",
            color: "var(--text-muted)",
          }}
        >
          formulate.io/builder — Contact Form
        </span>
        <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
          {["Preview", "Share", "Publish"].map((b) => (
            <button
              key={b}
              style={{
                background:
                  b === "Publish" ? "var(--lime)" : "rgba(255,255,255,0.05)",
                color: b === "Publish" ? "#000" : "var(--cream-dim)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                padding: "4px 12px",
                fontSize: "12px",
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      <div style={S.demoContent}>
        {/* Sidebar */}
        <div style={S.demoSidebar}>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "10px",
              fontWeight: 700,
              color: "var(--text-subtle)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}
          >
            Field Types
          </div>
          {FIELD_TYPES.map((f) => (
            <div
              key={f.label}
              onClick={() => addField(f.label)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "9px 12px",
                borderRadius: "8px",
                marginBottom: "4px",
                cursor: "pointer",
                transition: "background 0.15s",
                background: "rgba(255,255,255,0.02)",
                fontSize: "13px",
                fontFamily: "var(--font-body)",
                color: "var(--cream-dim)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(184,255,53,0.08)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.02)")
              }
            >
              <span
                style={{
                  width: "26px",
                  height: "26px",
                  background: "rgba(184,255,53,0.1)",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  color: "var(--lime)",
                }}
              >
                {f.icon}
              </span>
              {f.label}
            </div>
          ))}
        </div>

        {/* Canvas */}
        <div style={S.demoMain}>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "22px",
              color: "var(--cream)",
              marginBottom: "6px",
              letterSpacing: "-0.02em",
            }}
          >
            Contact Us
          </div>
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              color: "var(--text-muted)",
              marginBottom: "28px",
            }}
          >
            We'd love to hear from you. Fill out the form below.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {fields.map((field) => (
              <div
                key={field.id}
                onClick={() => setActiveField(field.id)}
                style={{
                  background:
                    activeField === field.id
                      ? "rgba(184,255,53,0.05)"
                      : "rgba(255,255,255,0.02)",
                  border: `1px solid ${
                    activeField === field.id
                      ? "rgba(184,255,53,0.3)"
                      : "var(--border)"
                  }`,
                  borderRadius: "10px",
                  padding: "16px 20px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "12px",
                    fontWeight: 600,
                    color:
                      activeField === field.id
                        ? "var(--lime)"
                        : "var(--cream)",
                    marginBottom: "8px",
                  }}
                >
                  {field.label}
                  {field.required && (
                    <span style={{ color: "#f97316", marginLeft: "4px" }}>
                      *
                    </span>
                  )}
                </div>
                <div
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    borderRadius: "6px",
                    padding: "10px 14px",
                    fontSize: "13px",
                    color: "var(--text-subtle)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {field.type === "Dropdown" ? "Select an option ▾" : `Enter ${field.label.toLowerCase()}…`}
                </div>
              </div>
            ))}
            <div
              style={{
                border: "1.5px dashed rgba(184,255,53,0.2)",
                borderRadius: "10px",
                padding: "16px",
                textAlign: "center",
                fontSize: "13px",
                color: "var(--text-subtle)",
                fontFamily: "var(--font-body)",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "rgba(184,255,53,0.5)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "rgba(184,255,53,0.2)")
              }
              onClick={() => addField("Text Input")}
            >
              + Click a field type to add
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FormBuilderPreviewSection() {
  return (
    <section
      id="builder"
      style={{ ...S.section, background: "var(--surface)" }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={S.label}>The Builder</div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: "40px",
          }}
        >
          <h2 style={{ ...S.h2, maxWidth: "540px" }}>
            Every form,{" "}
            <span style={S.h2Outline}>exactly how you imagine it.</span>
          </h2>
          <p style={{ ...S.bodyText, maxWidth: "320px" }}>
            Click any field type in the sidebar to add it to your form. It&apos;s
            that fast. Try it right here.
          </p>
        </div>
        <FormBuilderPreview />
      </div>
    </section>
  );
}
