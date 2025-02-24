import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Reçete Bileşenleri | Kapsam ERP",
  description: "Reçete bileşenlerini yönetin",
};

export default function BOMComponentsRedirectPage() {
  redirect("/boms");
}
