import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SwRegister } from "@/components/SwRegister";

export const metadata: Metadata = {
  title: "Do It",
  description: "A real-time adaptive execution system. One thing at a time.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Do It",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ffffff",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body>
        <SwRegister />
        {children}
      </body>
    </html>
  );
}
