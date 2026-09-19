import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-32 text-center sm:px-6 lg:px-8">
      <p className="font-display text-6xl font-bold text-fg">404</p>
      <p className="mt-4 text-muted">This page could not be found.</p>
      <Link href="/" className="btn-pill-primary mt-8">
        Back to home
      </Link>
    </div>
  );
}
