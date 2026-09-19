export const SITE_NAME = "Delta Software Limited";

function resolveSiteUrl(): string {
  const fallback = "https://deltasoftwarelimited.com";
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (!configured) return fallback;
  try {
    const parsed = new URL(configured);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return fallback;
    return parsed.toString().replace(/\/$/, "");
  } catch {
    return fallback;
  }
}

export const SITE_URL = resolveSiteUrl();

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/portfolio", label: "Work" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const;

export const CONTACT_EMAIL = "hello@deltasoftwarelimited.com";
export const CONTACT_PHONE = "+880 1XXX-XXXXXX";
export const CONTACT_ADDRESS = "Dhaka, Bangladesh";

export const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "#" },
  { label: "X (Twitter)", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "Facebook", href: "#" },
] as const;

export const SERVICE_GROUPS = [
  {
    title: "Product & Engineering",
    services: ["Custom Software Development", "Web App Development", "Mobile App Development", "API & Systems Integration"],
  },
  {
    title: "Design & Strategy",
    services: ["UI/UX Design", "Product Strategy", "Brand Identity", "Maintenance & Support"],
  },
] as const;

export const SERVICES = SERVICE_GROUPS.flatMap((group) => group.services);

export const SERVICE_DETAILS = [
  {
    title: "Custom Software Development",
    slug: "custom-software-development",
    description: "End-to-end design and development of software tailored to your team's workflows.",
    icon: "code",
    previewVariant: "dashboard",
    capabilities: [
      "Requirements discovery and technical scoping before any code is written",
      "Custom architecture designed around your team's existing workflows",
      "Iterative delivery with regular demos, not a single big reveal at the end",
      "Documentation and handover so your team can maintain it long-term",
    ],
  },
  {
    title: "Web App Development",
    slug: "web-app-development",
    description: "Modern, responsive web apps built with performance and accessibility in mind.",
    icon: "web",
    previewVariant: "dashboard",
    capabilities: [
      "Responsive, accessible interfaces that work across devices and browsers",
      "Performance budgets enforced from the first sprint, not bolted on later",
      "SEO-friendly rendering with Next.js and modern frontend tooling",
      "Analytics and monitoring wired in from day one",
    ],
  },
  {
    title: "Mobile App Development",
    slug: "mobile-app-development",
    description: "Native and cross-platform mobile apps for iOS and Android.",
    icon: "mobile",
    previewVariant: "mobile",
    capabilities: [
      "Native iOS and Android, or cross-platform where it fits the budget",
      "Offline-friendly data sync for spotty connections",
      "App store submission and release management",
      "Push notifications, deep linking, and analytics integration",
    ],
  },
  {
    title: "API & Systems Integration",
    slug: "api-systems-integration",
    description: "Connecting your tools and data sources into one reliable system.",
    icon: "integration",
    previewVariant: "analytics",
    capabilities: [
      "Connecting existing tools instead of forcing a rip-and-replace",
      "REST and GraphQL APIs designed around your actual data model",
      "Secure authentication and rate-limited access for third parties",
      "Migration plans that keep your systems running during the switch",
    ],
  },
  {
    title: "UI/UX Design",
    slug: "ui-ux-design",
    description: "User-centered design that turns complex workflows into simple interfaces.",
    icon: "design",
    previewVariant: "storefront",
    capabilities: [
      "User research and journey mapping before any pixels are drawn",
      "Wireframes and interactive prototypes for early validation",
      "A reusable design system, not a one-off set of screens",
      "Usability testing with real users before you ship",
    ],
  },
  {
    title: "Product Strategy",
    slug: "product-strategy",
    description: "Translating business goals into a clear, sequenced product roadmap.",
    icon: "strategy",
    previewVariant: "analytics",
    capabilities: [
      "Market and competitor context to sharpen where you differentiate",
      "A prioritized roadmap your team can actually execute against",
      "Scope and budget guidance before you commit to building",
      "Ongoing advisory as priorities shift after launch",
    ],
  },
  {
    title: "Brand Identity",
    slug: "brand-identity",
    description: "Visual identity and design systems that give your product a consistent voice.",
    icon: "brand",
    previewVariant: "storefront",
    capabilities: [
      "Logo, color, and typography systems built to scale across products",
      "Brand guidelines your team and future vendors can follow",
      "Consistent visual language across web, mobile, and marketing",
      "Design assets delivered in developer-ready formats",
    ],
  },
  {
    title: "Maintenance & Support",
    slug: "maintenance-support",
    description: "Ongoing updates, monitoring, and support to keep your product running smoothly.",
    icon: "support",
    previewVariant: "dashboard",
    capabilities: [
      "Proactive monitoring so issues get caught before users notice",
      "Regular dependency and security updates",
      "Agreed response times for bugs and incidents",
      "A direct line to the team that actually built your product",
    ],
  },
] as const;

