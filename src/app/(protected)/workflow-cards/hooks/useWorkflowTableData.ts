import { ProductWorkflow, WorkflowStatus } from "@/types/manufacture";
import { useWorkflows } from "./useWorkflow";
import { useProcessConfigs } from "./useProcessConfig";
import { useProducts } from "@/hooks/useProducts";
import { useProcesses } from "./useManufacturingProcess";

export interface WorkflowTableRow {
  id: number;
  product_code: string;
  product_name: string;
  workflow_id: number;
  version: string;
  status: WorkflowStatus;
  processes: ProcessTableRow[];
}

export interface ProcessTableRow {
  id: number;
  operation_code: string;
  operation_name: string;
  machine_type: string;
  axis_count: string | null;
  version: string;
  stock_code: string;
}

export function useWorkflowTableData() {
  const { data: workflows, isLoading: isLoadingWorkflows } = useWorkflows();
  const { data: processConfigs, isLoading: isLoadingConfigs } =
    useProcessConfigs();
  const { data: products, isLoading: isLoadingProducts } = useProducts();
  const { data: processes, isLoading: isLoadingProcesses } = useProcesses();

  const isLoading =
    isLoadingWorkflows ||
    isLoadingConfigs ||
    isLoadingProducts ||
    isLoadingProcesses;

  const tableData: WorkflowTableRow[] = [];

  if (!isLoading && workflows && processConfigs && products && processes) {
    // Group workflows by product
    const workflowsByProduct = new Map();
    workflows.forEach((workflow) => {
      if (!workflowsByProduct.has(workflow.product)) {
        workflowsByProduct.set(workflow.product, []);
      }
      workflowsByProduct.get(workflow.product).push(workflow);
    });

    // For each product, get the active workflow or latest one
    workflowsByProduct.forEach((productWorkflows, productId) => {
      const product = products.find((p) => p.id === productId);
      if (!product) return;

      // Get active workflow or latest version
      const activeWorkflow =
        productWorkflows.find(
          (w: ProductWorkflow) => w.status === WorkflowStatus.ACTIVE
        ) ||
        productWorkflows.reduce(
          (latest: ProductWorkflow, current: ProductWorkflow) => {
            if (!latest) return current;
            return new Date(current.created_at) > new Date(latest.created_at)
              ? current
              : latest;
          },
          null
        );

      if (!activeWorkflow) return;

      // Get process configs for this workflow
      const workflowProcesses = processConfigs
        .filter((config) => config.workflow === activeWorkflow.id)
        .sort((a, b) => a.sequence_order - b.sequence_order)
        .map((config) => {
          const process = processes.find((p) => p.id === config.process);
          return {
            id: config.id,
            operation_code: config.process_code || process?.process_code || "",
            operation_name: process?.process_name || "Unknown Process",
            machine_type: "Not Specified",
            axis_count: config.axis_count || null,
            version: config.version,
            stock_code: config.stock_code || "",
          };
        });

      tableData.push({
        id: product.id,
        product_code: product.product_code,
        product_name: product.product_name,
        workflow_id: activeWorkflow.id,
        version: activeWorkflow.version,
        status: activeWorkflow.status,
        processes: workflowProcesses,
      });
    });
  }

  return {
    data: tableData,
    isLoading,
  };
}
