// app/components/ApprovePayoutButton.tsx
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Check, Loader2, X } from "lucide-react"; // Assicurati che X sia importato

export default function ApprovePayoutButton({ payoutRequestId }: { payoutRequestId: number }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<"success" | "error" | null>(null);
  const supabase = createClient();
  const router = useRouter();

  const handleApprove = async () => {
    if (!confirm("Sei sicuro di voler approvare questa richiesta? Verrà inviata all'automazione PayPal.")) {
      return;
    }

    setLoading(true);
    setResult(null);

    // Chiama la funzione RPC che cambia lo stato a 'approved'
    const { data, error } = await supabase.rpc('approve_payout_request_for_automation', {
      p_payout_request_id: payoutRequestId
    });

    if (error || (data && !data.success)) {
      console.error("Errore RPC Payout Approval:", error || data.message);
      setResult("error");
      alert(`Errore: ${error?.message || data?.message}`);
    } else {
      setResult("success");
      // Dopo l'approvazione, la riga non è più 'pending' e scompare dalla lista
      router.refresh();
    }

    setLoading(false);
  };


  if (result === "success") {
    // CORREZIONE: Rimosso title="..."
    return <Check className="w-5 h-5 text-green-400" />;
  }

  if (result === "error") {
    // CORREZIONE: Rimosso title="..."
    return <X className="w-5 h-5 text-red-400" />;
  }

  return (
    <button
      onClick={handleApprove}
      disabled={loading}
      className="bg-green-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-green-700 transition-all disabled:bg-gray-600"
    >
      {loading ? <Loader2 className="animate-spin" /> : "Approva Payout"}
    </button>
  );
}