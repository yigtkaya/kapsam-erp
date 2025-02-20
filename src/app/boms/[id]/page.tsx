import { Metadata } from "next";
import { BOMDetails } from "../components/bom-details";

export const metadata: Metadata = {
  title: "Edit BOM | Kapsam ERP",
  description: "Edit your bill of materials",
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const EditBOMPage = async ({ params }: PageProps) => {
  const resolvedParams = await params;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-8">Edit BOM</h1>
      <BOMDetails id={Number(resolvedParams.id)} />
    </div>
  );
};

export default EditBOMPage;
