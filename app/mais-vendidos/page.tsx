import Breadcrumb from "@/components/Breadcrumb";
import PageHero from "@/components/PageHero";
import CatalogListing from "@/components/CatalogListing";
import Testimonials from "@/components/Testimonials";
import { getBestsellers } from "@/lib/products";

export const metadata = {
  title: "Mais vendidos — Bazam",
};

export default function MaisVendidosPage() {
  const list = getBestsellers();
  return (
    <>
      <Breadcrumb items={[{ label: "Mais vendidos" }]} />
      <PageHero
        eyebrow="Top vendas"
        title="Os queridinhos da Bazam"
        subtitle="Os produtos mais comprados nos últimos 30 dias — escolhidos por mais de 58.000 clientes."
        icon="trending"
        count={list.length}
        accent="amber"
      />
      <CatalogListing products={list} />
      <Testimonials />
    </>
  );
}
