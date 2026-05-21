import Breadcrumb from "@/components/Breadcrumb";
import PlusLanding from "@/components/PlusLanding";

export const metadata = {
  title: "Bazam Plus — Programa de fidelidade",
};

export default function PlusPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Bazam Plus" }]} />
      <PlusLanding />
    </>
  );
}
