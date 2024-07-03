import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./global.css";
import { URL } from "url";

export const metadata: Metadata = {
  title: "red-cabinet",
  description: "red-cabinetは錐槌 碧が個人で運営しているwebサイトです。",
  metadataBase: new URL("https://red-cabinet.net"),
  openGraph: {
    type: "website",
    url: "https://red-cabinet.net",
    title: "red-cabinet",
    description: "red-cabinetは錐槌 碧が個人で運営しているwebサイトです。",
    siteName: "red-cabinet.net",
    images: [{
      url: "https://red-cabinet.net/favicon.ico",
    }],
  },
  // twitter: {
  //   card: "summary",
  //   site: "@KiriduchiMidori",
  //   images: [{
  //     url: "https://red-cabinet.net/favicon.ico",
  //   }],
  // }
};

const FigtreeFont = Figtree({
  weight: "300",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`pl-8 pr-8 max-w-screen-md mx-auto ${FigtreeFont.className}`}>
        {children}
      </body>
    </html>
  );
}
