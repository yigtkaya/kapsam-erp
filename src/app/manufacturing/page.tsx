import { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import {
  Settings,
  Cog,
  ClipboardList,
  Factory,
  ArrowRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Manufacturing | Kapsam ERP",
  description: "Manufacturing management",
};

export default function ManufacturingPage() {
  return (
    <div className="container py-4">
      <PageHeader
        title="Üretim Yönetimi"
        description="Makineler, süreçler ve iş emirlerini yönetin"
        showBackButton
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <Link href="/manufacturing/machines" className="block">
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Cog className="w-5 h-5 mr-2" />
                Makineler
              </CardTitle>
              <CardDescription>Üretim makinelerini yönetin</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Makineleri ekleyin, düzenleyin ve bakım planlaması yapın
              </p>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/manufacturing/processes" className="block">
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Üretim Süreçleri
              </CardTitle>
              <CardDescription>Üretim süreçlerini yönetin</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Standart üretim süreçlerini tanımlayın ve düzenleyin
              </p>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/manufacturing/process-configs" className="block">
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ClipboardList className="w-5 h-5 mr-2" />
                İşlem Yapılandırmaları
              </CardTitle>
              <CardDescription>İşlem yapılandırmalarını yönetin</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                İşlem yapılandırmalarını oluşturun, düzenleyin ve silin
              </p>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/boms" className="block">
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Factory className="w-5 h-5 mr-2" />
                Ürün Reçeteleri (BOM)
              </CardTitle>
              <CardDescription>Ürün reçetelerini yönetin</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Ürün reçetelerini oluşturun ve bileşenlerini düzenleyin
              </p>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
