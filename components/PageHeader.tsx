"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  buttonLabel?: string;
  buttonHref?: string;
}

export default function PageHeader({
  eyebrow,
  title,
  description,
  buttonLabel,
  buttonHref = "/contact",
}: PageHeaderProps) {
  return (
    <div className="relative overflow-hidden bg-bg-alt">
      <div className="ambient-glow" aria-hidden="true" />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-28 lg:px-8"
      >
        {eyebrow && (
          <div className="mb-4">
            <span className="eyebrow-pill">
              <span className="eyebrow-pill-dot" aria-hidden="true" />
              {eyebrow}
            </span>
          </div>
        )}
        <h1 className="text-h1 text-fg">
          {title}
        </h1>
        {description && (
          <p className="mt-6 max-w-2xl text-lg text-muted">{description}</p>
        )}
        {buttonLabel && (
          <Link href={buttonHref} className="btn-pill-primary mt-8 w-fit">
            {buttonLabel}
          </Link>
        )}
      </motion.div>
    </div>
  );
}
