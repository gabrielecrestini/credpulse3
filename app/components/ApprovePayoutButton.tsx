// app/components/ApprovePayoutButton.tsx
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";

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
  
  // ... (Logica di rendering success/error) ...

  if (result === "success") {
    return <Check className="w-5 h-5 text-green-400" title="Approvato (In attesa di PayPal)" />;
  }
  
  if (result === "error") {
    return <X className="w-5 h-5 text-red-400" title="Errore" />;
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