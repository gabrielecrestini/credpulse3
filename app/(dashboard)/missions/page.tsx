// app/(dashboard)/missions/page.tsx
import { createClient } from "@/lib/supabase/server"; 
import MissionCard from "@/app/components/MissionCard";
import { AlertCircle } from "lucide-react";

type Mission = { id: number; title: string; description: string; category: string; rwc_reward: number; partner_name: string; partner_logo_url: string; call_to_action_url: string; };

export default async function MissionsPage() {
  const supabase = await createClient(); // CORRETTO: await

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: missions, error: missionsError } = await supabase
    .from("missions")
    .select("*")
    .eq("is_active", true);
  
  const { data: userMissions, error: userMissionsError } = await supabase
    .from("user_missions")
    .select("mission_id, status")
    .eq("user_id", user.id);

  if (missionsError || userMissionsError) { 
    console.error("Errore caricamento missioni:", missionsError || userMissionsError);
    return <div className="text-red-400">Errore nel caricamento delle missioni. Riprova più tardi.</div>; 
  }

  const userMissionsMap = new Map<number, string>();
  userMissions?.forEach(m => { userMissionsMap.set(m.mission_id, m.status); });

  return (
    <div className="w-full">
      <h1 className="text-3xl font-heading font-bold text-white mb-8">
        Missioni Disponibili
      </h1>

      {/* Avviso */}
      <div className="bg-primary/10 border border-primary/30 text-primary px-4 py-3 rounded-lg mb-8 flex items-center gap-3">
        <AlertCircle className="w-5 h-5" />
        <p className="text-sm">
          Le ricompense in Creds vengono assegnate manualmente dall'admin dopo una verifica (solitamente 24-48 ore).
        </p>
      </div>

      {/* Griglia Missioni */}
      {missions && missions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {missions.map((mission) => {
            const status = userMissionsMap.get(mission.id);
            let missionStatus: "new" | "started" | "completed" = "new";
            if (status === "started") missionStatus = "started";
            // Nota: Lo stato 'completed' viene impostato solo dall'admin
            
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