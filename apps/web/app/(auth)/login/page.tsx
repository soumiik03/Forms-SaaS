"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { trpc } from "~/trpc/client"
import { authStore } from "~/lib/auth"
import { AuthShell, AuthInput, AuthButton } from "~/components/auth/auth-shell"
import styles from "~/components/auth/auth.module.css"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const login = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      authStore.setToken(data.token)
      router.push("/dashboard")
    },
    onError: (err) => {
      setError(err.message)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    login.mutate({ email, password })
  }

  return (
    <AuthShell
      formEyebrow="Sign in"
      title="Welcome back."
      description="Open your dashboard, tweak a live form, or see what landed while you were away."
      footerText="New to Formulate?"
      footerHref="/register"
      footerCta="Create a free workspace →"
      brand={{
        eyebrow: "Your workspace",
        headingFilled: "Pick up",
        headingOutline: "where you left off.",
        description:
          "Every draft, published form, and response stream lives in one calm place — no tab-hopping, no export gymnastics.",
      }}
    >
      <form onSubmit={handleSubmit}>
        <AuthInput
          label="Email address"
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
          placeholder="••••••••"
          autoComplete="current-password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {error && (
          <p style={{ color: "#f87171", fontSize: 13, marginBottom: 12, marginTop: -8 }}>
            {error}
          </p>
        )}

        <Link href="/forgot-password" className={styles.forgotLink}>
          Forgot password?
        </Link>

        <AuthButton disabled={login.isPending}>
          {login.isPending ? "Signing in..." : "Open my workspace"}
        </AuthButton>
      </form>
    </AuthShell>
  )
}