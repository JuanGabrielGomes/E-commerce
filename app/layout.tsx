import type { Metadata } from "next";
import { Fraunces, Space_Grotesk } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const bodyFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "700"]
});

const displayFont = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700"]
});

export const metadata: Metadata = {
  title: "Orbita Shop | Ecommerce Frontend",
  description: "Frontend de ecommerce em Next.js preparado para integração com backend."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${bodyFont.variable} ${displayFont.variable}`}>
        <CartProvider>
          <SiteHeader />
          <main className="shell page-content">{children}</main>
          <footer className="footer shell">
            <small>Orbita Shop Frontend em Next.js</small>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}

