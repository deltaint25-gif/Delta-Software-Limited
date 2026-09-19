/**
 * Bottom-anchored "scroll to explore" hint (left) and page-counter-style
 * caption (right), matching the reference mockup's editorial footer row.
 * The fuller right-side caption only shows at `sm:` and up — at the
 * narrowest phone widths there isn't room for both halves of the row
 * side by side without an awkward wrap.
 *
 * The hero is `min-h-first-view` (one viewport minus the in-flow sticky
 * navbar), so the section's bottom edge now IS the fold and these offsets
 * measure straight up from it. They used to have to absorb the navbar's
 * height as well, because a `min-h-screen` hero ended ~85-89px past the
 * fold and any small offset landed this row off screen on first paint.
 *
 * Shown only at >=1280 wide AND >=800 tall, not at `xl:` alone. Below that
 * height the hero copy compresses toward the section's bottom edge and this
 * row ran straight into the CTA — 31px of overlap at 1366x640. It is purely
 * decorative (aria-hidden), so on a short screen it yields to the content
 * rather than crowding it.
 */
export default function HeroFooterRow() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-10 z-10 mx-auto hidden w-full max-w-[1200px] items-center justify-between px-5 sm:px-6 lg:px-8 xl:bottom-14 [@media(min-width:1280px)_and_(min-height:800px)]:flex"
      aria-hidden="true"
    >
      <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.15em] text-slate-500">
        <span className="relative flex h-6 w-4 items-start justify-center rounded-full border border-slate-300 pt-1">
          <span className="hero-scroll-dot h-1 w-1 rounded-full bg-slate-500" />
        </span>
        Scroll to explore
      </div>
      <div className="hidden items-center gap-3 text-xs font-medium text-slate-500 sm:flex">
        <span className="text-right leading-tight">Building digital solutions for a smarter tomorrow.</span>
        <span className="h-4 w-px bg-slate-300" />
        <span className="font-display font-bold text-slate-400">01</span>
      </div>
    </div>
  );
}
