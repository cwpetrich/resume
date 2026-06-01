import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { profile, email } from "@/lib/data";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const siteUrl = `https://${profile.host}`;
const description = `${profile.name} — ${profile.title}. ${profile.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} · ${profile.title}`,
    template: `%s · ${profile.name}`,
  },
  description,
  keywords: [
    profile.name,
    profile.title,
    "software engineer",
    "resume",
    "portfolio",
    "self-hosted",
    "Next.js",
  ],
  authors: [{ name: profile.name, url: siteUrl }],
  creator: profile.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: `${profile.name} · ${profile.title}`,
    description,
    siteName: `${profile.name} — Résumé`,
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} · ${profile.title}`,
    description,
  },
  robots: { index: true, follow: true },
};

// JSON-LD structured data so search engines / rich results understand the page.
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.title,
  description: profile.tagline,
  email: `mailto:${email}`,
  url: siteUrl,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={mono.variable}>
      <body className="font-mono antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
