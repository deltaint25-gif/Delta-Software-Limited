"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { NAV_LINKS, SERVICE_GROUPS, SERVICE_DETAILS, PROJECTS } from "@/lib/constants";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import ServiceIcon, { type ServiceIconName } from "@/components/ServiceIcon";
import MockupFrame from "@/components/MockupFrame";
import MobileMenu from "@/components/MobileMenu";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { useTilt } from "@/lib/use-tilt";
import { useLiquidGlow } from "@/lib/use-liquid-glow";
import { useScrollDirection } from "@/lib/use-scroll-direction";

const FEATURED_PROJECT = PROJECTS[1];

const MEGA_EASE = [0.16, 1, 0.3, 1] as const;

function useLocalClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    function update() {
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Dhaka",
        }).format(new Date())
      );
    }
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, []);

  return time;
}

interface MegaMenuRowProps {
  title: string;
  slug: string;
  description?: string;
  icon: ServiceIconName;
  onActivate: () => void;
  onDeactivate: () => void;
}

function MegaMenuRow({ title, slug, description, icon, onActivate, onDeactivate }: MegaMenuRowProps) {
  const { ref: glowRef, handlePointerMove } = useLiquidGlow<HTMLAnchorElement>();
  const tiltRef = useTilt<HTMLAnchorElement>(3);

  function setRefs(node: HTMLAnchorElement | null) {
    (glowRef as React.MutableRefObject<HTMLAnchorElement | null>).current = node;
    (tiltRef as React.MutableRefObject<HTMLAnchorElement | null>).current = node;
  }

  return (
    <Link
      ref={setRefs}
      href={`/services/${slug}`}
      data-cursor="service"
      data-mega-item
      onPointerMove={handlePointerMove}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onMouseLeave={onDeactivate}
      className="group liquid-glow relative flex items-start gap-3 overflow-hidden rounded-md px-3 py-2.5 text-left transition-all duration-300 ease-out hover:-translate-y-0.5 focus-visible:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
    >
      <span
        className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-accent-red/15 text-accent-red transition-transform duration-300 ease-out group-hover:scale-110 group-hover:rotate-3"
        aria-hidden="true"
      >
        <ServiceIcon name={icon} className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="block font-display text-sm font-semibold text-fg">{title}</span>
          <ArrowRight
            className="h-3 w-3 flex-shrink-0 text-accent-red opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0.5 group-hover:opacity-100"
            aria-hidden="true"
          />
        </span>
        {description && (
          <span className="mt-0.5 block text-xs leading-snug text-muted transition-colors duration-300 group-hover:text-fg">
            {description}
          </span>
        )}
      </span>
    </Link>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [focusFirstOnOpen, setFocusFirstOnOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const pathname = usePathname();
  const time = useLocalClock();
  const reducedMotion = usePrefersReducedMotion();
  const scrollDirection = useScrollDirection();
  const shrink = scrollDirection === "down" && !isOpen && !megaOpen;

  useEffect(() => {
    setIsOpen(false);
    setMegaOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        if (megaOpen) {
          setMegaOpen(false);
          triggerRef.current?.focus();
        }
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [megaOpen]);

  useEffect(() => {
    if (megaOpen && focusFirstOnOpen) {
      const first = panelRef.current?.querySelector<HTMLElement>("[data-mega-item]");
      first?.focus();
      setFocusFirstOnOpen(false);
    }
  }, [megaOpen, focusFirstOnOpen]);

  function handleHeaderBlur(event: React.FocusEvent<HTMLElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setMegaOpen(false);
    }
  }

  const openMega = () => {
    clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };
  const scheduleCloseMega = () => {
    closeTimer.current = setTimeout(() => setMegaOpen(false), 150);
  };

  function handleTriggerKeyDown(event: React.KeyboardEvent<HTMLAnchorElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setFocusFirstOnOpen(true);
      openMega();
    }
  }

  function handlePanelKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    const items = Array.from(panelRef.current?.querySelectorAll<HTMLElement>("[data-mega-item]") ?? []);
    if (items.length === 0) return;
    const currentIndex = items.indexOf(document.activeElement as HTMLElement);
    event.preventDefault();
    const nextIndex =
      event.key === "ArrowDown"
        ? (currentIndex + 1 + items.length) % items.length
        : (currentIndex - 1 + items.length) % items.length;
    items[nextIndex]?.focus();
  }

  const activeService = SERVICE_DETAILS.find((service) => service.slug === hoveredSlug);
  const previewTitle = activeService?.title ?? FEATURED_PROJECT.name;
  const previewDescription = activeService?.description ?? FEATURED_PROJECT.summary;
  const previewVariant = activeService?.previewVariant ?? FEATURED_PROJECT.variant;
  const previewHref = activeService ? `/services/${activeService.slug}` : `/portfolio/${FEATURED_PROJECT.slug}`;
  const previewEyebrow = activeService ? "Preview" : "Case study";

  return (
    <>
      <header
        onMouseLeave={scheduleCloseMega}
        onBlur={handleHeaderBlur}
        className="sticky top-0 z-50 border-b border-line bg-[var(--nav-bg)] backdrop-blur transition-shadow duration-300"
      >
        <nav
          className={`mx-auto flex max-w-6xl items-center justify-between px-4 transition-[padding] duration-300 ease-out sm:px-6 lg:px-8 ${
            shrink ? "py-3" : "py-5"
          }`}
        >
          <Link href="/" aria-label="Delta Software Limited home" data-cursor-hover>
            <Logo />
          </Link>

          <ul className="hidden items-center gap-2 lg:flex">
            {NAV_LINKS.map((link) => {
              const isServices = link.label === "Services";
              const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);

              if (isServices) {
                return (
                  <li key={link.href} onMouseEnter={openMega} className="relative">
                    <Link
                      ref={triggerRef}
                      href={link.href}
                      data-cursor-hover
                      aria-expanded={megaOpen}
                      aria-haspopup="true"
                      aria-controls="services-mega-menu"
                      aria-current={isActive ? "page" : undefined}
                      onFocus={openMega}
                      onKeyDown={handleTriggerKeyDown}
                      className={`link-underline flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                        isActive ? "text-fg" : "text-muted hover:text-fg"
                      }`}
                    >
                      {link.label}
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform duration-200 ${
                          megaOpen ? "rotate-180" : ""
                        }`}
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                );
              }

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    data-cursor-hover
                    aria-current={isActive ? "page" : undefined}
                    className={`link-underline block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      isActive ? "text-fg" : "text-muted hover:text-fg"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="hidden items-center gap-4 lg:flex">
            {time && (
              <span className="font-mono text-xs text-muted" suppressHydrationWarning>
                Dhaka &middot; {time}
              </span>
            )}
            <ThemeToggle />
            <Link href="/contact" data-cursor-hover className="btn-pill-primary">
              Contact Us
            </Link>
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <ThemeToggle />
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-md border border-line text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
              onClick={() => setIsOpen((prev) => !prev)}
            >
              <span className="sr-only">Toggle menu</span>
              {isOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {/* Services mega-menu (desktop only) */}
        <AnimatePresence>
          {megaOpen && (
            <motion.div
              id="services-mega-menu"
              ref={panelRef}
              role="region"
              aria-label="Services menu"
              onMouseEnter={openMega}
              onKeyDown={handlePanelKeyDown}
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 20, filter: "blur(12px)" }}
              animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 20, filter: "blur(12px)" }}
              transition={{ duration: reducedMotion ? 0.15 : 0.45, ease: MEGA_EASE }}
              className="absolute inset-x-0 top-full hidden border-b border-line bg-surface shadow-[0_24px_48px_-24px_rgba(11,11,12,0.25)] lg:block dark:shadow-[0_24px_48px_-20px_rgba(0,0,0,0.6)]"
            >
              <div
                onMouseLeave={() => setHoveredSlug(null)}
                className="mx-auto grid max-w-6xl grid-cols-[1fr_1fr_260px] gap-10 px-4 py-10 sm:px-6 lg:px-8"
              >
                {SERVICE_GROUPS.map((group) => (
                  <div key={group.title}>
                    <p className="eyebrow">{group.title}</p>
                    <div className="mt-4 flex flex-col gap-1">
                      {group.services.map((title) => {
                        const detail = SERVICE_DETAILS.find((service) => service.title === title);
                        if (!detail) return null;
                        return (
                          <MegaMenuRow
                            key={title}
                            title={title}
                            slug={detail.slug}
                            description={detail.description}
                            icon={detail.icon}
                            onActivate={() => setHoveredSlug(detail.slug)}
                            onDeactivate={() => setHoveredSlug(null)}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}

                <Link
                  href={previewHref}
                  data-cursor="project"
                  data-mega-item
                  className="group flex flex-col rounded-md border border-line bg-bg p-5 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-accent-red/30 hover:shadow-glow-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                >
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={`eyebrow-${previewEyebrow}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="eyebrow"
                    >
                      {previewEyebrow}
                    </motion.p>
                  </AnimatePresence>
                  <div className="relative mt-4 h-24 overflow-hidden rounded-md border border-line-dark">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={previewVariant + previewHref}
                        initial={{ opacity: 0, scale: 1.08 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.3, ease: MEGA_EASE }}
                        className="absolute inset-0"
                      >
                        <MockupFrame variant={previewVariant} className="h-full w-full" />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={previewTitle}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.25, ease: MEGA_EASE }}
                    >
                      <p className="mt-4 font-display text-base font-bold text-fg">{previewTitle}</p>
                      <p className="mt-1.5 text-xs leading-relaxed text-muted">{previewDescription}</p>
                    </motion.div>
                  </AnimatePresence>
                  <span className="link-underline mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-fg">
                    {activeService ? "Explore service" : "View case study"}
                    <ArrowRight
                      className="h-3 w-3 transition-transform duration-300 ease-out group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} pathname={pathname} />
    </>
  );
}
