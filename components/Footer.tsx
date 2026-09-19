"use client";

import Link from "next/link";
import { useRef, useState, type ComponentType, type PointerEvent as ReactPointerEvent } from "react";
import { ArrowRight, ArrowUp, ChevronRight, Mail, Phone, Plus } from "lucide-react";
import MagneticButton from "@/components/MagneticButton";
import SocialIcon from "@/components/SocialIcon";
import DeltaHeroObject from "@/components/three/DeltaHeroObject";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  SERVICE_DETAILS,
  SITE_NAME,
  SOCIAL_LINKS,
} from "@/lib/constants";
import { lenisInstance } from "@/lib/lenis-instance";
import { useLiquidGlow } from "@/lib/use-liquid-glow";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { useInView } from "@/lib/use-in-view";

const SOCIAL_ICONS: Record<string, "linkedin" | "x" | "instagram" | "facebook"> = {
  LinkedIn: "linkedin",
  "X (Twitter)": "x",
  Instagram: "instagram",
  Facebook: "facebook",
};

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/portfolio", label: "Work" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

// "Our Story"/"Our Mission"/"Our Vision"/"Careers" aren't separate pages on
// this site (only a single /about page exists) — rather than invent routes
// that don't go anywhere, all four point at the real /about page. Privacy
// Policy is the one real distinct destination in this column.
const ABOUT_LINKS = [
  { href: "/about", label: "Our Story" },
  { href: "/about", label: "Our Mission" },
  { href: "/about", label: "Our Vision" },
  { href: "/about", label: "Careers" },
  { href: "/privacy", label: "Privacy Policy" },
];

