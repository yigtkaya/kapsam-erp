import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Process Details | Kapsam ERP",
  description: "View and edit process details",
};

interface LayoutProps {
  children: React.ReactNode;
}

export default function ProcessDetailsLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
