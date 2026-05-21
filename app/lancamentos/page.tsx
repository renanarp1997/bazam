import Breadcrumb from "@/components/Breadcrumb";
import PageHero from "@/components/PageHero";
import CatalogListing from "@/components/CatalogListing";
import { getNew } from "@/lib/products";

export const metadata = {
  title: "Lançamentos — Bazam",
};

export default function LancamentosPage() {
  const list = getNew();
  return (
    <>
      <Breadcrumb items={[{ label: "Lançamentos" }]} />
      <PageHero
        eyebrow="Acabou de chegar"
        title="Lançamentos selecionados"
        subtitle="As novidades mais quentes da semana, com curadoria Bazam. Frete grátis para todo Brasil."
        icon="sparkles"
        count={list.length}
        accent="accent"
      />
      <CatalogListing products={list} />
    </>
  );
}
