import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Machine Details | Kapsam ERP",
  description: "View and edit machine details",
};

interface LayoutProps {
  children: React.ReactNode;
}

export default function MachineDetailsLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
