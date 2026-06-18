import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UNMUTE2K26 | Manhaj Arts Fest",
  description:
    "Official live result website of UNMUTE2K26, Manhaj Rashad Islamic College Arts Fest.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}