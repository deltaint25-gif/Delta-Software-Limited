import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import SectionHeading from "@/components/SectionHeading";
import CTASection from "@/components/CTASection";
import Reveal from "@/components/Reveal";
import { STATS } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "About",
  "Meet Delta Software Limited — a team of engineers and designers building custom software that solves real problems for growing businesses.",
  "/about"
);

const VALUES = [
  { title: "Client-first", description: "We build for the people who'll actually use the product, not just the spec." },
  { title: "Clear communication", description: "Regular updates, honest timelines, and no surprises at handoff." },
  { title: "Built to last", description: "Clean, maintainable code so your product stays easy to grow." },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About us"
        title="A team of engineers and designers building software that lasts"
        description="Delta Software Limited was founded to help businesses turn ideas into reliable, well-crafted software."
      />

      <section className="relative overflow-hidden bg-bg">
        <div
          className="blob -right-32 top-0 h-96 w-96 bg-accent-red/[0.06] dark:bg-accent-red/10"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
            <Reveal blur>
              <p className="text-2xl font-medium leading-snug tracking-tight text-fg">
                We work closely with our clients at every stage &mdash; from planning and design
                through development, launch, and long-term support.
              </p>
              <p className="mt-6 text-body-lg">
                Our approach combines technical rigor with a genuine focus on the people who will
                use what we build. Whether it&apos;s a customer-facing web app or an internal tool,
                we aim to deliver software that is fast, maintainable, and easy to use.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <dl className="divide-y divide-line border-y border-line">
                {STATS.map((stat) => (
                  <div key={stat.label} className="flex items-baseline justify-between gap-6 py-5">
                    <dt className="text-sm text-muted">{stat.label}</dt>
                    <dd className="text-h3 whitespace-nowrap text-fg">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-bg-alt">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="What we believe" title="How we work with clients" />
          <div className="mt-12 divide-y divide-line border-t border-line">
            {VALUES.map((value, index) => (
              <Reveal key={value.title} delay={index * 0.06}>
                <div className="flex flex-col gap-2 py-8 sm:flex-row sm:items-baseline sm:gap-10">
                  <span className="text-caption w-12 flex-shrink-0">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-h3 flex-shrink-0 text-fg sm:w-64">{value.title}</h3>
                  <p className="text-body">{value.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Want to work together?"
        description="We'd love to hear about what you're building."
      />
    </>
  );
}
