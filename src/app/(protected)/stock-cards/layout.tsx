import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stok Tanıtım Kartları | Kapsam ERP",
  description: "Stok tanıtım kartlarının takibi ve yönetimi",
};

export default function StockCardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
