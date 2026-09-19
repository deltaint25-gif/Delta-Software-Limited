"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown, X } from "lucide-react";
import { LogoMark } from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import ServiceIcon from "@/components/ServiceIcon";
import SocialIcon from "@/components/SocialIcon";
import MagneticButton from "@/components/MagneticButton";
import { NAV_LINKS, SERVICE_GROUPS, SERVICE_DETAILS, SOCIAL_LINKS } from "@/lib/constants";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { useLiquidGlow } from "@/lib/use-liquid-glow";

const EASE = [0.16, 1, 0.3, 1] as const;

const NAV_SUBTITLES: Record<string, string> = {
  "/": "Welcome to Delta",
  "/services": "What we offer",
  "/about": "Our story",
  "/portfolio": "Our portfolio",
  "/blog": "Ideas & insights",
};

const SOCIAL_ICONS: Record<string, "linkedin" | "x" | "instagram" | "facebook"> = {
  LinkedIn: "linkedin",
  "X (Twitter)": "x",
  Instagram: "instagram",
  Facebook: "facebook",
};

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  pathname: string;
}

export default function MobileMenu({ isOpen, onClose, pathname }: MobileMenuProps) {
  const [servicesOpen, setServicesOpen] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const { ref: ctaGlowRef, handlePointerMove: handleCtaPointerMove } = useLiquidGlow<HTMLAnchorElement>();

  useEffect(() => {
    if (!isOpen) setServicesOpen(false);
  }, [isOpen]);

  const items = NAV_LINKS.filter((link) => link.href !== "/contact");

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.15 : 0.3, ease: EASE }}
          className="fixed inset-0 z-[60] flex flex-col overflow-hidden bg-bg lg:hidden"
        >
          {/* Decorative background layer */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <div
              className="absolute -top-1/3 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full blur-[120px]"
              style={{
                background:
                  "radial-gradient(circle, rgba(239,65,54,0.14) 0%, rgba(239,65,54,0.04) 45%, transparent 75%)",
              }}
            />
            <svg className="absolute inset-0 h-full w-full opacity-[0.02] mix-blend-multiply">
              <filter id="mobile-menu-grain">
                <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} stitchTiles="stitch" />
              </filter>
              <rect width="100%" height="100%" filter="url(#mobile-menu-grain)" />
            </svg>

            <div className="absolute -bottom-20 -right-16 h-72 w-72">
              <div className="absolute inset-4 rounded-full bg-accent-red/15 blur-[70px]" />
              <span
                className="mobile-menu-orbit absolute inset-0 rounded-full border border-accent-red/20"
                style={{ transform: "scale(1.15)" }}
              />
              <span className="absolute right-6 top-2 h-2 w-2 rounded-full bg-accent-red shadow-glow-red" />
              <span className="absolute bottom-10 left-0 h-1.5 w-1.5 rounded-full bg-accent-red/70" />
              <LogoMark className="relative h-full w-full text-accent-red/[0.14]" />
            </div>
          </div>

          {/* Header row */}
          <div
            className="relative flex flex-shrink-0 items-center justify-between px-6 pb-2"
            style={{ paddingTop: "max(1.25rem, env(safe-area-inset-top))" }}
          >
            <div>
              <span className="inline-flex items-center gap-2">
                <LogoMark className="h-8 w-8 flex-shrink-0 text-fg" />
                <span className="font-display text-xl font-bold tracking-tight text-fg">DELTA</span>
              </span>
              <p className="mt-0.5 pl-10 text-[10px] font-semibold uppercase tracking-[0.25em] text-muted">
                Software Limited
              </p>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle className="rounded-full" />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="group flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-line text-fg transition-all duration-200 hover:border-accent-red/40 hover:shadow-glow-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                <X className="h-4 w-4 transition-transform duration-300 ease-out group-hover:rotate-90" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <motion.nav
            variants={reducedMotion ? undefined : listVariants}
            initial={reducedMotion ? undefined : "hidden"}
            animate={reducedMotion ? undefined : "visible"}
            className="relative mt-4 flex-1 overflow-y-auto px-6"
          >
            <ul className="flex flex-col gap-1">
              {items.map((link, index) => {
                const isServices = link.label === "Services";
                const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                const subtitle = NAV_SUBTITLES[link.href];

                if (isServices) {
                  return (
                    <motion.li key={link.href} variants={reducedMotion ? undefined : itemVariants}>
                      <button
                        type="button"
                        onClick={() => setServicesOpen((prev) => !prev)}
                        aria-expanded={servicesOpen}
                        aria-controls="mobile-services-panel"
                        className="group relative flex w-full items-center gap-4 rounded-2xl px-4 py-3.5 text-left transition-colors duration-200 hover:bg-fill-soft"
                      >
                        <span className="font-mono text-xs tabular-nums text-muted">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-display text-[1.75rem] font-bold leading-tight tracking-tight text-fg">
                            {link.label}
                          </span>
                          {subtitle && <span className="block text-xs text-muted">{subtitle}</span>}
                        </span>
                        <ChevronDown
                          className={`h-5 w-5 flex-shrink-0 text-muted transition-transform duration-300 ${
                            servicesOpen ? "rotate-180" : ""
                          }`}
                          aria-hidden="true"
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {servicesOpen && (
                          <motion.div
                            id="mobile-services-panel"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: reducedMotion ? 0.15 : 0.35, ease: EASE }}
                            className="overflow-hidden"
                          >
                            <div className="flex flex-col gap-5 py-2 pl-[3.25rem] pr-2">
                              {SERVICE_GROUPS.map((group) => (
                                <div key={group.title}>
                                  <p className="eyebrow">{group.title}</p>
                                  <div className="mt-2 flex flex-col divide-y divide-line">
                                    {group.services.map((title) => {
                                      const detail = SERVICE_DETAILS.find(
                                        (service) => service.title === title
                                      );
                                      if (!detail) return null;
                                      return (
                                        <Link
                                          key={title}
                                          href={`/services/${detail.slug}`}
                                          data-cursor-hover
                                          className="group/row flex items-center gap-3 py-3 text-base font-medium leading-snug text-fg transition-colors active:bg-fill-soft"
                                        >
                                          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-accent-red/15 text-accent-red">
                                            <ServiceIcon name={detail.icon} className="h-4 w-4" />
                                          </span>
                                          <span className="min-w-0 flex-1">{title}</span>
                                          <ArrowRight
                                            className="h-3.5 w-3.5 flex-shrink-0 text-muted transition-transform duration-300 ease-out group-active/row:translate-x-0.5"
                                            aria-hidden="true"
                                          />
                                        </Link>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.li>
                  );
                }

                return (
                  <motion.li key={link.href} variants={reducedMotion ? undefined : itemVariants}>
                    <Link
                      href={link.href}
                      aria-current={isActive ? "page" : undefined}
                      className={`group relative flex items-center gap-4 rounded-2xl px-4 py-3.5 transition-colors duration-200 ${
                        isActive ? "bg-accent-red/[0.07] ring-1 ring-inset ring-accent-red/25" : "hover:bg-fill-soft"
                      }`}
                    >
                      {isActive && (
                        <span
                          className="absolute inset-y-3 left-1.5 w-0.5 rounded-full bg-accent-red"
                          aria-hidden="true"
                        />
                      )}
                      <span className={`font-mono text-xs tabular-nums ${isActive ? "text-accent-red" : "text-muted"}`}>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={`block font-display text-[1.75rem] font-bold leading-tight tracking-tight transition-transform duration-300 ease-out group-hover:translate-x-1 ${
                            isActive ? "text-accent-red" : "text-fg"
                          }`}
                        >
                          {link.label}
                        </span>
                        {subtitle && <span className="block text-xs text-muted">{subtitle}</span>}
                      </span>
                      <ArrowRight
                        className={`h-4 w-4 flex-shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1 ${
                          isActive ? "text-accent-red" : "text-muted"
                        }`}
                        aria-hidden="true"
                      />
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </motion.nav>

          {/* Connect + CTA + footer */}
          <div
            className="relative flex-shrink-0 px-6 pt-4"
            style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
          >
            <div className="flex items-center gap-2">
              <span className="h-px w-6 flex-shrink-0 bg-accent-red" aria-hidden="true" />
              <p className="eyebrow">Connect</p>
            </div>
            <div className="mt-4 flex gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-line text-fg transition-all duration-200 hover:border-accent-red/40 hover:text-accent-red hover:shadow-glow-red"
                >
                  <SocialIcon name={SOCIAL_ICONS[social.label]} className="h-4 w-4" />
                </a>
              ))}
            </div>

            <MagneticButton className="mt-6 block w-full">
              <Link
                ref={ctaGlowRef}
                href="/contact"
                data-cursor-hover
                onPointerMove={handleCtaPointerMove}
                className="liquid-glow-light relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-pill bg-ink px-7 py-4 text-sm font-semibold text-white transition-transform active:scale-[0.98]"
              >
                Start a Conversation
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </MagneticButton>

            <p className="mt-5 text-center text-[11px] uppercase tracking-[0.2em] text-muted">
              Build &middot; Innovate &middot; Grow
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
