import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { getResumeData } from "@/lib/resume";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = getResumeData();
  const siteUrl = `https://${profile.host}`;
  const description = `${profile.name} — ${profile.title}. ${profile.tagline}`;

  return {
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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { profile } = getResumeData();
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title,
    description: profile.tagline,
    email: `mailto:${profile.email}`,
    url: `https://${profile.host}`,
  };

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
