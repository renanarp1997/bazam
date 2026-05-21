import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import PageHero from "@/components/PageHero";
import CatalogListing from "@/components/CatalogListing";
import {
  categories,
  getCategory,
  getProductsByCategory,
} from "@/lib/products";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = getCategory(params.slug);
  if (!category) notFound();

  const list = getProductsByCategory(params.slug);

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Categorias" },
          { label: category.name },
        ]}
      />
      <PageHero
        eyebrow="Categoria"
        title={category.name}
        subtitle={category.description}
        image={category.hero}
        icon="tag"
        count={category.count}
        accent="brand"
      />
      <CatalogListing products={list} />
    </>
  );
}
