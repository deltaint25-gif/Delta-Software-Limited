import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CaseStudyDetail from "@/components/CaseStudyDetail";
import CTASection from "@/components/CTASection";
import { PROJECTS } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

interface ProjectPageProps {
  params: { slug: string };
}

function getProject(slug: string) {
  return PROJECTS.find((project) => project.slug === slug);
}

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export const dynamicParams = false;

export function generateMetadata({ params }: ProjectPageProps): Metadata {
  const project = getProject(params.slug);
  if (!project) {
    return { title: "Work" };
  }
  return pageMetadata(project.name, project.summary, `/portfolio/${project.slug}`);
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const project = getProject(params.slug);

  if (!project) {
    notFound();
  }

  const index = PROJECTS.findIndex((item) => item.slug === params.slug);

  return (
    <>
      <CaseStudyDetail project={project} allProjects={PROJECTS} index={index} />

      <CTASection
        title="Have a project in mind?"
        description="Let's talk about what you're building and how we can help."
      />
    </>
  );
}
