import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import CTASection from "@/components/CTASection";
import Reveal from "@/components/Reveal";
import ReadingProgress from "@/components/ReadingProgress";
import { BLOG_POSTS, getBlogPost } from "@/lib/blog";
import { pageMetadata } from "@/lib/metadata";

interface BlogPostPageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export const dynamicParams = false;

export function generateMetadata({ params }: BlogPostPageProps): Metadata {
  const post = getBlogPost(params.slug);
  if (!post) {
    return { title: "Blog" };
  }
  // Returning only title/description inherits the layout's
  // `alternates.canonical: "/"`, which told search engines every post was a
  // duplicate of the homepage — enough to drop the whole blog from the index.
  return pageMetadata(post.title, post.excerpt, `/blog/${post.slug}`);
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <ReadingProgress />
      <PageHeader eyebrow={post.category} title={post.title} />

      <section className="bg-bg">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
          <Reveal>
            <p className="mb-10 text-sm text-muted">
              {formatDate(post.date)} &middot; {post.readTime}
            </p>
            <div className="space-y-6">
              {post.body.map((paragraph, index) => (
                <p key={index} className="text-base leading-relaxed text-fg">
                  {paragraph}
                </p>
              ))}
            </div>
            <Link href="/blog" className="btn-pill-outline mt-12 w-fit">
              &larr; Back to blog
            </Link>
          </Reveal>
        </div>
      </section>

      <CTASection
        title="Want help thinking through something like this?"
        description="Tell us what you're working on and we'll get back to you within one business day."
      />
    </>
  );
}
