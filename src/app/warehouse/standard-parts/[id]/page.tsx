"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Product } from "@/types/inventory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditStandardPartForm } from "../components/edit-standard-part";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditStandardPartPage() {
  const params = useParams();
  const router = useRouter();
  const [part, setPart] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPart = async () => {
      try {
        const response = await fetch(`/api/standard-parts/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch standard part");
        }
        const data = await response.json();
        setPart(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPart();
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

  if (!part) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-muted-foreground">Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Standard part not found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Standart Parça Düzenle</CardTitle>
      </CardHeader>
      <CardContent>
        <EditStandardPartForm part={part} />
      </CardContent>
    </Card>
  );
}
