// app/components/MarkAsPaidButton.tsx
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Check, Loader2, AlertTriangle } from "lucide-react"; 

export default function MarkAsPaidButton({ payoutRequestId }: { payoutRequestId: number }) {
  const [loading, setLoading] = useState(false);
  const [requestState, setRequestState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const supabase = createClient();
  const router = useRouter();

  const handleComplete = async () => {
    if (!confirm("CONFERMI di aver GIA' inviato i soldi manualmente tramite PayPal? L'operazione NON è reversibile.")) {
      return;
    }
    setLoading(true); 
    setRequestState('loading');
    setErrorMessage('');

    const { error } = await supabase
      .from('payout_requests')
      .update({
        status: 'completed',
        processed_at: new Date().toISOString(),
        transaction_id: 'MANUAL_PAYPAL_COMPLETION'
      })
      .eq('id', payoutRequestId)
      .eq('status', 'pending'); 

    if (error) {
      setRequestState('error');
      setErrorMessage(error.message);
      console.error("Errore nel segnare come pagato:", error.message);
    } else {
      setRequestState('success');
      setTimeout(() => { router.refresh(); }, 1500); 
    }
    setLoading(false); 
  };

  if (requestState === 'success') {
    return <div className="flex items-center justify-end gap-1 text-green-400 text-sm"><Check className="w-5 h-5" /> Completato</div>;
  }
  if (requestState === 'error') {
     return <div className="flex items-center justify-end gap-1 text-red-400 text-sm" title={errorMessage}><AlertTriangle className="w-5 h-5" /> Errore</div>;
  }

  return (
    <button
      onClick={handleComplete}
      disabled={loading} 
      className="bg-secondary text-white font-bold px-4 py-2 rounded-lg hover:bg-secondary/80 transition-all disabled:bg-gray-600 disabled:opacity-70 text-sm flex items-center justify-center gap-2"
      title="Clicca SOLO dopo aver inviato i soldi su PayPal"
    >
      {requestState === 'loading' ? (
           <><Loader2 className="animate-spin w-4 h-4" /> Attendere...</>
       ) : ( "Segna come Pagato" )}
    </button>
  );
}
