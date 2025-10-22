"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Check, Loader2, X } from "lucide-react";

export default function ApproveMissionButton({ userMissionId }: { userMissionId: number }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<"success" | "error" | null>(null);
  const supabase = createClient();
  const router = useRouter();

  const handleApprove = async () => {
    if (!confirm("Sei sicuro di voler approvare questa missione e assegnare i Creds?")) {
      return;
    }

    setLoading(true);
    setResult(null);

    const { data, error } = await supabase.rpc('approve_and_reward_mission', {
      p_user_mission_id: userMissionId
    });

    if (error || (data && !data.success)) {
      console.error("Errore RPC:", error || data.message);
      setResult("error");
    } else {
      console.log("Approvato:", data);
      setResult("success");
      // Ricarica la pagina per rimuovere la riga dalla lista
      router.refresh(); 
    }

    setLoading(false);
  };

  if (result === "success") {
    return <Check className="w-5 h-5 text-green-400" />;
  }

  if (result === "error") {
    return <X className="w-5 h-5 text-red-400" />;
  }

  return (
    <button
      onClick={handleApprove}
      disabled={loading}
      className="bg-primary text-background-main font-bold px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all disabled:bg-gray-600"
    >
      {loading ? <Loader2 className="animate-spin" /> : "Approva"}
    </button>
  );
}