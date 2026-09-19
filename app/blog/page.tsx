import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import BlogCard from "@/components/BlogCard";
import CTASection from "@/components/CTASection";
import Reveal from "@/components/Reveal";
import { BLOG_POSTS } from "@/lib/blog";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Blog",
  "Insights on custom software development, UX, and product engineering from the Delta Software Limited team.",
  "/blog"
);

export default function BlogPage() {
  return (
    <>
      <PageHeader
        eyebrow="Blog"
        title="Notes on building software that lasts"
        description="Thoughts on product strategy, design, and engineering from the team at Delta."
      />

      <section className="bg-bg">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {BLOG_POSTS.map((post, index) => (
              <Reveal key={post.slug} delay={index * 0.05}>
                <BlogCard post={post} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Have a project you'd like to talk through?"
        description="We're always happy to jump on a call and think it through with you."
      />
    </>
  );
}
