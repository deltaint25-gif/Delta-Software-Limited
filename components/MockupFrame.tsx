import DeviceMockup, { type DeviceMockupVariant } from "@/components/DeviceMockup";

/**
 * `ink` fills the frame edge to edge on a fixed-dark canvas — for previews
 * that sit on an already-dark surface (nav mega-menu, showreel).
 *
 * `surface` is the light-theme treatment: a theme-adaptive stage with the
 * device floating inside it. The artwork is drawn 25:14, so any frame that
 * isn't that ratio letterboxes it; insetting the device turns that slack
 * into deliberate matting instead of black bands, and the drop shadow lifts
 * it off the stage.
 */
type MockupTone = "ink" | "surface";

interface MockupFrameProps {
  variant: DeviceMockupVariant;
  className?: string;
  /** Extra classes on the device itself — hover transforms, mostly. */
  deviceClassName?: string;
  tone?: MockupTone;
}

const RADIAL = "bg-[radial-gradient(circle_at_28%_18%,rgba(239,65,54,0.14),transparent_62%)]";

export default function MockupFrame({
  variant,
  className,
  deviceClassName,
  tone = "ink",
}: MockupFrameProps) {
  if (tone === "surface") {
    return (
      <div className={`relative flex items-center justify-center overflow-hidden bg-bg-alt ${className ?? ""}`}>
        <div className={`pointer-events-none absolute inset-0 ${RADIAL}`} aria-hidden="true" />
        <DeviceMockup
          variant={variant}
          className={`relative h-[86%] w-[86%] drop-shadow-[0_18px_40px_rgba(11,11,12,0.22)] ${deviceClassName ?? ""}`}
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${RADIAL} bg-ink ${className ?? ""}`}>
      <DeviceMockup variant={variant} className={`h-full w-full ${deviceClassName ?? ""}`} />
    </div>
  );
}
