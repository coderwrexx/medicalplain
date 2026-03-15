import type { Metadata } from "next";
import "./globals.css";
import PWAInstall from "./components/PWAInstall";
import ThemeProvider from "./components/ThemeProvider";

export const metadata: Metadata = {
  title: "MedicalPlain — World's Best Medical AI",
  description: "MBBS-level AI that explains prescriptions, lab reports, symptoms and answers all health questions in plain language",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="MedicalPlain" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body>
        <ThemeProvider>
          {children}
          <PWAInstall />
        </ThemeProvider>
      </body>
    </html>
  );
}
