import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Process Configuration | Manufacturing | Kapsam ERP",
  description: "Edit process configuration details",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
