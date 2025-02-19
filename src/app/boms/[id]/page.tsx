import { Metadata } from "next";
import { EditBOMForm } from "../components/bom-form";

export const metadata: Metadata = {
  title: "Edit BOM | Kapsam ERP",
  description: "Edit an existing bill of materials",
};

async function getBOM(id: string) {
  try {
    const response = await fetch(`${process.env.API_URL}/api/boms/${id}`, {
      next: { tags: ["bom"] },
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching BOM:", error);
    return null;
  }
}

interface EditBOMPageProps {
  params: {
    id: string;
  };
}

export default async function EditBOMPage({ params }: EditBOMPageProps) {
  const bom = await getBOM(params.id);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-8">Edit BOM</h1>
      <EditBOMForm initialData={bom} />
    </div>
  );
}
