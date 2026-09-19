import type { MetadataRoute } from "next";
import { PROJECTS, SERVICE_DETAILS, SITE_URL } from "@/lib/constants";
import { BLOG_POSTS } from "@/lib/blog";

const STATIC_ROUTES = ["", "/services", "/about", "/portfolio", "/blog", "/contact", "/privacy", "/terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
  }));

  const blogEntries = BLOG_POSTS.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
  }));

  const projectEntries = PROJECTS.map((project) => ({
    url: `${SITE_URL}/portfolio/${project.slug}`,
    lastModified: new Date(),
  }));

  // The eight service detail pages are statically generated and indexable but
  // were absent here — only the /services index was listed.
  const serviceEntries = SERVICE_DETAILS.map((service) => ({
    url: `${SITE_URL}/services/${service.slug}`,
    lastModified: new Date(),
  }));

  return [...staticEntries, ...serviceEntries, ...blogEntries, ...projectEntries];
}
