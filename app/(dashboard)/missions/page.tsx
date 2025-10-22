import { createClient } from "@/lib/supabase/server"; // Rimosso import cookies
import MissionCard from "@/app/components/MissionCard";
import { AlertCircle } from "lucide-react";

// Tipizziamo i dati che ci aspettiamo
type Mission = {
  id: number;
  title: string;
  description: string;
  category: string;
  rwc_reward: number;
  partner_name: string;
  partner_logo_url: string;
  call_to_action_url: string;
};

type UserMission = {
  mission_id: number;
  status: string;
};

export default async function MissionsPage() {
  // const cookieStore = cookies(); // RIMOSSO
  const supabase = createClient(); // CORRETTO

  // Prendiamo l'ID utente
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null; // Già gestito dal layout, ma per sicurezza

  // 1. Fetch tutte le missioni attive
  const { data: missions, error: missionsError } = await supabase
    .from("missions")
    .select("*")
    .eq("is_active", true);
  
  // 2. Fetch tutte le missioni dell'utente
  const { data: userMissions, error: userMissionsError } = await supabase
    .from("user_missions")
    .select("mission_id, status")
    .eq("user_id", user.id);

  if (missionsError || userMissionsError) {
    return (
      <div className="text-red-400">
        Errore nel caricamento delle missioni.
      </div>
    );
  }

  // 3. Creiamo una "mappa" per un rapido accesso allo stato
  const userMissionsMap = new Map<number, string>();
  userMissions?.forEach(m => {
    userMissionsMap.set(m.mission_id, m.status);
  });

  return (
    <div className="w-full">
      <h1 className="text-3xl font-heading font-bold text-white mb-8">
        Missioni
      </h1>

      {/* Avviso */}
      <div className="bg-primary/10 border border-primary/30 text-primary px-4 py-3 rounded-lg mb-8 flex items-center gap-3">
        <AlertCircle className="w-5 h-5" />
        <p className="text-sm">
          Le ricompense in Creds vengono assegnate manualmente dopo una verifica. Potrebbero volerci 24-48 ore.
        </p>
      </div>

      {/* Griglia Missioni */}
      {missions && missions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {missions.map((mission) => {
            const status = userMissionsMap.get(mission.id);
            let missionStatus: "new" | "started" | "completed" = "new";
            if (status === "started") missionStatus = "started";
            if (status === "completed") missionStatus = "completed";
            
            return (
              <MissionCard
                key={mission.id}
                mission={mission as Mission}
                status={missionStatus}
                userId={user.id}
              />
            );
          })}
        </div>
      ) : (
        <div className="bg-background-secondary/80 backdrop-blur-md border border-white/10 p-10 rounded-2xl text-center">
          <p className="text-gray-400">
            Nessuna missione disponibile al momento. Torna a trovarci presto!
          </p>
        </div>
      )}
    </div>
  );
}