// app/components/ProfileForm.tsx
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2, KeyRound } from "lucide-react"; // Importa la nuova icona

// Tipi per i dati del profilo
type Profile = {
  username: string | null;
  paypal_email: string | null;
};

export default function ProfileForm({ 
  userId,
  userEmail,
  profile 
}: { 
  userId: string;
  userEmail: string;
  profile: Profile;
}) {
  const [username, setUsername] = useState(profile.username || "");
  const [paypalEmail, setPaypalEmail] = useState(profile.paypal_email || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", content: "" });

  // Nuovi stati per il recupero password
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState({ type: "", content: "" });
  
  const supabase = createClient();
  const router = useRouter();

  // Funzione per aggiornare il profilo (invariata)
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", content: "" });

    const { error } = await supabase
      .from("profiles")
      .update({
        username: username || null,
        paypal_email: paypalEmail || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);
    
    if (error) {
      setMessage({ type: "error", content: `Errore: ${error.message}` });
    } else {
      setMessage({ type: "success", content: "Profilo aggiornato con successo!" });
      router.refresh();
    }
    setLoading(false);
  };

  // Nuova funzione per inviare l'email di recupero
  const handlePasswordReset = async () => {
    setResetLoading(true);
    setResetMessage({ type: "", content: "" });

    const { error } = await supabase.auth.resetPasswordForEmail(
      userEmail, // Email dell'utente loggato
      {
        // Link alla pagina che abbiamo appena creato
        redirectTo: `${window.location.origin}/auth/update-password`,
      }
    );

    if (error) {
      setResetMessage({ type: "error", content: error.message });
    } else {
      setResetMessage({ type: "success", content: "Email di recupero inviata! Controlla la tua casella di posta." });
    }
    setResetLoading(false);
  };


  return (
    // Wrapper per contenere entrambe le card
    <div className="max-w-2xl">
      {/* 1. Card Modulo Profilo */}
      <form 
        onSubmit={handleUpdateProfile}
        className="bg-background-secondary/80 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-lg"
      >
        {/* Messaggi */}
        {message.content && (
          <div className={`p-3 rounded-lg mb-4 text-sm ${
            message.type === 'error' ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'
          }`}>
            {message.content}
          </div>
        )}

        {/* Email (non modificabile) */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
            Email Account
          </label>
          <input
            type="email" id="email" value={userEmail} disabled
            className="w-full px-4 py-3 bg-background-main border border-gray-700 rounded-lg text-gray-400 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-1">L'email di login non può essere modificata.</p>
        </div>

        {/* Username */}
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
            Username (Opzionale)
          </label>
          <input
            type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)}
            placeholder="Il tuo nome utente"
            className="w-full px-4 py-3 bg-background-main border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Email PayPal */}
        <div className="mb-6">
          <label htmlFor="paypal" className="block text-sm font-medium text-gray-300 mb-1">
            Email PayPal
          </label>
          <input
            type="email" id="paypal" value={paypalEmail} onChange={(e) => setPaypalEmail(e.target.value)}
            placeholder="la-tua-email@paypal.com"
            className="w-full px-4 py-3 bg-background-main border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
          <p className="text-xs text-gray-500 mt-1">Usata per i prelievi. Assicurati che sia corretta.</p>
        </div>

        {/* Bottone Salva */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-background-main font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center
                     disabled:bg-gray-600
                     hover:enabled:bg-opacity-90"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Salva Modifiche"}
        </button>
      </form>

      {/* 2. Nuova Card Sicurezza (Recupero Password) */}
      <div className="mt-8 bg-background-secondary/80 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-lg">
        <h3 className="text-xl font-heading font-bold text-white mb-2">Sicurezza</h3>
        <p className="text-sm text-gray-400 mb-4">
          Clicca qui per inviare un link di recupero password al tuo indirizzo email.
        </p>

        {/* Messaggio di feedback per il reset */}
        {resetMessage.content && (
          <div className={`p-3 rounded-lg mb-4 text-sm ${
            resetMessage.type === 'error' ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'
          }`}>
            {resetMessage.content}
          </div>
        )}

        <button
          onClick={handlePasswordReset}
          disabled={resetLoading}
          className="flex items-center justify-center gap-2 w-full bg-white/10 border border-white/20 text-white font-semibold py-3 rounded-lg hover:bg-white/20 transition-all disabled:opacity-50"
        >
          {resetLoading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              <KeyRound className="w-5 h-5" />
              Invia link recupero password
            </>
          )}
        </button>
      </div>
    </div>
  );
}