"use client";

import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, BarChart, TrendingUp, ClipboardList } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProductionPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <PageHeader
        title="Üretim"
        description="Üretim Raporları ve Analizleri"
        showBackButton
        onBack={() => window.history.back()}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {/* Daily Production Report Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              Günlük Üretim Raporu
            </CardTitle>
            <CardDescription>
              Günlük üretim verilerini girin ve takip edin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Vardiya bazında üretim miktarları, fire oranları ve notları
              kaydedin.
            </p>
            <Button asChild className="w-full">
              <Link href="/production/daily-report">Rapor Oluştur</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Production Analytics Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <BarChart className="h-5 w-5 text-green-500" />
              Üretim Analizleri
            </CardTitle>
            <CardDescription>Üretim performansını analiz edin</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Üretim hatları, ürünler ve vardiyalar bazında performans
              analizleri.
            </p>
            <Button variant="outline" className="w-full" disabled>
              Yakında
            </Button>
          </CardContent>
        </Card>

        {/* Production Planning Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-purple-500" />
              Üretim Planlaması
            </CardTitle>
            <CardDescription>
              Üretim planlarını oluşturun ve yönetin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Günlük, haftalık ve aylık üretim planları oluşturun ve takip edin.
            </p>
            <Button variant="outline" className="w-full" disabled>
              Yakında
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
