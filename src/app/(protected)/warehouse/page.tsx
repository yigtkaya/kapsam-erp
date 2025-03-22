// create a page for warehouse with modules

import { WarehouseModules } from "./warehouse-modules";
import { PageHeader } from "@/components/ui/page-header";
export default function WarehousePage() {
  return (
    <div>
      <PageHeader
        title="Depo Yönetimi"
        description="Depo yönetimi modülleri"
        showBackButton
      />
      <WarehouseModules />
    </div>
  );
}
