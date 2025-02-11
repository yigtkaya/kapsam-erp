import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateStandardPartSchema = z.object({
  product_code: z.string().min(1, "Ürün kodu gerekli"),
  product_name: z.string().min(1, "Ürün adı gerekli"),
  description: z.string().optional(),
  current_stock: z.number().min(0, "Stok miktarı 0'dan küçük olamaz"),
  product_type: z.literal("STANDARD_PART"),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const rawData = await request.json();
    const validatedData = updateStandardPartSchema.parse(rawData);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products/${params.id}/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const updatedPart = await response.json();
    return NextResponse.json(updatedPart);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products/${params.id}/`
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const part = await response.json();
    return NextResponse.json(part);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
