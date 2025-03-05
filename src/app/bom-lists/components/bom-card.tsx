import { BOM } from "@/types/manufacture";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import Link from "next/link";

interface BOMCardProps {
  bom: BOM;
}

export function BOMCard({ bom }: BOMCardProps) {
  return (
    <Link href={`/bom-lists/${bom.id}`}>
      <Card className="p-4 hover:bg-accent transition-colors cursor-pointer">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold">
              {bom.product?.product_name || "İsimsiz Ürün"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {bom.product?.product_code}
            </p>
            <p className="text-sm text-muted-foreground">
              Versiyon: {bom.version}
            </p>
          </div>
          <Badge variant={bom.is_active ? "default" : "secondary"}>
            {bom.is_active ? "Aktif" : "Pasif"}
          </Badge>
        </div>
        <p className="text-muted-foreground line-clamp-2">Not: {bom.notes}</p>

        {/* {bom.approved_by && bom.approved_at && (
          <div className="text-sm space-y-1">
            <p className="text-muted-foreground">
              Onaylayan: {bom.approved_by.first_name}{" "}
              {bom.approved_by.last_name}
            </p>
            <p className="text-muted-foreground">
              Onay Tarihi:{" "}
              {format(new Date(bom.approved_at), "d MMMM yyyy", {
                locale: tr,
              })}
            </p>
          </div>
        )} */}
      </Card>
    </Link>
  );
}
