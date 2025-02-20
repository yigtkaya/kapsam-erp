// create a page for warehouse with modules

import { PageHeader } from "@/components/ui/page-header";
import { MaintanenceModules } from "./maintanence-modules";

export default function WarehousePage() {
  return (
    <div>
      <PageHeader
        title="Bakım Yönetimi"
        description="Bakım yönetimi modülleri"
        showBackButton
      />
      <MaintanenceModules />
    </div>
  );
}
