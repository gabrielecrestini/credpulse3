// app/components/MissionCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, CheckCircle, ExternalLink } from "lucide-react";

// Definiamo i tipi di dato per la missione
type Mission = {
  id: number;
  title: string;
  description: string;
  rwc_reward: number;
  partner_name: string;
  partner_logo_url: string;
  call_to_action_url: string;
};

// Definiamo i tipi per lo stato della missione
type MissionStatus = "new" | "started" | "completed";

// Funzione per formattare i numeri
const formatCreds = (creds: number) => {
  return new Intl.NumberFormat("it-IT").format(creds);
};

export default function MissionCard({ 
  mission, 
  status, 
  userId 
}: { 
  mission: Mission;
  status: MissionStatus;
  userId: string;
}) {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleStartMission = async () => {
    setLoading(true);
    
    // 1. Aggiungi la missione alla tabella user_missions
    const { error } = await supabase
      .from("user_missions")
      .insert({
        user_id: userId,
        mission_id: mission.id,
        status: "started",
      });
    
    if (error) {
      console.error("Errore nell'avviare la missione:", error.message);
      setLoading(false);
      return;
    }
    
    // 2. Ricarica la pagina per aggiornare lo stato
    router.refresh();
    
    // 3. Apri il link di affiliazione in un nuovo tab
    window.open(mission.call_to_action_url, "_blank");
    
    setLoading(false);
  };

  const getButton = () => {
    switch (status) {
      case "completed":
        return (
          <div className="flex items-center gap-2 justify-center px-6 py-3 rounded-lg bg-green-500/20 text-green-400 font-semibold">
            <CheckCircle className="w-5 h-5" />
            Completata
          </div>
        );
      case "started":
        return (
          <Link
            href={mission.call_to_action_url}
            target="_blank"
            className="flex items-center gap-2 justify-center px-6 py-3 rounded-lg bg-white/10 text-gray-300 font-semibold hover:bg-white/20 transition-colors"
          >
            <ExternalLink className="w-5 h-5" />
            Continua Missione
          </Link>
        );
      case "new":
      default:
        return (
          <button
            onClick={handleStartMission}
            disabled={loading}
            className="flex items-center gap-2 justify-center px-6 py-3 rounded-lg bg-primary text-background-main font-bold hover:bg-opacity-90 transition-all w-full"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              `Inizia (+${formatCreds(mission.rwc_reward)} Creds)`
            )}
          </button>
        );
    }
  };

  return (
    <div className="bg-background-secondary/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col h-full shadow-lg">
      {/* Partner Logo & Name */}
      <div className="flex items-center gap-4 mb-4">
        {/* Usiamo un'icona di fallback se l'URL non c'è */}
        <div className="w-12 h-12 rounded-lg bg-white/10 p-2 flex items-center justify-center">
          <Image
            src={mission.partner_logo_url || '/images/hero-card.png'} // Fallback
            alt={mission.partner_name}
            width={40}
            height={40}
            className="object-contain"
          />
        </div>
        <div>
          <h3 className="text-xl font-heading font-bold text-white">
            {mission.title}
          </h3>
          <p className="text-sm text-gray-400">Partner: {mission.partner_name}</p>
        </div>
      </div>
      
      {/* Descrizione */}
      <p className="text-gray-300 text-sm mb-6 flex-grow">
        {mission.description}
      </p>
      
      {/* Reward */}
      <div className="mb-6 text-center">
        <span className="text-sm text-gray-400">RICOMPENSA</span>
        <p className="text-3xl font-heading font-bold text-primary">
          {formatCreds(mission.rwc_reward)} Creds
        </p>
      </div>

      {/* Azione */}
      <div className="mt-auto">
        {getButton()}
      </div>
    </div>
  );
}