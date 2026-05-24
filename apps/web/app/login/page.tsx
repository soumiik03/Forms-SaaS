"use client";

import Link from "next/link";
import {
  AuthShell,
  AuthInput,
  AuthButton,
} from "~/components/auth/auth-shell";
import styles from "~/components/auth/auth.module.css";

export default function LoginPage() {
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
      <form>
        <AuthInput
          label="Email address"
          id="email"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
        />
        <AuthInput
          label="Password"
          id="password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
        />

        <Link href="/forgot-password" className={styles.forgotLink}>
          Forgot password?
        </Link>

        <AuthButton>Open my workspace</AuthButton>
      </form>
    </AuthShell>
  );
}