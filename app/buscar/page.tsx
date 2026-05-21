import Breadcrumb from "@/components/Breadcrumb";
import SearchResults from "@/components/SearchResults";
import { allProducts } from "@/lib/products";

export const metadata = {
  title: "Buscar — Bazam",
};

function normalize(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

export default function BuscarPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = (searchParams.q ?? "").trim();
  const nq = normalize(q);
  const list = nq
    ? allProducts.filter(
        (p) =>
          normalize(p.name).includes(nq) ||
          normalize(p.brand).includes(nq) ||
          normalize(p.category).includes(nq),
      )
    : [];

  return (
    <>
      <Breadcrumb
        items={[{ label: "Buscar", href: "/buscar" }, { label: q || "Resultados" }]}
      />
      <SearchResults query={q} products={list} />
    </>
  );
}
