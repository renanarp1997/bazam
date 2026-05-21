import Breadcrumb from "@/components/Breadcrumb";
import FavoritesList from "@/components/FavoritesList";

export const metadata = {
  title: "Favoritos — Bazam",
};

export default function FavoritosPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Favoritos" }]} />
      <FavoritesList />
    </>
  );
}
