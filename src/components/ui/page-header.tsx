"use client";

import { ReactNode } from "react";
import { Button } from "./button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  showBackButton?: boolean;
  onBack?: () => void;
}

export function PageHeader({
  title,
  description,
  action,
  showBackButton,
  onBack,
}: PageHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between space-x-4 pb-6">
      <div className="flex items-center space-x-4">
        {showBackButton && (
          <Button
            variant="outline"
            size="icon"
            onClick={onBack || (() => window.history.back())}
            className="flex-shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-800">
            {title}
          </h2>
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
