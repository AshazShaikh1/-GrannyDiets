import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Granny Diets | Authentic Homemade Pickles",
  description: "Delicious, traditional, and authentic homemade pickles crafted with love and no artificial preservatives.",
  keywords: ["pickles", "homemade", "authentic", "granny diets", "indian pickles", "spicy"],
  metadataBase: new URL('https://grannydiets.com'), // Replace with actual production domain
  openGraph: {
    title: "Granny Diets",
    description: "Authentic Homemade Pickles",
    url: 'https://grannydiets.com',
    siteName: 'Granny Diets',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Granny Diets',
    description: 'Authentic Homemade Pickles',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-background text-text-primary min-h-screen flex flex-col">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
