import { ReactNode } from "react";

interface ExplorarLayoutProps {
  children: ReactNode;
}

export const metadata = {
  title: "Explorar - JuegaMás",
  description: "Explora deportes y espacios deportivos disponibles",
};

export default function ExplorarLayout({ children }: ExplorarLayoutProps) {
  return (
    <div className="min-h-screen pt-24 pb-16">
      {children}
    </div>
  );
} 