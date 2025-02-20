"use client";

import { BOM } from "@/types/manufacture";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface BOMGeneralInfoProps {
  bom: BOM;
}

export function BOMGeneralInfo({ bom }: BOMGeneralInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    version: bom.version,
    is_active: bom.is_active,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Implement update functionality
      toast.success("Changes saved");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to save changes");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Product</Label>
              <Input value={bom.product} disabled />
            </div>
            <div className="space-y-2">
              <Label>Product Type</Label>
              <Input value={bom.product_type} disabled />
            </div>
            <div className="space-y-2">
              <Label>Version</Label>
              <Input
                value={formData.version}
                onChange={(e) =>
                  setFormData({ ...formData, version: e.target.value })
                }
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Created At</Label>
              <Input
                value={new Date(bom.created_at).toLocaleDateString()}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label>Modified At</Label>
              <Input
                value={new Date(bom.modified_at).toLocaleDateString()}
                disabled
              />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label>Active</Label>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_active: checked })
                }
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            {isEditing ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </>
            ) : (
              <Button type="button" onClick={() => setIsEditing(true)}>
                Edit Details
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
