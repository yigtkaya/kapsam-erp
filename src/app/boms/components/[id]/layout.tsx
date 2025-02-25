import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reçete Bileşenleri | Kapsam ERP",
  description: "Reçete bileşenlerini yönetin",
};

interface LayoutProps {
  children: React.ReactNode;
}

export default function BOMLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