export const PROCESS_STEPS = [
  { number: "01", title: "Discover", description: "We dig into your goals, users, and constraints before writing a single line of code." },
  { number: "02", title: "Design", description: "Wireframes and prototypes that turn requirements into a clear, testable plan." },
  { number: "03", title: "Build", description: "Iterative development with regular check-ins, so there are no surprises at launch." },
  { number: "04", title: "Launch & Support", description: "We ship, monitor, and keep improving the product after it's in your users' hands." },
] as const;

export const TECH_CATEGORIES = ["Frontend", "Backend", "Mobile", "Database", "Cloud", "DevOps"] as const;

export const TECH_STACK = [
  { name: "React", category: "Frontend" },
  { name: "Next.js", category: "Frontend" },
  { name: "TypeScript", category: "Frontend" },
  { name: "Tailwind CSS", category: "Frontend" },
  { name: "React Native", category: "Mobile" },
  { name: "Swift", category: "Mobile" },
  { name: "Kotlin", category: "Mobile" },
  { name: "Node.js", category: "Backend" },
  { name: "Python", category: "Backend" },
  { name: "REST APIs", category: "Backend" },
  { name: "GraphQL", category: "Backend" },
  { name: "PostgreSQL", category: "Database" },
  { name: "MongoDB", category: "Database" },
  { name: "MySQL", category: "Database" },
  { name: "AWS", category: "Cloud" },
  { name: "Docker", category: "DevOps" },
  { name: "GitHub Actions", category: "DevOps" },
] as const;

export const ENGINEERING_CAPABILITIES = [
  "Frontend",
  "Backend",
  "Mobile",
  "Cloud",
  "Database",
  "DevOps",
  "Security",
  "AI & Automation",
  "Integrations",
] as const;

export const ENGINEERING_PIPELINE = [
  "Idea",
  "Strategy",
  "UX",
  "Design",
  "Engineering",
  "Testing",
  "Deployment",
  "Scale",
] as const;

export const INDUSTRIES = [
  { name: "Retail", relatedSlug: "retail-inventory-platform" },
  { name: "Healthcare", relatedSlug: "healthcare-booking-app" },
  { name: "Logistics", relatedSlug: "logistics-dashboard" },
  { name: "E-commerce", relatedSlug: "ecommerce-storefront" },
  { name: "Startups", relatedSlug: null },
  { name: "SMEs", relatedSlug: null },
] as const;

export const TRUST_CAPABILITIES = [
  {
    title: "Secure architecture",
    description: "Systems designed with authentication, authorization, and data protection built in from day one, not bolted on after launch.",
  },
  {
    title: "Cloud infrastructure",
    description: "Deployed on infrastructure that scales with usage, with monitoring in place so we know about problems before your users do.",
  },
  {
    title: "Testing & QA",
    description: "Automated and manual testing built into the development process, so regressions get caught before they ship.",
  },
  {
    title: "Backups & recovery",
    description: "Regular, verified backups and a documented recovery plan for every production system we run.",
  },
] as const;

