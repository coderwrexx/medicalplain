import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import PWAInstall from "./components/PWAInstall";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MedicalPlain — AI Medical Expert",
  description: "MBBS-level AI that explains your prescriptions and lab reports in plain language",
  manifest: "/manifest.json",
  themeColor: "#2563eb",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MedicalPlain",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MedicalPlain" />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body className={geist.className}>
        {children}
        <PWAInstall />
      </body>
    </html>
  );
}
