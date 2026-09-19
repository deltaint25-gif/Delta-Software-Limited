"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

type FormStatus = "idle" | "submitting" | "submitted";

const PROJECT_TYPES = ["Custom Software", "Web App", "Mobile App", "UI/UX Design", "Not sure yet"] as const;
const BUDGETS = ["Under $10k", "$10k – $25k", "$25k – $50k", "$50k+", "Not sure yet"] as const;
const TIMELINES = ["ASAP", "1–3 months", "3–6 months", "Flexible"] as const;
const STEPS = ["Project", "Scope", "Contact"] as const;

type FormData = {
  projectType: string;
  budget: string;
  timeline: string;
  name: string;
  email: string;
  message: string;
};

const INITIAL_DATA: FormData = {
  projectType: "",
  budget: "",
  timeline: "",
  name: "",
  email: "",
  message: "",
};

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(INITIAL_DATA);
  const [error, setError] = useState<string | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function goNext() {
    if (step === 0 && !data.projectType) {
      setError("Pick the option closest to what you need.");
      return;
    }
    if (step === 1 && (!data.budget || !data.timeline)) {
      setError("Let us know your budget and timeline.");
      return;
    }
    setError(null);
    setStep((current) => Math.min(current + 1, STEPS.length - 1));
  }

  function goBack() {
    setError(null);
    setStep((current) => Math.max(current - 1, 0));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!data.name || !data.email) {
      setError("Name and email are required.");
      return;
    }
    setError(null);
    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        setError(body?.error ?? "We couldn't send your message. Please try again.");
        setStatus("idle");
        return;
      }

      setStatus("submitted");
    } catch {
      setError("We couldn't send your message. Please check your connection and try again.");
      setStatus("idle");
    }
  }

  if (status === "submitted") {
    return (
      <p
        role="status"
        aria-live="polite"
        className="rounded-md border border-line bg-bg-alt p-6 text-sm text-fg"
      >
        Thanks for reaching out! We&apos;ve received your message and will get back to you within
        one business day.
      </p>
    );
  }

  const isSubmitting = status === "submitting";
  const isLastStep = step === STEPS.length - 1;
  const stepTransition = reducedMotion ? { duration: 0 } : { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <div>
      <ol className="flex flex-wrap items-center gap-3" aria-label="Form progress">
        {STEPS.map((label, index) => (
          <li key={label} className="flex items-center gap-3">
            <span
              aria-current={index === step ? "step" : undefined}
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                index <= step ? "bg-fg text-bg" : "border border-line text-muted"
              }`}
            >
              {index + 1}
            </span>
            <span className={`text-sm ${index === step ? "font-medium text-fg" : "text-muted"}`}>{label}</span>
            {index < STEPS.length - 1 && <span className="h-px w-6 bg-line" aria-hidden="true" />}
          </li>
        ))}
      </ol>

      <form onSubmit={handleSubmit} className="mt-8" aria-busy={isSubmitting} noValidate>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={reducedMotion ? false : { opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, x: -16 }}
            transition={stepTransition}
          >
            {step === 0 && (
              <fieldset>
                <legend className="text-sm font-medium text-fg">What are you looking to build?</legend>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {PROJECT_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      data-cursor-hover
                      onClick={() => update("projectType", type)}
                      aria-pressed={data.projectType === type}
                      className={`rounded-md border px-4 py-3 text-left text-sm font-medium transition-colors ${
                        data.projectType === type
                          ? "border-fg bg-fg text-bg"
                          : "border-line bg-surface text-fg hover:border-fg"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            {step === 1 && (
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-fg">
                    Budget range
                  </label>
                  <select
                    id="budget"
                    value={data.budget}
                    onChange={(event) => update("budget", event.target.value)}
                    className="mt-2 block w-full rounded-md border border-line bg-surface px-4 py-3 text-sm text-fg shadow-sm focus:border-fg focus:outline-none focus:ring-1 focus:ring-fg"
                  >
                    <option value="" disabled>
                      Select a range
                    </option>
                    {BUDGETS.map((budget) => (
                      <option key={budget} value={budget}>
                        {budget}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="timeline" className="block text-sm font-medium text-fg">
                    Timeline
                  </label>
                  <select
                    id="timeline"
                    value={data.timeline}
                    onChange={(event) => update("timeline", event.target.value)}
                    className="mt-2 block w-full rounded-md border border-line bg-surface px-4 py-3 text-sm text-fg shadow-sm focus:border-fg focus:outline-none focus:ring-1 focus:ring-fg"
                  >
                    <option value="" disabled>
                      Select a timeline
                    </option>
                    {TIMELINES.map((timeline) => (
                      <option key={timeline} value={timeline}>
                        {timeline}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-fg">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      disabled={isSubmitting}
                      value={data.name}
                      onChange={(event) => update("name", event.target.value)}
                      className="mt-2 block w-full rounded-md border border-line bg-surface px-4 py-3 text-sm text-fg shadow-sm focus:border-fg focus:outline-none focus:ring-1 focus:ring-fg disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-fg">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      disabled={isSubmitting}
                      value={data.email}
                      onChange={(event) => update("email", event.target.value)}
                      className="mt-2 block w-full rounded-md border border-line bg-surface px-4 py-3 text-sm text-fg shadow-sm focus:border-fg focus:outline-none focus:ring-1 focus:ring-fg disabled:opacity-60"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-fg">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    disabled={isSubmitting}
                    value={data.message}
                    onChange={(event) => update("message", event.target.value)}
                    className="mt-2 block w-full rounded-md border border-line bg-surface px-4 py-3 text-sm text-fg shadow-sm focus:border-fg focus:outline-none focus:ring-1 focus:ring-fg disabled:opacity-60"
                  />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {error && (
          <p role="alert" className="mt-4 text-sm text-accent-red">
            {error}
          </p>
        )}

        <div className="mt-8 flex items-center justify-between">
          {step > 0 ? (
            <button
              type="button"
              data-cursor-hover
              onClick={goBack}
              disabled={isSubmitting}
              className="text-sm font-medium text-muted transition-colors hover:text-fg disabled:opacity-60"
            >
              Back
            </button>
          ) : (
            <span aria-hidden="true" />
          )}

          {isLastStep ? (
            <button
              type="submit"
              data-cursor-hover
              className="btn-pill-primary disabled:opacity-70"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="mr-2 h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Sending&hellip;
                </>
              ) : (
                "Send message"
              )}
            </button>
          ) : (
            <button type="button" data-cursor-hover onClick={goNext} className="btn-pill-primary">
              Continue
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
