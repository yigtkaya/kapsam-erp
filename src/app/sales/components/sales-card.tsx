"use client";

import { SalesOrder } from "@/types/sales";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Link from "next/link";

interface SalesCardProps {
  order: SalesOrder;
}

export function SalesCard({ order }: SalesCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{order.order_number}</h3>
              <Badge variant="default">{order.status_display}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {order.customer_name}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Order Date</span>
              <span>{new Date(order.order_date).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Deadline</span>
              <span>{new Date(order.deadline_date).toLocaleDateString()}</span>
            </div>
            {order.shipments.length > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipments</span>
                <span>{order.shipments.length}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button asChild variant="secondary" className="w-full gap-2">
          <Link href={`/sales/${order.id}`}>
            <Eye className="h-4 w-4" />
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
