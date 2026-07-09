import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { PostHogProvider } from "@/lib/analytics/posthog-provider";

export const metadata: Metadata = {
  metadataBase: new URL("https://fitwid.fit"),
  title: {
    default: "FitWid | Science-Based Coaching",
    template: "%s | FitWid",
  },
  description:
    "FitWid — science-based, progressive overload coaching. InBody-driven programming from I-BLITZ Fitness Club, Bangalore.",
  openGraph: {
    title: "FitWid | Science-Based Coaching",
    description:
      "Personalized workouts, nutrition, and InBody-driven coaching from I-BLITZ Fitness Club, Bangalore.",
    url: "https://fitwid.fit",
    siteName: "FitWid",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FitWid | Science-Based Coaching",
    description: "Personalized workouts, nutrition, and InBody-driven coaching.",
  },
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
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <PostHogProvider />
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
