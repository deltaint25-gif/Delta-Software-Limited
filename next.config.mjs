/**
 * Security headers.
 *
 * CSP note: `script-src` carries 'unsafe-inline' because the App Router emits
 * inline bootstrap scripts and the layout runs an inline theme-init script to
 * set the colour scheme before first paint. Removing it needs per-request
 * nonces from middleware, which forces every page out of static rendering and
 * off the CDN — a straight trade of load time for a CSP that XSS could still
 * reach through other vectors. The rest of the policy is tight and does real
 * work: object-src/base-uri block injected plugins and <base> hijacking,
 * form-action and connect-src stop exfiltration to another origin, and
 * frame-ancestors blocks framing regardless of X-Frame-Options support.
 */
const isDevelopment = process.env.NODE_ENV === "development";

const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  // Next.js development bundles use eval; keep it disabled in production.
  `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""}`,
  isDevelopment ? "connect-src 'self' ws://localhost:* ws://127.0.0.1:*" : "connect-src 'self'",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  ...(isDevelopment ? [] : ["upgrade-insecure-requests"]),
].join("; ");

// Browser features this site never uses. Denying them means an injected
// script can't quietly reach for the camera, mic or location either.
const PERMISSIONS_POLICY = [
  "accelerometer=()",
  "autoplay=()",
  "camera=()",
  "display-capture=()",
  "encrypted-media=()",
  "fullscreen=(self)",
  "geolocation=()",
  "gyroscope=()",
  "magnetometer=()",
  "microphone=()",
  "midi=()",
  "payment=()",
  "usb=()",
  "xr-spatial-tracking=()",
  "browsing-topics=()",
  "interest-cohort=()",
].join(", ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CSP },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: PERMISSIONS_POLICY },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  // Vercel already sends HSTS; declaring it here keeps the guarantee in the
  // repo rather than in a dashboard setting nobody can see from the code.
  ...(isDevelopment ? [] : [
    { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  ]),
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep production builds from overwriting a running dev server's assets.
  distDir: isDevelopment ? ".next-dev" : ".next",
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
};

export default nextConfig;
