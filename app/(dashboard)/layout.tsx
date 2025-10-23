// app/(dashboard)/layout.tsx
"use client"; 

import { useState } from "react";
import Sidebar from "@/app/components/Sidebar";
import MobileHeader from "@/app/components/MobileHeader";
import { useAuth } from "@/app/hooks/useAuth"; 
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAdmin, loading } = useAuth(); 

  if (loading) {
    return (
      <div className="w-screen h-screen bg-background-main flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null; // Hook handles redirect
  }

  return (
    <div className="flex min-h-screen bg-background-main">
      {/* Sidebar remains the same */}
      <Sidebar isOpen={isOpen} isAdmin={isAdmin} />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col lg:ml-64"> 
        {/* Mobile Header remains the same */}
        <MobileHeader isOpen={isOpen} setIsOpen={setIsOpen} />
        
        {/* Main Content Area - Adjusted padding */}
        <main className="flex-1 p-4 sm:p-6 md:p-10 overflow-auto"> 
          {children}
        </main>
      </div>

      {/* Mobile Overlay remains the same */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
        ></div>
      )}
    </div>
  );
}