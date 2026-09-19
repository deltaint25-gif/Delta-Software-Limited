import { TRUST_CAPABILITIES } from "@/lib/constants";

export default function TrustCapabilities() {
  return (
    <div className="grid gap-8 sm:grid-cols-2">
      {TRUST_CAPABILITIES.map((capability) => (
        <div key={capability.title} className="border-l-2 border-line pl-5">
          <h3 className="text-h4 text-fg">{capability.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{capability.description}</p>
        </div>
      ))}
    </div>
  );
}
