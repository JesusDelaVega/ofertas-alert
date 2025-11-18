import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ofertas Alert - Las mejores ofertas de Amazon y Mercado Libre",
  description: "Encuentra los mejores descuentos y ofertas de Amazon y Mercado Libre. Te avisamos cuando hay promociones increíbles para que no te las pierdas.",
  keywords: "ofertas, descuentos, amazon, mercado libre, promociones, alertas, cupones",
  openGraph: {
    title: "Ofertas Alert - Las mejores ofertas de Amazon y Mercado Libre",
    description: "Encuentra los mejores descuentos y ofertas. Te avisamos cuando hay promociones increíbles.",
    type: "website",
    locale: "es_MX",
    siteName: "Ofertas Alert"
  },
  twitter: {
    card: "summary_large_image",
    title: "Ofertas Alert",
    description: "Las mejores ofertas de Amazon y Mercado Libre"
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* Google Ads */}
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}`}
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
