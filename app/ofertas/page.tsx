import Breadcrumb from "@/components/Breadcrumb";
import PageHero from "@/components/PageHero";
import CatalogListing from "@/components/CatalogListing";
import FlashDeals from "@/components/FlashDeals";
import { getOnSale } from "@/lib/products";

export const metadata = {
  title: "Ofertas do dia — Bazam",
};

export default function OfertasPage() {
  const list = getOnSale();
  return (
    <>
      <Breadcrumb items={[{ label: "Ofertas do dia" }]} />
      <PageHero
        eyebrow="Mega Black Week"
        title="Ofertas do dia — até 60% OFF"
        subtitle="Curadoria diária com descontos imbatíveis. Estoque limitado e tempo curto."
        icon="flame"
        count={list.length}
        accent="rose"
      />
      <FlashDeals />
      <CatalogListing products={list} />
    </>
  );
}
