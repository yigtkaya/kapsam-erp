// create a page for warehouse with modules

import { WarehouseModules } from "./warehouse-modules";

export default function WarehousePage() {
  return (
    <div className="flex-1 space-y-4 container mx-auto pt-24 pb-8">
      <h1 className="text-2xl font-bold">Depo Yönetimi</h1>
      <WarehouseModules />
    </div>
  );
}
