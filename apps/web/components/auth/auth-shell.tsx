import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./auth.module.css";

type AuthBrandProps = {
  eyebrow?: string;
  headingFilled?: string;
  headingOutline?: string;
  description?: string;
};

type AuthShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  footerText: string;
  footerHref: string;
  footerCta: string;
  formEyebrow?: string;
  brand?: AuthBrandProps;
};

const defaultBrand: Required<AuthBrandProps> = {
  eyebrow: "Formulate",
  headingFilled: "Design once.",
  headingOutline: "Collect clearly.",
  description:
    "A focused builder for polished forms, controlled publishing, and response analytics in one workspace.",
};

export function AuthShell({
  title,
  description,
  children,
  footerText,
  footerHref,
  footerCta,
  formEyebrow = "Account",
  brand,
}: AuthShellProps) {
  const panel = { ...defaultBrand, ...brand };
  return (
    <main className={styles.page}>
      <section className={styles.brandPanel}>
        <Link href="/" className={styles.logo}>
          <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 2L18 6.5V13.5L10 18L2 13.5V6.5L10 2Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M10 2V18M2 6.5L10 11L18 6.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
          Formulate
        </Link>

        <div className={styles.brandContent}>
          <p className={styles.eyebrow}>{panel.eyebrow}</p>
          <h1 className={styles.brandHeading}>
            <span className={styles.headingFilled}>{panel.headingFilled}</span>
            <span className={styles.headingOutline}>{panel.headingOutline}</span>
          </h1>
          <p className={styles.brandDesc}>{panel.description}</p>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNum}>Build</span>
              <span className={styles.statLabel}>Visual forms</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>Share</span>
              <span className={styles.statLabel}>Public or unlisted</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>Track</span>
              <span className={styles.statLabel}>Responses</span>
            </div>
          </div>
        </div>

        <div className={styles.blob} aria-hidden="true" />
      </section>

      <section className={styles.formPanel}>
        <div className={styles.formWrap}>
          <div className={styles.header}>
            <p className={styles.formEyebrow}>{formEyebrow}</p>
            <h2>{title}</h2>
            <p className={styles.headerDesc}>{description}</p>
          </div>

          {children}

          <p className={styles.footerText}>
            {footerText}{" "}
            <Link href={footerHref} className={styles.footerLink}>
              {footerCta}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export function AuthInput({
  label,
  id,
  type = "text",
  placeholder,
  autoComplete,
  value,
  onChange,
}: {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className={styles.fieldGroup}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        className={styles.input}
      />
    </div>
  );
}

export function AuthButton({
  children,
  disabled,
}: {
  children: ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      className={styles.btnPrimary}
      disabled={disabled}
      style={{
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {children}
    </button>
  );
}

export function AuthDivider({ label = "or" }: { label?: string }) {
  return (
    <div className={styles.divider}>
      <span className={styles.dividerLine} />
      <span className={styles.dividerText}>{label}</span>
      <span className={styles.dividerLine} />
    </div>
  );
}

export function OAuthButton({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <button type="button" className={styles.btnOAuth}>
      {icon}
      {children}
    </button>
  );
}
