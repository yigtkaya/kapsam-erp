import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Edit Process Configuration | Manufacturing | Kapsam ERP",
    description: "Edit process configuration details",
};

export default function ProcessConfigLayout({ children }: { children: React.ReactNode }) {
    return <div className="container py-4">{children}</div>;
}   