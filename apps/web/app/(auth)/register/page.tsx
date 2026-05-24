"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { trpc } from "~/trpc/client"
import { authStore } from "~/lib/auth"
import { AuthShell, AuthInput, AuthButton } from "~/components/auth/auth-shell"
import styles from "~/components/auth/auth.module.css"

export default function RegisterPage() {
  const router = useRouter()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const register = trpc.auth.register.useMutation({
    onSuccess: async () => {
      // After register, auto-login to get the token
      login.mutate({ email, password })
    },
    onError: (err) => {
      setError(err.message)
    },
  })

  const login = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      authStore.setToken(data.token)
      router.push("/dashboard")
    },
    onError: () => {
      // Register worked but auto-login failed — just redirect to login
      router.push("/login")
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    register.mutate({
      fullName: `${firstName.trim()} ${lastName.trim()}`,
      email,
      password,
    })
  }

  const isPending = register.isPending || login.isPending

  return (
    <AuthShell
      formEyebrow="Get started"
      title="Create your workspace."
      description="Sketch your first form today. Publish when it feels right — no credit card, no countdown timers."
      footerText="Already building with us?"
      footerHref="/login"
      footerCta="Sign in instead →"
      brand={{
        eyebrow: "First form in minutes",
        headingFilled: "Your ideas,",
        headingOutline: "one clean canvas.",
        description:
          "Drag fields, wire simple logic, and share a link that actually matches your brand — not another generic embed.",
      }}
    >
      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <AuthInput
            label="First name"
            id="firstName"
            type="text"
            placeholder="Jane"
            autoComplete="given-name"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
          />
          <AuthInput
            label="Last name"
            id="lastName"
            type="text"
            placeholder="Doe"
            autoComplete="family-name"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
          />
        </div>

        <AuthInput
          label="Email"
          id="email"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <AuthInput
          label="Password"
          id="password"
          type="password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {error && (
          <p style={{ color: "#f87171", fontSize: 13, marginBottom: 12, marginTop: -8 }}>
            {error}
          </p>
        )}

        <AuthButton disabled={isPending}>
          {isPending ? "Creating workspace..." : "Create my workspace →"}
        </AuthButton>

        <p className={styles.termsText}>
          By creating an account you agree to our{" "}
          <a href="/terms">Terms of Service</a> and{" "}
          <a href="/privacy">Privacy Policy</a>.
        </p>
      </form>
    </AuthShell>
  )
}