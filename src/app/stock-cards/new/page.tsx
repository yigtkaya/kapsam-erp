import { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { NewStockCardForm } from "@/components/forms/new-stock-card-form";

export const metadata: Metadata = {
  title: "Yeni Stok Kartı",
  description: "Yeni stok kartı oluştur",
};

export default function NewStockCardPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-4">
        <PageHeader
          title="Yeni Stok Kartı"
          description="Yeni bir stok kartı oluşturmak için aşağıdaki formu doldurun."
          showBackButton
        />
        <NewStockCardForm />
      </div>
    </div>
  );
}
