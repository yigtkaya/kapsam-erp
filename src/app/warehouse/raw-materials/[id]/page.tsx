"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RawMaterial } from "@/types/inventory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EditRawMaterialForm } from "../components/edit-raw-material";

export default function EditRawMaterialPage() {
  const params = useParams();
  const router = useRouter();
  const [material, setMaterial] = useState<RawMaterial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        const response = await fetch(`/api/raw-materials/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch material");
        }
        const data = await response.json();
        setMaterial(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchMaterial();
    }
  }, [params.id]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-8 w-[200px]" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-red-500">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!material) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-muted-foreground">Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Raw material not found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hammadde Düzenle</CardTitle>
      </CardHeader>
      <CardContent>
        <EditRawMaterialForm material={material} />
      </CardContent>
    </Card>
  );
}
