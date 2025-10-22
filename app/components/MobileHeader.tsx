// app/components/MobileHeader.tsx
"use client";
import { Menu, X } from "lucide-react";

interface MobileHeaderProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function MobileHeader({ isOpen, setIsOpen }: MobileHeaderProps) {
  return (
    // Mostra solo su schermi PICCOLI (lg:hidden)
    <header className="sticky top-0 z-30 lg:hidden w-full bg-background-main/80 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto flex justify-between items-center py-4 px-4">
        {/* Logo */}
        <h1 className="text-2xl font-heading font-bold text-white">
          Cred<span className="text-primary">Pulse</span>
        </h1>
        {/* Bottone Hamburger/X */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-white rounded-md hover:bg-white/10 transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
    </header>
  );
}