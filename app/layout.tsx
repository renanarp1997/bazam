import type { Metadata } from "next";
import "./globals.css";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import QuickView from "@/components/QuickView";
import Toaster from "@/components/Toaster";
import { CartProvider } from "@/lib/cart-context";
import { FavoritesProvider } from "@/lib/favorites-context";
import { QuickViewProvider } from "@/lib/quickview-context";
import { ToastProvider } from "@/lib/toast-context";

export const metadata: Metadata = {
  title: "Bazam — Moda, tecnologia e estilo de vida",
  description:
    "Loja oficial Bazam. Tênis, eletrônicos, moda e acessórios com frete rápido e parcelamento sem juros.",
  metadataBase: new URL("https://bazam.example.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Manrope:wght@500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-white font-sans">
        <ToastProvider>
          <CartProvider>
            <FavoritesProvider>
              <QuickViewProvider>
                <AnnouncementBar />
                <Header />
                <main>{children}</main>
                <Footer />
                <CartDrawer />
                <QuickView />
                <Toaster />
              </QuickViewProvider>
            </FavoritesProvider>
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
