import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Privacy Policy",
  `How ${SITE_NAME} collects, uses, and protects information submitted through this website.`,
  "/privacy"
);

const LAST_UPDATED = "August 29, 2026";

const SECTIONS = [
  {
    title: "Information we collect",
    body: [
      `We collect information you provide directly to us, such as your name, email address, and project details when you submit our contact form, or when you email us at ${CONTACT_EMAIL}.`,
      "We may also collect basic technical information automatically, such as your browser type and general usage patterns, through standard web server logs or analytics tools, if enabled.",
    ],
  },
  {
    title: "How we use information",
    body: [
      "We use the information you submit to respond to your inquiry, discuss potential projects, and communicate with you about work you've engaged us for.",
      "We do not sell or rent your personal information to third parties.",
    ],
  },
  {
    title: "Cookies and analytics",
    body: [
      "This site may use cookies or similar technologies for basic functionality, such as remembering your theme preference, and may use privacy-respecting analytics to understand overall site usage. We do not use these tools to build advertising profiles.",
    ],
  },
  {
    title: "Third-party services",
    body: [
      "When you submit our contact form, your information may be forwarded to a third-party form-processing or email-delivery service we use to receive and manage inquiries. We choose providers that maintain reasonable security practices, but we do not control their systems directly.",
    ],
  },
  {
    title: "Data retention",
    body: [
      "We retain information from contact form submissions and email correspondence for as long as reasonably necessary to respond to your inquiry and maintain business records, after which it may be deleted.",
    ],
  },
  {
    title: "Your rights",
    body: [
      `You can request to see, correct, or delete the personal information we hold about you at any time by emailing ${CONTACT_EMAIL}.`,
    ],
  },
  {
    title: "Changes to this policy",
    body: [
      "We may update this policy from time to time. The date at the top of this page reflects the most recent revision.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy"
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
