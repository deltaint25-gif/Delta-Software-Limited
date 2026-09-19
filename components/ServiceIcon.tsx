export type ServiceIconName =
  | "code"
  | "web"
  | "mobile"
  | "design"
  | "integration"
  | "support"
  | "strategy"
  | "brand";

interface ServiceIconProps {
  name: ServiceIconName;
  className?: string;
}

const ICON_PATHS: Record<ServiceIconName, JSX.Element> = {
  code: (
    <>
      <path d="M9 8l-4 4 4 4" />
      <path d="M15 8l4 4-4 4" />
    </>
  ),
  web: (
    <>
      <rect x="3.5" y="5" width="17" height="14" rx="2" />
      <path d="M3.5 9.5h17" />
      <circle cx="6.5" cy="7.2" r="0.6" fill="currentColor" stroke="none" />
    </>
  ),
  mobile: (
    <>
      <rect x="7.5" y="3" width="9" height="18" rx="2" />
      <path d="M11 18h2" />
    </>
  ),
  design: (
    <>
      <path d="M4 20l4.5-1.2L19 8.3a1.5 1.5 0 000-2.1l-1.2-1.2a1.5 1.5 0 00-2.1 0L5.2 15.5 4 20z" />
      <path d="M14.5 6l3.5 3.5" />
    </>
  ),
  integration: (
    <>
      <rect x="3.5" y="9" width="7" height="6" rx="1.5" />
      <rect x="13.5" y="9" width="7" height="6" rx="1.5" />
      <path d="M10.5 12h3" />
    </>
  ),
  support: (
    <>
      <path d="M12 4a6 6 0 00-6 6v3" />
      <path d="M18 13v-3a6 6 0 00-1.2-3.6" />
      <rect x="4" y="13" width="4" height="5" rx="1.5" />
      <rect x="16" y="13" width="4" height="5" rx="1.5" />
      <path d="M18 18a3 3 0 01-3 3h-2" />
    </>
  ),
  strategy: (
    <>
      <circle cx="12" cy="12" r="7.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  brand: (
    <>
      <rect x="4" y="4" width="9" height="9" rx="2" />
      <rect x="11" y="11" width="9" height="9" rx="2" />
    </>
  ),
};

export default function ServiceIcon({ name, className }: ServiceIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {ICON_PATHS[name]}
    </svg>
  );
}
