// app/(dashboard)/layout.tsx
"use client"; // Convertito a Client Component

import { useState } from "react";
import Sidebar from "@/app/components/Sidebar";
import MobileHeader from "@/app/components/MobileHeader";
import { useAuth } from "@/app/hooks/useAuth"; // Il nostro nuovo hook
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAdmin, loading } = useAuth(); // Usa l'hook

  // Mostra un caricamento mentre l'hook controlla l'utente
  if (loading) {
    return (
      <div className="w-screen h-screen bg-background-main flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // L'hook gestirà il redirect se l'utente non è loggato
  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background-main">
      {/* Sidebar (ora gestita da stato) */}
      <Sidebar isOpen={isOpen} isAdmin={isAdmin} />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Header per Mobile */}
        <MobileHeader isOpen={isOpen} setIsOpen={setIsOpen} />
        
        {/* Contenuto della Pagina */}
        <main className="flex-1 p-6 md:p-10 overflow-auto">
          {children}
        </main>
      </div>

      {/* Overlay per mobile (chiude la sidebar se clicchi fuori) */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
        ></div>
      )}
    </div>
  );
}