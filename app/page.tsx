import HeroBanner from "@/components/HeroBanner";
import TrustStrip from "@/components/TrustStrip";
import FlashDeals from "@/components/FlashDeals";
import CategoriesGrid from "@/components/CategoriesGrid";
import ProductGrid from "@/components/ProductGrid";
import DoubleBanner from "@/components/DoubleBanner";
import Trending from "@/components/Trending";
import Testimonials from "@/components/Testimonials";
import BrandsStrip from "@/components/BrandsStrip";
import Newsletter from "@/components/Newsletter";
import { newArrivals, products } from "@/lib/products";

export default function Home() {
  return (
    <>
      <HeroBanner />
      <TrustStrip />
      <FlashDeals />
      <CategoriesGrid />
      <ProductGrid
        id="vitrine"
        eyebrow="Mais vendidos"
        title="Os queridinhos da semana"
        subtitle="As escolhas dos nossos clientes — com estoque limitado e frete grátis."
        products={products}
        accent="rose"
        filters={["Todos", "Eletrônicos", "Moda", "Calçados", "Acessórios"]}
      />
      <DoubleBanner />
      <Trending />
      <ProductGrid
        eyebrow="Acabou de chegar"
        title="Lançamentos selecionados"
        subtitle="Novidades curadas para você descobrir antes de todo mundo."
        products={newArrivals}
        accent="accent"
      />
      <Testimonials />
      <BrandsStrip />
      <Newsletter />
    </>
  );
}
