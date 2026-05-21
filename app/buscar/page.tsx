import Breadcrumb from "@/components/Breadcrumb";
import SearchResults from "@/components/SearchResults";
import { allProducts } from "@/lib/products";
import { searchProducts } from "@/lib/search";

export const metadata = {
  title: "Buscar — Bazam",
};

export default function BuscarPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = (searchParams.q ?? "").trim();
  const list = searchProducts(allProducts, q);

  return (
    <>
      <Breadcrumb
        items={[{ label: "Buscar", href: "/buscar" }, { label: q || "Resultados" }]}
      />
      <SearchResults query={q} products={list} />
    </>
  );
}
