import type { Metadata } from "next";
import { Inter, Baloo_2 } from "next/font/google";
import { MotionConfig } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import PageTransition from "@/components/PageTransition";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/lib/constants";
import { THEME_INIT_SCRIPT } from "@/components/ThemeToggle";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const baloo2 = Baloo_2({ subsets: ["latin"], weight: ["400", "600", "700", "800"], variable: "--font-display" });

const DESCRIPTION =
  "Delta Software Limited is a digital product design and development company building custom software, web, and mobile experiences for growing businesses.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: SITE_NAME,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: DESCRIPTION,
  },
};

const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/icon.svg`,
  description: DESCRIPTION,
  email: CONTACT_EMAIL,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dhaka",
    addressCountry: "BD",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${baloo2.variable} flex min-h-screen flex-col bg-bg font-sans text-fg`}
      >
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }}
        />
        <CustomCursor />
        <SmoothScroll>
          <MotionConfig reducedMotion="user">
            <Navbar />
            <main className="flex-1">
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
          </MotionConfig>
        </SmoothScroll>
      </body>
    </html>
  );
}
