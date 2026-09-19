import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { BlogPost } from "@/lib/blog";

interface BlogCardProps {
  post: BlogPost;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="card-surface liquid-card link-underline group flex h-full flex-col p-6"
    >
      <span className="eyebrow">{post.category}</span>
      <h2 className="mt-3 text-lg font-semibold text-fg">{post.title}</h2>
      <p className="mt-2 text-sm text-muted">{post.excerpt}</p>
      <div className="mt-4 flex flex-1 items-end justify-between gap-4">
        <p className="text-xs text-muted">
          {formatDate(post.date)} &middot; {post.readTime}
        </p>
        <ArrowRight
          className="h-4 w-4 flex-shrink-0 text-fg transition-transform duration-300 ease-out group-hover:translate-x-1"
          aria-hidden="true"
        />
      </div>
    </Link>
  );
}
