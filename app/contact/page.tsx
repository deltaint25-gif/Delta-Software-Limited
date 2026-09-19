import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";
import { CONTACT_ADDRESS, CONTACT_EMAIL, CONTACT_PHONE, SOCIAL_LINKS } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Contact",
  "Get in touch with Delta Software Limited to discuss your next software project. We typically respond within one business day.",
  "/contact"
);

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Tell us about your project"
        description="Fill out the form and we'll get back to you within one business day, or reach us directly using the details below."
      />

      <section className="bg-bg">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-3 lg:px-8">
          <Reveal className="lg:col-span-2">
            <ContactForm />
          </Reveal>

          <Reveal
            delay={0.1}
            className="relative overflow-hidden rounded-md border border-white/10 bg-ink/90 p-8 text-white backdrop-blur-xl"
          >
            <div className="blob -right-16 -top-16 h-56 w-56 bg-accent-red/20" aria-hidden="true" />
            <div className="relative">
              <p className="eyebrow text-white/60">Get in touch</p>
              <ul className="mt-6 space-y-5 text-sm">
                <li>
                  <p className="text-white/60">Email</p>
                  <a href={`mailto:${CONTACT_EMAIL}`} className="link-underline-dark break-all font-medium hover:underline">
                    {CONTACT_EMAIL}
                  </a>
                </li>
                <li>
                  <p className="text-white/60">Phone</p>
                  <p className="font-medium">{CONTACT_PHONE}</p>
                </li>
                <li>
                  <p className="text-white/60">Location</p>
                  <p className="font-medium">{CONTACT_ADDRESS}</p>
                </li>
              </ul>

              <p className="eyebrow mt-8 text-white/60">Follow us</p>
              <ul className="mt-4 space-y-2">
                {SOCIAL_LINKS.map((social) => (
                  <li key={social.label}>
                    <a href={social.href} className="link-underline-dark inline-flex min-h-[44px] items-center text-sm text-white/70 hover:text-white lg:min-h-0">
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
