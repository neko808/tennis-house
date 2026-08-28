import type { Config } from "tailwindcss";

/**
 * Design tokens live in styles/globals.css as CSS custom properties (§3.2).
 * Tailwind maps utility names onto those variables so components never
 * hard-code hex values. Spacing uses Tailwind's default 4px-based scale (§3.4).
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        "ink-muted": "rgb(var(--color-ink-muted) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        "accent-hover": "rgb(var(--color-accent-hover) / <alpha-value>)",
        ball: "rgb(var(--color-ball) / <alpha-value>)",
        line: "rgb(var(--color-border) / <alpha-value>)",
        error: "rgb(var(--color-error) / <alpha-value>)",
        success: "rgb(var(--color-success) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["NeueHaasDisplay", "Helvetica Neue", "Arial", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      borderRadius: {
        card: "0.5rem",
        btn: "0.375rem",
        modal: "0.75rem",
      },
      aspectRatio: {
        product: "4 / 5",
      },
    },
  },
  plugins: [],
};

export default config;
