"use client";

import {
  AuthShell,
  AuthInput,
  AuthButton,
} from "~/components/auth/auth-shell";
import styles from "~/components/auth/auth.module.css";

export default function RegisterPage() {
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
      <form>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <AuthInput
            label="First name"
            id="firstName"
            type="text"
            placeholder="Jane"
            autoComplete="given-name"
          />
          <AuthInput
            label="Last name"
            id="lastName"
            type="text"
            placeholder="Doe"
            autoComplete="family-name"
          />
        </div>

        <AuthInput
          label="Email"
          id="email"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
        />

        <AuthInput
          label="Password"
          id="password"
          type="password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
        />

        <AuthButton>Create my workspace →</AuthButton>

        <p className={styles.termsText}>
          By creating an account you agree to our{" "}
          <a href="/terms">Terms of Service</a> and{" "}
          <a href="/privacy">Privacy Policy</a>.
        </p>
      </form>
    </AuthShell>
  );
}