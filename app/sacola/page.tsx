import Breadcrumb from "@/components/Breadcrumb";
import Cart from "@/components/Cart";
import ProductGrid from "@/components/ProductGrid";
import { allProducts } from "@/lib/products";

export const metadata = {
  title: "Sacola — Bazam",
};

export default function SacolaPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Sacola" }]} />
      <Cart />
      <ProductGrid
        eyebrow="Recomendados para você"
        title="Você também pode gostar"
        subtitle="Complete sua compra com produtos que combinam."
        products={allProducts.slice(8, 13)}
        accent="brand"
      />
    </>
  );
}
