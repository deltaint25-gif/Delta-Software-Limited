import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import CaseStudyRow from "@/components/CaseStudyRow";
import CTASection from "@/components/CTASection";
import Reveal from "@/components/Reveal";
import { PROJECTS } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Work",
  "Real projects delivered by Delta Software Limited — inventory platforms, booking apps, logistics dashboards, and e-commerce storefronts built for real business problems.",
  "/portfolio"
);

export default function PortfolioPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our work"
        title="A selection of projects we've delivered"
        description="Real problems, shipped software. Here's a look at work we've done for clients across industries."
      />

      <section className="bg-bg">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-20 sm:gap-28">
            {PROJECTS.map((project, index) => (
              <Reveal key={project.name} delay={index * 0.05}>
                <CaseStudyRow {...project} id={project.slug} reversed={index % 2 === 1} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Have a project in mind?"
        description="Let's talk about what you're building and how we can help."
      />
    </>
  );
}
