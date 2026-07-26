import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ClientProviders } from "@/components/providers/ClientProviders";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BuildConnect — Hire Workers, Book Contractors & Buy Materials",
    template: "%s | BuildConnect",
  },
  description:
    "BuildConnect is India's leading construction marketplace. Hire skilled workers, book verified contractors, and order building materials with transparent pricing and trusted reviews.",
  keywords: [
    "construction services",
    "hire workers",
    "book contractors",
    "building materials",
    "construction marketplace",
    "India",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full`}>
      <body className="min-h-full antialiased">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
