// create a page for warehouse with modules

import { MaintanenceModules } from "./maintanence-modules";

export default function WarehousePage() {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold pb-4">Bakım Yönetimi</h1>
      </div>
      <MaintanenceModules />
    </div>
  );
}
