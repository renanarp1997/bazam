import Breadcrumb from "@/components/Breadcrumb";
import HelpCenter from "@/components/HelpCenter";

export const metadata = {
  title: "Central de ajuda — Bazam",
};

export default function AjudaPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Central de ajuda" }]} />
      <HelpCenter />
    </>
  );
}
