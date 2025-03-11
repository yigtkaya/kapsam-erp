import { useRouter } from "next/navigation";
import { WorkflowProcess } from "@/types/manufacture";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface WorkflowProcessCardProps {
  process: WorkflowProcess;
}

export function WorkflowProcessCard({ process }: WorkflowProcessCardProps) {
  const router = useRouter();

  return (
    <Card
      className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => router.push(`/workflow-cards/${process.id}`)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{process.stock_code}</CardTitle>
            <CardDescription>
              {process.product_details?.product_code || "N/A"}
            </CardDescription>
          </div>
          <Badge>{process.sequence_order}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Ürün:</span>
            <span className="font-medium">
              {process.product_details?.product_name || "N/A"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Proses:</span>
            <span className="font-medium">
              {process.process_details?.process_name +
                "-" +
                process.process_details?.process_code || "N/A"}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="secondary" className="w-full">
          Detayları gör
        </Button>
      </CardFooter>
    </Card>
  );
}