export const STATS = [
  { value: "10+", label: "Projects delivered" },
  { value: "100%", label: "Client-focused approach" },
  { value: String(INDUSTRIES.length), label: "Industries served" },
  { value: "24/7", label: "Support availability" },
] as const;

export const PROJECTS = [
  {
    name: "Retail Inventory Platform",
    slug: "retail-inventory-platform",
    summary: "A real-time inventory and order management system for a multi-location retailer.",
    tags: ["Web App", "Retail", "Dashboard"],
    variant: "dashboard",
    challenge:
      "Stock counts were kept in three disconnected spreadsheets across nine store locations, so managers routinely oversold items that had already sold out elsewhere.",
    approach:
      "We mapped the actual stock-transfer workflow store staff used day to day, then built a single system around it instead of forcing a generic inventory tool onto their process.",
    solution:
      "A real-time dashboard syncing stock, transfers, and orders across every location, with low-stock alerts routed to the right store manager automatically.",
    result: "Stockouts down 40%",
    metric: "40%",
    metricLabel: "fewer stockouts in the first quarter",
  },
  {
    name: "Healthcare Booking App",
    slug: "healthcare-booking-app",
    summary: "A patient scheduling app connecting clinics and patients across multiple regions.",
    tags: ["Mobile App", "Healthcare", "UX Research"],
    variant: "mobile",
    challenge:
      "Patients were booking by phone during clinic hours only, and no-show rates were high because there was no reminder system in place.",
    approach:
      "We shadowed front-desk staff for a week to understand where bookings actually broke down before designing a single screen of the app.",
    solution:
      "A mobile booking flow with live availability across clinics, automated reminders, and a rebooking flow that took under 30 seconds.",
    result: "No-shows cut in half",
    metric: "50%",
    metricLabel: "reduction in missed appointments",
  },
  {
    name: "Logistics Dashboard",
    slug: "logistics-dashboard",
    summary: "An operations dashboard giving a fleet manager visibility into deliveries in real time.",
    tags: ["Web App", "Logistics", "Analytics"],
    variant: "analytics",
    challenge:
      "Dispatchers found out about a late delivery only when a customer called to complain — there was no live view of where the fleet actually was.",
    approach:
      "We started from the one question dispatchers needed answered fastest — \"which deliveries are at risk right now\" — and designed backward from that.",
    solution:
      "A live operations dashboard with route status, delay flags, and a daily performance view the ops team could act on before customers noticed.",
    result: "On-time delivery up sharply",
    metric: "27%",
    metricLabel: "improvement in on-time delivery",
  },
  {
    name: "E-commerce Storefront",
    slug: "ecommerce-storefront",
    summary: "A custom storefront and checkout experience built for a growing online brand.",
    tags: ["E-commerce", "Web Design", "Storefront"],
    variant: "storefront",
    challenge:
      "A templated storefront was capping conversion — checkout took seven steps and mobile load times were pushing four seconds.",
    approach:
      "We rebuilt checkout around the three decisions a buyer actually makes (product, shipping, payment), cutting everything else out of the flow.",
    solution:
      "A custom storefront with a three-step checkout, optimized product imagery, and sub-second mobile load times.",
    result: "Checkout conversion climbed",
    metric: "22%",
    metricLabel: "increase in checkout conversion",
  },
] as const;

export const TESTIMONIALS = [
  {
    quote: "Delta felt like an extension of our own team — fast, communicative, and genuinely invested in the outcome.",
    name: "Founder",
    company: "Early-stage startup client",
  },
  {
    quote: "They took a messy set of requirements and turned it into a product our users actually enjoy using.",
    name: "Product Lead",
    company: "Retail client",
  },
  {
    quote: "Clear communication from kickoff to launch, and support has stayed just as responsive since.",
    name: "Operations Manager",
    company: "Logistics client",
  },
] as const;
