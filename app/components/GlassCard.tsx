// app/components/GlassCard.tsx
"use client"; // Deve essere client per motion

import { LucideIcon } from "lucide-react";
import { motion, Variants } from "framer-motion"; // Importa motion e Variants

// --- CORREZIONE QUI ---
// Aggiungi 'variants' alle props
interface GlassCardProps {
  icon: React.ReactElement<LucideIcon>;
  title: string;
  description: string;
  comingSoon?: boolean;
  variants?: Variants; // Prop 'variants' necessaria
}
// --- FINE CORREZIONE ---

// Convertiamo il div principale in un motion.div
export default function GlassCard({ 
  icon, 
  title, 
  description, 
  comingSoon = false, 
  variants // Usa la prop
}: GlassCardProps) {
  return (
    <motion.div 
      variants={variants} // Applica le varianti passate
      className="bg-background-secondary/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col h-full relative overflow-hidden shadow-lg 
                 transition-all duration-300 hover:scale-[1.03] hover:border-primary/50 hover:-translate-y-1 hover:shadow-primary/20"
    >
      {comingSoon && (
        <span className="absolute top-3 right-3 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full uppercase z-10">
          Coming Soon
        </span>
      )}
      <div className="bg-primary/10 text-primary w-12 h-12 rounded-lg flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm flex-grow">{description}</p>
    </motion.div>
  );
}