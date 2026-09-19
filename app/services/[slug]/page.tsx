import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import MockupFrame from "@/components/MockupFrame";
import CTASection from "@/components/CTASection";
import ServiceIcon from "@/components/ServiceIcon";
import Reveal from "@/components/Reveal";
import { SERVICE_DETAILS, SERVICE_GROUPS, PROJECTS } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

interface ServicePageProps {
  params: { slug: string };
}

function getService(slug: string) {
  return SERVICE_DETAILS.find((service) => service.slug === slug);
}

export function generateStaticParams() {
  return SERVICE_DETAILS.map((service) => ({ slug: service.slug }));
}

export const dynamicParams = false;

export function generateMetadata({ params }: ServicePageProps): Metadata {
  const service = getService(params.slug);
  if (!service) return { title: "Services" };
  return pageMetadata(service.title, service.description, `/services/${service.slug}`);
}

export default function ServiceDetailPage({ params }: ServicePageProps) {
  const service = getService(params.slug);

  if (!service) {
    notFound();
  }

  const relatedProject =
    PROJECTS.find((project) => project.variant === service.previewVariant) ?? PROJECTS[0];

  const group = SERVICE_GROUPS.find((candidate) =>
    (candidate.services as readonly string[]).includes(service.title)
  );
  const siblingServices = group
    ? SERVICE_DETAILS.filter(
        (item) => item.slug !== service.slug && (group.services as readonly string[]).includes(item.title)
      )
    : [];

  return (
    <>
      <PageHeader
        eyebrow="Services"
        title={service.title}
        description={service.description}
        buttonLabel="Start a Project"
      />

      <section className="bg-bg">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <Reveal>
              <p className="eyebrow">What&apos;s included</p>
              <ul className="mt-6 flex flex-col gap-5">
                {service.capabilities.map((capability) => (
                  <li key={capability} className="flex items-start gap-3">
                    <span
                      className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-red"
                      aria-hidden="true"
                    />
                    <span className="text-base text-muted">{capability}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.08}>
              <div
                data-cursor="image"
                className="relative h-64 overflow-hidden rounded-feature border border-line shadow-elevation-2 sm:h-80"
              >
                <MockupFrame variant={service.previewVariant} className="h-full w-full" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-bg-alt">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
          <p className="eyebrow">Related work</p>
          <Reveal delay={0.05}>
            <Link
              href={`/portfolio/${relatedProject.slug}`}
              data-cursor="project"
              className="card-surface liquid-card mt-6 grid gap-6 p-6 sm:grid-cols-[220px_1fr] sm:items-center"
            >
              <div className="relative h-40 overflow-hidden rounded-image">
                <MockupFrame variant={relatedProject.variant} className="h-full w-full" />
              </div>
              <div>
                <h2 className="text-h3 text-fg">{relatedProject.name}</h2>
                <p className="mt-2 text-sm text-muted">{relatedProject.summary}</p>
                <span className="link-underline mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-fg">
                  View case study <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </div>
            </Link>
          </Reveal>
        </div>
      </section>

      {siblingServices.length > 0 && (
        <section className="border-t border-line bg-bg">
          <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
            <p className="eyebrow">More services</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {siblingServices.map((sibling) => (
                <Link
                  key={sibling.slug}
                  href={`/services/${sibling.slug}`}
                  data-cursor-hover
                  className="card-surface liquid-card flex items-start gap-3 p-5"
                >
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-accent-red/15 text-accent-red">
                    <ServiceIcon name={sibling.icon} className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-fg">{sibling.title}</span>
                    <span className="mt-0.5 block text-xs leading-snug text-muted">
                      {sibling.description}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTASection
        title="Ready to talk about your project?"
        description="Tell us what you're building and we'll get back to you within one business day."
      />
    </>
  );
}
