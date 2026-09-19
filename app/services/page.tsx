import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import SectionHeading from "@/components/SectionHeading";
import CTASection from "@/components/CTASection";
import StickyProcess from "@/components/StickyProcess";
import TechConstellation from "@/components/TechConstellation";
import ProductEngineering from "@/components/ProductEngineering";
import Industries from "@/components/Industries";
import TrustCapabilities from "@/components/TrustCapabilities";
import ServicesGrid from "@/components/ServicesGrid";
import Reveal from "@/components/Reveal";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Services",
  "Custom software, web, and mobile development services from Delta Software Limited — covering product strategy, design, engineering, and long-term support.",
  "/services"
);

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Everything your product needs, in one team"
        description="From first sketch to long-term support, we cover the full lifecycle of building software people want to use."
        buttonLabel="Contact Us"
      />

      <ServicesGrid />

      <StickyProcess />

      <section className="border-t border-line bg-bg">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Engineering" title="How we build" align="center" />
          <Reveal className="mt-12" delay={0.05}>
            <ProductEngineering />
          </Reveal>
        </div>
      </section>

      <section className="border-t border-line bg-bg-alt">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Technology" title="Tools we build with" align="center" />
          <Reveal className="mt-12" delay={0.05}>
            <TechConstellation />
          </Reveal>
        </div>
      </section>

      <section className="border-t border-line bg-bg">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Industries" title="Who we build for" align="center" />
          <Reveal className="mt-12" delay={0.05}>
            <Industries />
          </Reveal>
        </div>
      </section>

      <section className="border-t border-line bg-bg-alt">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Reliability" title="Built to be trusted with production systems" />
          <Reveal className="mt-12" delay={0.05}>
            <TrustCapabilities />
          </Reveal>
        </div>
      </section>

      <CTASection
        title="Not sure which service you need?"
        description="Tell us about your project and we'll help you figure out the right scope."
      />
    </>
  );
}
