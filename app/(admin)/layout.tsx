// app/(admin)/layout.tsx
"use client"; // Convertito a Client Component

import { useState, useEffect } from "react";
import Sidebar from "@/app/components/Sidebar";
import MobileHeader from "@/app/components/MobileHeader";
import { useAuth } from "@/app/hooks/useAuth"; // Il nostro hook
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAdmin, loading } = useAuth(); // Usa l'hook
  const router = useRouter();

  // Controllo di sicurezza specifico per l'admin
  useEffect(() => {
    if (!loading && !isAdmin) {
      // Se l'utente non è admin, reindirizza alla dashboard
      router.push('/dashboard');
    }
  }, [loading, isAdmin, router]);

  // Mostra caricamento finché non siamo sicuri che sia l'admin
  if (loading || !isAdmin) {
    return (
      <div className="w-screen h-screen bg-background-main flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // Se è admin, mostra il layout
  return (
    <div className="flex min-h-screen bg-background-main">
      <Sidebar isOpen={isOpen} isAdmin={isAdmin} />

      <div className="flex-1 flex flex-col lg:ml-64">
        <MobileHeader isOpen={isOpen} setIsOpen={setIsOpen} />
        
        <main className="flex-1 p-6 md:p-10 overflow-auto">
          {children}
        </main>
      </div>

      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
        ></div>
      )}
    </div>
  );
}