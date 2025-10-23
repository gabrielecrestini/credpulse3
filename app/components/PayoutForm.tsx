// app/components/PayoutForm.tsx
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2, Send } from "lucide-react";

// Tasso di conversione
const CREDS_TO_USD_RATE = 0.001;
const MIN_PAYOUT_CREDS = 5000;

// --- AGGIUNTA LA FUNZIONE MANCANTE QUI ---
const formatCreds = (creds: number) => {
  // Handles potential null/undefined by defaulting to 0
  const numCreds = creds ?? 0;
  return new Intl.NumberFormat("it-IT").format(numCreds);
};
// --- FINE AGGIUNTA ---

export default function PayoutForm({
  userId,
  userPayPalEmail,
  currentBalance // Questo ora serve solo per la UI, non per la logica
}: {
  userId: string;
  userPayPalEmail: string | null;
  currentBalance: number;
}) {
  const [credsToWithdraw, setCredsToWithdraw] = useState(MIN_PAYOUT_CREDS);
  const [paypalEmail, setPaypalEmail] = useState(userPayPalEmail || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", content: "" });

  const supabase = createClient();
  const router = useRouter();

  const usdValue = (credsToWithdraw * CREDS_TO_USD_RATE).toFixed(2);

  const handlePayoutRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", content: "" });

    // Validazione base lato client (la vera validazione è nel backend)
    if (credsToWithdraw < MIN_PAYOUT_CREDS) {
      setMessage({ type: "error", content: `L'importo minimo per il prelievo è ${formatCreds(MIN_PAYOUT_CREDS)} Creds.` }); // Usa formatCreds qui
      setLoading(false);
      return;
    }
     if (!paypalEmail) {
      setMessage({ type: "error", content: "Per favore, inserisci la tua email PayPal." });
      setLoading(false);
      return;
    }

    // --- Chiama la funzione RPC ---
    const { data, error } = await supabase.rpc('request_payout', {
      p_user_id: userId,
      p_creds_amount: credsToWithdraw,
      p_paypal_email: paypalEmail
    });
    // ------------------------------------------

    if (error || (data && !data.success)) {
      const errorMessage = error?.message || data?.message || "Errore sconosciuto durante la richiesta.";
      setMessage({ type: "error", content: errorMessage });
      setLoading(false);
    } else {
      setLoading(false);
      setMessage({ type: "success", content: data.message || "Richiesta inviata!" });
      setCredsToWithdraw(MIN_PAYOUT_CREDS); // Resetta il form
      router.refresh();
    }
  };

  return (
    <form
      onSubmit={handlePayoutRequest}
      className="bg-background-secondary/80 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-lg"
    >
      <h3 className="text-xl font-heading font-bold text-white mb-6">
        Richiedi un Prelievo
      </h3>

      {/* Messaggi */}
      {message.content && (
        <div className={`p-3 rounded-lg mb-4 text-sm ${
          message.type === 'error' ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'
        }`}>
          {message.content}
        </div>
      )}

      {/* Importo Creds */}
      <div className="mb-4">
        <label htmlFor="creds" className="block text-sm font-medium text-gray-300 mb-1">
          {/* Usa formatCreds qui */}
          Creds da Prelevare (Min. {formatCreds(MIN_PAYOUT_CREDS)})
        </label>
        <input
          type="number"
          id="creds"
          value={credsToWithdraw}
          onChange={(e) => setCredsToWithdraw(Math.max(0, parseInt(e.target.value) || 0))}
          step={100}
          min={MIN_PAYOUT_CREDS}
          className="w-full px-4 py-3 bg-background-main border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
        <p className="text-sm text-primary mt-1">
          Valore: ${usdValue} USD
        </p>
      </div>

      {/* Email PayPal */}
      <div className="mb-6">
        <label htmlFor="paypal" className="block text-sm font-medium text-gray-300 mb-1">
          Tua Email PayPal
        </label>
        <input
          type="email"
          id="paypal"
          value={paypalEmail}
          onChange={(e) => setPaypalEmail(e.target.value)}
          placeholder="la-tua-email@paypal.com"
          required
          className="w-full px-4 py-3 bg-background-main border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Bottone */}
      <button
        type="submit"
        disabled={loading || currentBalance < MIN_PAYOUT_CREDS}
        className="w-full bg-primary text-background-main font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center
                   disabled:bg-gray-600 disabled:cursor-not-allowed
                   hover:enabled:bg-opacity-90"
      >
        {loading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <>
            <Send className="w-5 h-5 mr-2" />
            Richiedi ${usdValue}
          </>
        )}
      </button>
      {/* Usa formatCreds qui */}
      {currentBalance < MIN_PAYOUT_CREDS && !loading && (
        <p className="text-center text-sm text-red-400 mt-2">
          Devi avere almeno {formatCreds(MIN_PAYOUT_CREDS)} Creds per prelevare.
        </p>
      )}
    </form>
  );
}