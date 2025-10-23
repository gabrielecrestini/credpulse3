// app/components/MarkAsPaidButton.tsx
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react"; // Solo Check e Loader2 sono usati qui

export default function MarkAsPaidButton({ payoutRequestId }: { payoutRequestId: number }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<"success" | "error" | null>(null);
  const supabase = createClient();
  const router = useRouter();

  const handleComplete = async () => {
    // Doppia conferma per sicurezza
    if (!confirm("CONFERMI di aver GIA' inviato i soldi manualmente tramite PayPal? L'operazione NON è reversibile.")) {
      return;
    }

    setLoading(true);

    // Aggiorna lo stato a "completed"
    const { error } = await supabase
      .from('payout_requests')
      .update({
        status: 'completed',
        processed_at: new Date().toISOString(),
        transaction_id: 'MANUAL_PAYPAL_COMPLETION' // Traccia manuale
      })
      .eq('id', payoutRequestId)
      .eq('status', 'pending'); // Sicurezza extra: aggiorna solo se è ancora 'pending'

    if (error) {
      setResult("error");
      console.error("Errore nel segnare come pagato:", error.message);
      alert(`Errore: ${error.message}`);
    } else {
      setResult("success");
      router.refresh(); // Rimuove la riga dalla lista "Da Pagare"
    }

    setLoading(false);
  };

  if (result === "success") {
    // CORREZIONE: Rimosso title="..."
    return <Check className="w-6 h-6 text-green-400" />;
  }

  return (
    <button
      onClick={handleComplete}
      disabled={loading}
      className="bg-secondary text-white font-bold px-4 py-2 rounded-lg hover:bg-secondary/80 transition-all disabled:bg-gray-600 text-sm"
      // Puoi usare l'attributo title HTML sul bottone se vuoi il tooltip
      title="Clicca SOLO dopo aver inviato i soldi su PayPal"
    >
      {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Segna come Pagato"}
    </button>
  );
}