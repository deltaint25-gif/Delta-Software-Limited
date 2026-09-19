# Delta Software Limited

Marketing/client-services website for Delta Software Limited, built with
[Next.js 14](https://nextjs.org/) (App Router), TypeScript, and Tailwind CSS.

## Tech stack

- [Next.js 14](https://nextjs.org/) &mdash; App Router
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## Project structure

```
app/                Route segments (pages, layout, global styles)
  page.tsx          Home
  services/         Services page
  about/            About page
  portfolio/        Portfolio page
  contact/          Contact page
components/         Shared UI components (Navbar, Footer, ContactForm, ...)
lib/                Shared utilities and constants
public/             Static assets
```

## Getting started

### Prerequisites

- Node.js 18.17 or later
- npm

### Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment variable template and fill in any values you need:

   ```bash
   cp .env.example .env
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available scripts

| Script            | Description                              |
| ----------------- | ----------------------------------------- |
| `npm run dev`     | Start the local development server        |
| `npm run build`   | Build the production bundle               |
| `npm run start`   | Serve the production build                |
| `npm run lint`    | Run ESLint                                 |

## Continuous integration

Every push and pull request targeting `main` runs lint and build checks via
GitHub Actions (see `.github/workflows/ci.yml`).
