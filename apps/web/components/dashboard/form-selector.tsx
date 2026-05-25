"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronDown } from "lucide-react"

type Option = {
  id: string
  title: string
}

export function FormSelector({
  value,
  options,
  onChange,
  minWidth = 320,
}: {
  value: string
  options: Option[]
  onChange: (id: string) => void
  minWidth?: number
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const selected = options.find((option) => option.id === value) ?? options[0]

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", close)
    return () => document.removeEventListener("mousedown", close)
  }, [])

  return (
    <div ref={rootRef} style={{ position: "relative", minWidth, width: "fit-content" }}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        style={{
          width: "100%",
          minWidth,
          minHeight: 46,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          padding: "0 14px 0 18px",
          background: "#101010",
          border: `1px solid ${open ? "rgba(184,255,53,0.26)" : "rgba(255,255,255,0.1)"}`,
          borderRadius: open ? "10px 10px 0 0" : 10,
          color: "var(--cream)",
          fontFamily: "var(--font-display)",
          fontSize: 14,
          fontWeight: 700,
          cursor: "pointer",
          outline: "none",
          boxShadow: open ? "0 18px 42px rgba(0,0,0,0.34)" : "none",
          transition: "border-color .15s, box-shadow .15s",
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          textAlign: "left",
        }}>
          {selected?.title ?? "Select a form"}
        </span>
        <ChevronDown
          size={17}
          style={{
            color: "rgba(240,234,214,0.74)",
            transform: open ? "rotate(180deg)" : "rotate(0)",
            transition: "transform .15s",
            flexShrink: 0,
          }}
        />
      </button>

      {open && (
        <div
          role="listbox"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 80,
            background: "#101010",
            border: "1px solid rgba(184,255,53,0.26)",
            borderTop: "none",
            borderRadius: "0 0 10px 10px",
            boxShadow: "0 22px 48px rgba(0,0,0,0.45)",
            overflow: "hidden",
          }}
        >
          {options.map((option) => {
            const active = option.id === selected?.id
            return (
              <button
                key={option.id}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => {
                  onChange(option.id)
                  setOpen(false)
                }}
                style={{
                  width: "100%",
                  minHeight: 38,
                  display: "flex",
                  alignItems: "center",
                  padding: "0 18px",
                  background: active ? "rgba(184,255,53,0.1)" : "#101010",
                  border: "none",
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  color: active ? "var(--lime)" : "var(--cream)",
                  fontFamily: "var(--font-display)",
                  fontSize: 14,
                  fontWeight: active ? 700 : 600,
                  textAlign: "left",
                  cursor: "pointer",
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.background = active
                    ? "rgba(184,255,53,0.14)"
                    : "rgba(255,255,255,0.045)"
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.background = active
                    ? "rgba(184,255,53,0.1)"
                    : "#101010"
                }}
              >
                {option.title}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
