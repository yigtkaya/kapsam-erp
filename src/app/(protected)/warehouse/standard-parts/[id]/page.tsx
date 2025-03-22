"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditStandardPartForm } from "../components/edit-standard-part";
import { Skeleton } from "@/components/ui/skeleton";
import { useProduct } from "@/hooks/useProducts";

export default function EditStandardPartPage() {
  const params = useParams();
  const { data: part, isLoading, error } = useProduct(params.id as string);

  if (isLoading) {
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
          <p>{error.message}</p>
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
