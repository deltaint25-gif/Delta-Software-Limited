import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";

/**
 * Next generates this from app/opengraph-image.tsx and attaches it
 * automatically — but only to routes that do not declare `openGraph`
 * themselves. A child's `openGraph` REPLACES the parent's rather than merging
 * into it, so every page built by this helper was silently dropping the image
 * and sharing with no preview card. Declaring it here puts it back.
 */
const OG_IMAGE = "/opengraph-image";

export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: path,
      siteName: SITE_NAME,
      type: "website",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [OG_IMAGE],
    },
  };
}
