<div align="center">

# Delta Software Limited

**Software development, product design, and digital experiences.**

Company website showcasing our services, work, and insights, with a project enquiry form.

Next.js 14 · React 18 · TypeScript · Tailwind CSS

[Getting started](#getting-started) · [Project structure](#project-structure) · [Configuration](#configuration) · [Development](#development)

</div>

---

## Overview

Built with the Next.js App Router, the website brings together company information, service offerings, portfolio case studies, and a blog.

- **Services:** overview and individual service pages.
- **Portfolio:** project listings and detailed case studies.
- **Blog:** article listings and individual posts.
- **Contact:** project enquiries forwarded through a server-side API route.
- **Experience:** responsive layouts, theme switching, motion effects, and 3D visuals.
- **Site essentials:** metadata utilities, privacy and terms pages, and security headers.

## Tech stack

| Area | Technologies |
| --- | --- |
| Framework | Next.js 14, React 18, TypeScript |
| Styling | Tailwind CSS, Lucide icons |
| Animation | Framer Motion, GSAP, Lenis |
| 3D | Three.js, React Three Fiber |
| Code checks | ESLint, TypeScript |

## Getting started

Use Node.js compatible with Next.js 14 (minimum 18.17) and npm.

On Windows, if PowerShell reports that script execution is disabled, use `npm.cmd` and `npx.cmd` in place of `npm` and `npx` in the commands below.

### 1. Install dependencies

From the repository root:

```bash
npm ci
```

### 2. Configure your environment

Copy `.env.example` to `.env.local`.

**PowerShell:**

```powershell
Copy-Item .env.example .env.local
```

**macOS / Linux:**

```bash
cp .env.example .env.local
```

Set the values described under [Configuration](#configuration).

### 3. Start the website

```bash
npm run dev
```

Open [localhost:3000](http://localhost:3000).

## Configuration

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Base URL used for site metadata and canonical links. Use `http://localhost:3000` locally and your public domain in production. |
| `CONTACT_FORM_ENDPOINT` | Server-side URL that receives contact submissions as JSON via HTTP POST. Required for enquiry delivery. |
| `NEXT_PUBLIC_ANALYTICS_ID` | Reserved in the environment template; setting it alone does not install an analytics integration. |

The contact endpoint must accept `name`, `email`, `message`, `projectType`, `budget`, and `timeline` fields and return a successful HTTP response when accepted. If `CONTACT_FORM_ENDPOINT` is unset, the site still runs, but contact submissions return a setup error and are not delivered.

Keep local environment values in `.env.local`, which is ignored by Git.

## Project structure

```text
app/
  page.tsx             Home page
  about/               Company information
  services/            Service listing and [slug] detail pages
  portfolio/           Project listing and [slug] case studies
  blog/                Article listing and [slug] posts
  contact/             Project enquiry page
  api/contact/         Contact submission API
  privacy/             Privacy policy
  terms/               Terms of service
components/            Shared UI, home sections, and 3D components
lib/                   Site content, metadata, utilities, and hooks
public/                Static assets and brand imagery
next.config.mjs        Next.js configuration and security headers
```

## Development

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run lint` | Run ESLint checks |
| `npx tsc --noEmit` | Check TypeScript types |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |

To preview a production build locally:

```bash
npm run build
npm run start
```

### Updating content

- Edit company details, navigation, services, and portfolio content in [`lib/constants.ts`](lib/constants.ts).
- Edit blog content in [`lib/blog.ts`](lib/blog.ts).
- Update individual pages in [`app/`](app/) and reusable UI in [`components/`](components/).
- Store static assets in [`public/`](public/).

### Deployment

Deploy to a host that supports Next.js server functionality, including the `/api/contact` route. Configure the environment variables on the host before building, using the production domain for `NEXT_PUBLIC_SITE_URL` and a working `CONTACT_FORM_ENDPOINT` for enquiries.

Run lint and build checks before publishing changes. This repository currently has no GitHub Actions CI workflow.
