import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Terms & Conditions",
  `The terms that govern use of the ${SITE_NAME} website and our engagement process.`,
  "/terms"
);

const LAST_UPDATED = "August 29, 2026";

const SECTIONS = [
  {
    title: "Use of this website",
    body: [
      `This website is provided by ${SITE_NAME} for informational purposes, to describe our services, and to allow prospective clients to get in touch with us. You agree to use it only for lawful purposes.`,
    ],
  },
  {
    title: "Intellectual property",
    body: [
      "All content on this site — including text, design, graphics, and code — is the property of " +
        SITE_NAME +
        " unless otherwise noted, and may not be reproduced or redistributed without our permission.",
    ],
  },
  {
    title: "No professional advice",
    body: [
      "Content on this site, including blog posts, is provided for general informational purposes and does not constitute professional, legal, or technical advice for your specific situation.",
    ],
  },
  {
    title: "Project engagements",
    body: [
      "Submitting the contact form or discussing a project with us does not create a binding agreement. Any actual engagement, scope, timeline, and pricing will be defined in a separate, mutually signed agreement or statement of work.",
    ],
  },
  {
    title: "Limitation of liability",
    body: [
      `To the fullest extent permitted by law, ${SITE_NAME} is not liable for any indirect, incidental, or consequential damages arising from your use of this website.`,
    ],
  },
  {
    title: "Governing law",
    body: [
      "These terms are governed by the laws of Bangladesh, without regard to conflict-of-law principles.",
    ],
  },
  {
    title: "Changes to these terms",
    body: [
      "We may update these terms from time to time. The date at the top of this page reflects the most recent revision.",
    ],
  },
  {
    title: "Contact",
    body: [`Questions about these terms can be sent to ${CONTACT_EMAIL}.`],
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Terms & Conditions"
        description={`Last updated ${LAST_UPDATED}.`}
      />

      <section className="bg-bg">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
          <Reveal>
            <div className="space-y-12">
              {SECTIONS.map((section) => (
                <div key={section.title}>
                  <h2 className="text-h3 text-fg">{section.title}</h2>
                  <div className="mt-3 space-y-4">
                    {section.body.map((paragraph, index) => (
                      <p key={index} className="text-base leading-relaxed text-muted">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
