import "./globals.css";

export const metadata = {
  title: "UNMUTE2K26 | Manhaj Arts Fest",
  description:
    "Official website of UNMUTE2K26, Manhaj Arts Fest by Manhajurrashad Islamic College, Chelembra. View live results, gallery, downloads, and fest updates.",
  keywords: [
    "UNMUTE2K26",
    "Manhaj Arts Fest",
    "Manhaj Chelembra",
    "Manhajurrashad Islamic College",
    "Arts Fest Results",
  ],
  openGraph: {
    title: "UNMUTE2K26 | Manhaj Arts Fest",
    description:
      "Official website of UNMUTE2K26 Manhaj Arts Fest. Live results, gallery, downloads, and fest updates.",
    url: "https://unmute2k26.manhajchelembra.com",
    siteName: "UNMUTE2K26",
    type: "website",
  },
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