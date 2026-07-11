import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { PostHogProvider } from "@/lib/analytics/posthog-provider";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { MetaPixel } from "@/components/analytics/meta-pixel";

export const metadata: Metadata = {
  metadataBase: new URL("https://fitwid.fit"),
  title: {
    default: "FitWid – AI Fitness Coach | Personalized Workout & Diet Plans",
    template: "%s | FitWid",
  },
  description:
    "Get a free AI Body Assessment and receive personalized workout plans, meal plans, BMI, body fat analysis, and expert fitness coaching with FitWid.",
  openGraph: {
    title: "FitWid – AI Fitness Coach | Personalized Workout & Diet Plans",
    description:
      "Get a free AI Body Assessment and receive personalized workout plans, meal plans, BMI, body fat analysis, and expert fitness coaching with FitWid.",
    url: "https://fitwid.fit",
    siteName: "FitWid",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/images/og-banner.jpg",
        width: 1200,
        height: 630,
        alt: "FitWid — AI Fitness Coach: personalized workouts, meal plans, and coaching",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FitWid – AI Fitness Coach | Personalized Workout & Diet Plans",
    description:
      "Get a free AI Body Assessment and receive personalized workout plans, meal plans, BMI, body fat analysis, and expert fitness coaching with FitWid.",
    images: ["/images/og-banner.jpg"],
  },
  verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION }
    : undefined,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- root layout applies site-wide, not per-page */}
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Anton&family=JetBrains+Mono:wght@500;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <PostHogProvider />
        <GoogleAnalytics />
        <MetaPixel />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
