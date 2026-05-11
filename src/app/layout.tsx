import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";

import "./globals.css";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Plant Care App",
  description: "A personal plant care app for tracking collections, routines, and notes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunitoSans.variable} antialiased`}>{children}</body>
    </html>
  );
}
