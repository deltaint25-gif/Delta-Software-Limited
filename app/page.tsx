import Link from "next/link";
import Hero from "@/components/home/Hero";
import StatsBar from "@/components/home/StatsBar";
import Showreel from "@/components/home/Showreel";
import LogoStrip from "@/components/LogoStrip";
import HorizontalShowcase from "@/components/home/HorizontalShowcase";
import StickyProcess from "@/components/StickyProcess";
import ServicesShowcase from "@/components/ServicesShowcase";
import SectionHeading from "@/components/SectionHeading";
import BlogCard from "@/components/BlogCard";
import Reveal from "@/components/Reveal";
import TestimonialsSlider from "@/components/TestimonialsSlider";
import { BLOG_POSTS } from "@/lib/blog";

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBar />
      <Showreel />
      <LogoStrip />
      <HorizontalShowcase />
      <StickyProcess />
      <ServicesShowcase />

      <section className="bg-bg">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Testimonials" title="What clients say" align="center" />
          <div className="mt-12">
            <Reveal>
              <TestimonialsSlider />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-bg-alt">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading eyebrow="From the blog" title="Notes on building software that lasts" />
            <Link href="/blog" className="btn-pill-outline" data-cursor-hover>
              Read the blog
            </Link>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {BLOG_POSTS.slice(0, 3).map((post, index) => (
              <Reveal key={post.slug} delay={index * 0.06}>
                <BlogCard post={post} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
