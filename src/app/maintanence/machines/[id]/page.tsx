"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMachine } from "@/hooks/useMachines";
import { EditMachineForm } from "../components/edit-machine-form";

export default function EditMachinePage() {
  const params = useParams();
  const { data: machine, isLoading, error } = useMachine(params.id as string);

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
          <CardTitle className="text-red-500">Hata</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (!machine) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-muted-foreground">Bulunamadı</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Makine bulunamadı</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Makine Düzenle</CardTitle>
      </CardHeader>
      <CardContent>
        {machine && <EditMachineForm machine={machine} />}
      </CardContent>
    </Card>
  );
}
