interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  light?: boolean;
  align?: "left" | "center";
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  light = false,
  align = "left",
}: SectionHeadingProps) {
  const isCenter = align === "center";

  return (
    <div className={isCenter ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className={`eyebrow ${light ? "text-white/60" : ""}`}>{eyebrow}</p>
      <h2
        className={`mt-3 text-h2 ${
          light ? "text-white" : "text-fg"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-base ${light ? "text-white/60" : "text-muted"}`}>{description}</p>
      )}
    </div>
  );
}
