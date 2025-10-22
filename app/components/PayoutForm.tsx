"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2, Send } from "lucide-react";

// Tasso di conversione
const CREDS_TO_USD_RATE = 0.001; // 1000 Creds = $1
const MIN_PAYOUT_CREDS = 5000; // Minimo 5000 Creds ($5)

export default function PayoutForm({ 
  userId, 
  userPayPalEmail, 
  currentBalance 
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

    // Validazione
    if (credsToWithdraw < MIN_PAYOUT_CREDS) {
      setMessage({ type: "error", content: `L'importo minimo per il prelievo è ${MIN_PAYOUT_CREDS} Creds.` });
      setLoading(false);
      return;
    }
    if (credsToWithdraw > currentBalance) {
      setMessage({ type: "error", content: "Saldo insufficiente." });
      setLoading(false);
      return;
    }
    if (!paypalEmail) {
      setMessage({ type: "error", content: "Per favore, inserisci la tua email PayPal." });
      setLoading(false);
      return;
    }

    // 1. Inserisci la richiesta di prelievo
    const { error: requestError } = await supabase
      .from("payout_requests")
      .insert({
        user_id: userId,
        rwc_amount: credsToWithdraw,
        usd_amount: parseFloat(usdValue),
        method: "paypal",
        paypal_email: paypalEmail,
        status: "pending", // L'admin dovrà approvarla
      });

    if (requestError) {
      setMessage({ type: "error", content: `Errore: ${requestError.message}` });
      setLoading(false);
      return;
    }

    // 2. Sottrai i creds dal bilancio dell'utente
    const newBalance = currentBalance - credsToWithdraw;
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ 
        rwc_balance: newBalance,
        paypal_email: paypalEmail // Salva l'email PayPal per usi futuri
      })
      .eq("id", userId);

    if (profileError) {
      // Qui dovremmo gestire un rollback, ma per ora notifichiamo solo
      setMessage({ type: "error", content: `Errore nell'aggiornare il saldo: ${profileError.message}` });
      setLoading(false);
      return;
    }

    // Successo
    setLoading(false);
    setMessage({ type: "success", content: "Richiesta di prelievo inviata con successo! Sarà processata entro 48 ore." });
    setCredsToWithdraw(MIN_PAYOUT_CREDS);
    router.refresh(); // Aggiorna la pagina per mostrare il nuovo saldo e la richiesta
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
          Creds da Prelevare (Min. {MIN_PAYOUT_CREDS})
        </label>
        <input
          type="number"
          id="creds"
          value={credsToWithdraw}
          onChange={(e) => setCredsToWithdraw(Math.max(0, parseInt(e.target.value) || 0))}
          step={100}
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
      {currentBalance < MIN_PAYOUT_CREDS && (
        <p className="text-center text-sm text-red-400 mt-2">
          Devi avere almeno {MIN_PAYOUT_CREDS} Creds per prelevare.
        </p>
      )}
    </form>
  );
}