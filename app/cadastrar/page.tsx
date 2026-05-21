import AuthForm from "@/components/AuthForm";

export const metadata = {
  title: "Criar conta — Bazam",
};

export default function CadastrarPage() {
  return <AuthForm mode="signup" />;
}