function scrollToTop() {
  if (lenisInstance.current) {
    lenisInstance.current.scrollTo(0, { duration: 1.2 });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

/**
 * The signature 3D Delta "D" (same object/scene as the hero) as the
 * footer's dominant background brand element, replacing the old giant
 * "DELTA." text wordmark. Lazy-mounts only once scrolled into view (this
 * sits far below the hero in every page, so the two WebGL canvases never
 * actually run at once) and only tracks pointer parallax on fine-pointer
 * devices, matching the same restraint already used for the hero's copy.
 */
function FooterDeltaGlyph() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const reducedMotion = usePrefersReducedMotion();
  const inView = useInView(wrapRef, 0.1);

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (reducedMotion) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const relX = (event.clientX - rect.left) / rect.width - 0.5;
    const relY = (event.clientY - rect.top) / rect.height - 0.5;
    setOffset({ x: relX * 14, y: relY * 14 });
  }

  function handlePointerLeave() {
    setOffset({ x: 0, y: 0 });
  }

  return (
    <div
      ref={wrapRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="pointer-events-none absolute -right-10 bottom-0 h-64 w-64 opacity-50 sm:h-80 sm:w-80 sm:opacity-70 lg:pointer-events-auto lg:right-0 lg:top-1/2 lg:h-[28rem] lg:w-[28rem] lg:-translate-y-1/2 lg:opacity-100"
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 rounded-full blur-[90px]"
        style={{
          background: "radial-gradient(circle, rgba(239,65,54,0.22) 0%, rgba(239,65,54,0.08) 45%, transparent 75%)",
        }}
      />
      {inView && (
        <DeltaHeroObject
          className="absolute inset-0 h-full w-full"
          parallaxX={reducedMotion ? 0 : offset.x}
          parallaxY={reducedMotion ? 0 : offset.y}
        />
      )}
    </div>
  );
}

interface FooterContactCardProps {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href: string;
}

function FooterContactCard({ icon: Icon, label, value, href }: FooterContactCardProps) {
  return (
    <a
      href={href}
      data-cursor-hover
      className="group flex w-full items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3.5 backdrop-blur-xl transition-all duration-200 hover:border-accent-red/40 hover:shadow-glow-red sm:w-80"
    >
      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-accent-red/15 text-accent-red">
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-white/60">{label}</span>
        <span className="block break-all text-sm font-medium text-white">{value}</span>
      </span>
      <ChevronRight
        className="mt-1 h-4 w-4 flex-shrink-0 text-white/30 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-accent-red"
        aria-hidden="true"
      />
    </a>
  );
}

interface FooterColumnProps {
  label: string;
  children: React.ReactNode;
}

/**
 * Services/Quick Links/About collapse into a "+"-toggled accordion row on
 * mobile (matching the reference layout) but are always fully expanded at
 * `lg:` and up — the `lg:!` overrides force that regardless of the local
 * open/closed state, so the same markup serves both breakpoints without a
 * separate desktop/mobile render path.
 */
function FooterColumn({ label, children }: FooterColumnProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="group border-b border-line-dark pb-4 lg:border-0 lg:pb-0">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex min-h-[44px] w-full items-center justify-between gap-2 py-2 text-left lg:min-h-0 lg:cursor-default lg:py-0"
      >
        <span className="flex items-center gap-2">
          <span className="h-px w-6 flex-shrink-0 bg-accent-red transition-all duration-300 group-hover:w-10" aria-hidden="true" />
          <span className="eyebrow text-white/60">{label}</span>
        </span>
        <Plus
          className={`h-4 w-4 flex-shrink-0 text-white/60 transition-transform duration-300 lg:hidden ${open ? "rotate-45" : ""}`}
          aria-hidden="true"
        />
      </button>
      <div
        className={`grid overflow-hidden transition-all duration-300 lg:!mt-4 lg:!grid-rows-[1fr] lg:!opacity-100 ${
          open ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden lg:overflow-visible">{children}</div>
      </div>
    </div>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();
  const { ref: glowRef, handlePointerMove } = useLiquidGlow<HTMLAnchorElement>();

  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <svg className="absolute inset-0 h-full w-full">
          <defs>
            <pattern id="footer-grid" width="64" height="64" patternUnits="userSpaceOnUse" patternTransform="rotate(20)">
              <path d="M 64 0 L 0 0 0 64" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
            </pattern>
            <linearGradient id="footer-grid-fade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity="0.9" />
              <stop offset="70%" stopColor="white" stopOpacity="0.25" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <mask id="footer-grid-mask">
              <rect width="100%" height="100%" fill="url(#footer-grid-fade)" />
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="url(#footer-grid)" mask="url(#footer-grid-mask)" />
        </svg>
        <div
          className="absolute -top-1/4 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full blur-[130px]"
          style={{
            background: "radial-gradient(circle, rgba(239,65,54,0.12) 0%, rgba(239,65,54,0.03) 45%, transparent 75%)",
          }}
        />
        <svg className="absolute inset-0 h-full w-full opacity-[0.05] mix-blend-overlay">
          <filter id="footer-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#footer-grain)" />
        </svg>
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 30% 30%, transparent 45%, rgba(0,0,0,0.35) 100%)" }}
        />
      </div>

      <FooterDeltaGlyph />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 border-b border-line-dark pb-12 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
          <div className="max-w-xl">
            <h2 className="text-h2">
              Let&apos;s build something <span className="text-accent-red">extraordinary.</span>
            </h2>
            <p className="mt-3 max-w-md text-sm text-white/60">
              Tell us about your project and we&apos;ll get back to you with one of our experts —
              within 24 hours.
            </p>
            <MagneticButton className="mt-7 inline-block">
              <Link
                ref={glowRef}
                href="/contact"
                data-cursor-hover
                onPointerMove={handlePointerMove}
                className="liquid-glow-light group relative inline-flex items-center gap-2 overflow-hidden rounded-pill border border-accent-red/40 bg-white/[0.03] px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-accent-red hover:shadow-glow-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-red focus-visible:ring-offset-2 focus-visible:ring-offset-ink active:scale-[0.97]"
              >
                <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                Start a Project
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </MagneticButton>
          </div>

          <div className="flex flex-col gap-3">
            <FooterContactCard icon={Phone} label="Call us" value={CONTACT_PHONE} href={`tel:${CONTACT_PHONE.replace(/[^\d+]/g, "")}`} />
            <FooterContactCard icon={Mail} label="Email us" value={CONTACT_EMAIL} href={`mailto:${CONTACT_EMAIL}`} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-10 gap-y-2 border-b border-line-dark py-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-y-0">
          <FooterColumn label="Services">
            <ul className="space-y-0 lg:space-y-3">
              {SERVICE_DETAILS.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="link-underline-dark flex min-h-[44px] items-center text-sm text-white/70 hover:text-white lg:min-h-0"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterColumn>

          <FooterColumn label="Quick Links">
            <ul className="space-y-0 lg:space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="link-underline-dark flex min-h-[44px] items-center text-sm text-white/70 hover:text-white lg:min-h-0">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterColumn>

          <FooterColumn label="About">
            <ul className="space-y-0 lg:space-y-3">
              {ABOUT_LINKS.map((link, index) => (
                <li key={`${link.href}-${link.label}-${index}`}>
                  <Link href={link.href} className="link-underline-dark flex min-h-[44px] items-center text-sm text-white/70 hover:text-white lg:min-h-0">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterColumn>

          <div className="group">
            <div className="flex items-center gap-2">
              <span className="h-px w-6 flex-shrink-0 bg-accent-red transition-all duration-300 group-hover:w-10" aria-hidden="true" />
              <p className="eyebrow text-white/60">Connect</p>
            </div>
            <div className="mt-4 flex gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/70 backdrop-blur-xl transition-all duration-200 hover:scale-105 hover:border-accent-red/40 hover:text-accent-red hover:shadow-glow-red"
                >
                  <SocialIcon name={SOCIAL_ICONS[social.label]} className="h-4 w-4" />
                </a>
              ))}
            </div>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="link-underline-dark mt-2 flex min-h-[44px] items-center break-all text-sm text-white/70 hover:text-white lg:mt-4 lg:min-h-0"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-6 pt-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
            <p>&copy; {year} {SITE_NAME}. All rights reserved.</p>
            <p>Based in Dhaka, Bangladesh &middot; working with clients globally.</p>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="link-underline-dark inline-flex min-h-[44px] items-center hover:text-white lg:min-h-0">
              Privacy Policy
            </Link>
            <Link href="/terms" className="link-underline-dark inline-flex min-h-[44px] items-center hover:text-white lg:min-h-0">
              Terms &amp; Conditions
            </Link>
            <button
              type="button"
              onClick={scrollToTop}
              data-cursor-hover
              aria-label="Back to top"
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-line-dark text-white lg:h-9 lg:w-9 transition-all duration-200 hover:border-accent-red/40 hover:shadow-glow-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
