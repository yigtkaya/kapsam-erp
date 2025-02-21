import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reçete Detayları | Kapsam ERP",
  description: "Reçete detayları ve komponent listesi",
};

export default function BOMDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
