import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Adaptive tokens — flip between light/dark via CSS variables (see globals.css).
        // These hold plain hex behind a var(), so Tailwind's `/opacity` modifier
        // CANNOT derive a faded version: `text-fg/15` generates no rule at all and
        // silently falls back to the inherited colour. Use the tint tokens below
        // (fg-ghost / fg-dim / fill-soft / line-strong) instead of a slash modifier.
        bg: "var(--bg)",
        "bg-alt": "var(--bg-alt)",
        surface: "var(--surface)",
        fg: "var(--fg)",
        muted: "var(--muted)",
        line: "var(--line)",
        "line-strong": "var(--line-strong)",
        "fg-ghost": "var(--fg-ghost)",
        "fg-dim": "var(--fg-dim)",
        "fill-soft": "var(--fill-soft)",

        // Fixed tokens — intentionally stay dark in both themes (footer, CTA banners, case-study cards)
        ink: "#0b0b0c",
        "ink-soft": "#161618",
        "line-dark": "rgba(255,255,255,0.1)",

        accent: {
          yellow: "#f4d100",
          red: "#ef4136",
          // Darker red for white text on a filled red surface (e.g. the
          // labeled cursor states) — the base red only gives ~3.9:1
          // contrast with white, below WCAG AA for small text; this
          // gives ~8.7:1.
          "red-deep": "#8f241c",
          // Fill for the primary button. Measured: white on the base red is
          // 3.83:1, under the 4.5:1 AA floor — so every primary CTA on the
          // site was failing. This is 5.14:1 and still reads as the brand
          // red, where red-deep would darken the button to near-maroon.
          "red-cta": "#cf2f26",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-body)", "sans-serif"],
      },
      spacing: {
        // Named steps beyond Tailwind's default scale, for section-level rhythm.
        "120": "7.5rem",
        "160": "10rem",
      },
      borderRadius: {
        // Sitewide standard corner radius for buttons, cards, inputs, and tags.
        pill: "14px",
        // Broader radius scale for surfaces that aren't pill-shaped controls.
        sm: "8px",
        md: "14px",
        lg: "20px",
        feature: "28px",
        image: "18px",
        modal: "24px",
      },
      boxShadow: {
        // Elevation scale — use instead of ad hoc shadow values.
        "elevation-1": "0 8px 24px -12px rgba(11,11,12,0.12)",
        "elevation-2": "0 24px 48px -24px rgba(11,11,12,0.18)",
        "elevation-3": "0 40px 80px -24px rgba(11,11,12,0.28)",
        "elevation-1-dark": "0 8px 24px -12px rgba(0,0,0,0.4)",
        "elevation-2-dark": "0 24px 48px -20px rgba(0,0,0,0.6)",
        "elevation-3-dark": "0 40px 80px -20px rgba(0,0,0,0.7)",
        "glow-red": "0 8px 30px -8px rgba(239,65,54,0.45)",
      },
    },
  },
  plugins: [],
};

export default config;
