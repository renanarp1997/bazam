import Breadcrumb from "@/components/Breadcrumb";
import Checkout from "@/components/Checkout";

export const metadata = {
  title: "Finalizar compra — Bazam",
};

export default function CheckoutPage() {
  return (
    <>
      <Breadcrumb
        items={[{ label: "Sacola", href: "/sacola" }, { label: "Checkout" }]}
      />
      <Checkout />
    </>
  );
}
