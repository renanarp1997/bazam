import Breadcrumb from "@/components/Breadcrumb";
import PageHero from "@/components/PageHero";
import CatalogListing from "@/components/CatalogListing";
import { allProducts } from "@/lib/products";

export const metadata = {
  title: "Favoritos — Bazam",
};

export default function FavoritosPage() {
  const list = allProducts.slice(0, 6);
  return (
    <>
      <Breadcrumb items={[{ label: "Favoritos" }]} />
      <PageHero
        eyebrow="Minha lista"
        title="Seus favoritos"
        subtitle="Tudo o que você marcou para comprar depois. Salvamos para você não esquecer."
        icon="heart"
        count={list.length}
        accent="rose"
      />
      <CatalogListing products={list} />
    </>
  );
}
