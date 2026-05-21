import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import ProductDetail from "@/components/ProductDetail";
import ProductGrid from "@/components/ProductGrid";
import Testimonials from "@/components/Testimonials";
import {
  allProducts,
  getProduct,
  getProductsByCategory,
} from "@/lib/products";

export function generateStaticParams() {
  return allProducts.map((p) => ({ id: p.id }));
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = getProduct(params.id);
  if (!product) notFound();

  const related = getProductsByCategory(product.categorySlug)
    .filter((p) => p.id !== product.id)
    .slice(0, 5);

  return (
    <>
      <Breadcrumb
        items={[
          { label: product.category, href: `/categoria/${product.categorySlug}` },
          { label: product.name },
        ]}
      />
      <ProductDetail product={product} />
      {related.length > 0 && (
        <ProductGrid
          eyebrow="Você também pode gostar"
          title="Produtos relacionados"
          subtitle="Selecionados com base na sua navegação."
          products={related}
          accent="brand"
        />
      )}
      <Testimonials />
    </>
  );
}
