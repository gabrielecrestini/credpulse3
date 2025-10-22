// app/auth/update-password/page.tsx
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import Link from "next/link";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", content: "" });
  const supabase = createClient();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage({ type: "error", content: "Le password non corrispondono." });
      return;
    }
    if (password.length < 6) {
        setMessage({ type: "error", content: "La password deve essere di almeno 6 caratteri." });
        return;
    }

    setLoading(true);
    setMessage({ type: "", content: "" });

    // Supabase rileva automaticamente il token di reset dall'URL
    // quando l'utente arriva da un link email.
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMessage({ type: "error", content: `Errore: ${error.message}` });
    } else {
      setMessage({ type: "success", content: "Password aggiornata con successo! Sarai reindirizzato..." });
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Effetti sfondo */}
      <div className="absolute top-1/4 left-1_4 w-72 h-72 bg-primary/20 rounded-full filter blur-3xl opacity-40 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1_4 w-72 h-72 bg-secondary/20 rounded-full filter blur-3xl opacity-40 animate-pulse animation-delay-3000"></div>

      <div className="w-full max-w-md bg-background-secondary/80 backdrop-blur-md border border-white/10 rounded-2xl p-8 z-10 shadow-2xl">
        <h2 className="text-3xl font-heading font-bold text-center text-white mb-4">
          Crea Nuova Password
        </h2>
        <p className="text-center text-gray-400 mb-6">
          Inserisci la tua nuova password sicura.
        </p>

        {/* Messaggi */}
        {message.content && (
          <div className={`p-3 rounded-lg mb-4 text-sm ${
            message.type === 'error' ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'
          }`}>
            {message.content}
          </div>
        )}

        {message.type !== 'success' ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nuova Password */}
            <div className="relative">
              <label htmlFor="password_new" className="block text-sm font-medium text-gray-300 mb-1">Nuova Password</label>
              <Lock className="absolute left-3 top-10 w-5 h-5 text-gray-500" />
              <input
                type="password" id="password_new" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-background-main border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            {/* Conferma Password */}
            <div className="relative">
              <label htmlFor="password_confirm" className="block text-sm font-medium text-gray-300 mb-1">Conferma Password</label>
              <Lock className="absolute left-3 top-10 w-5 h-5 text-gray-500" />
              <input
                type="password" id="password_confirm" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-background-main border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-background-main font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-all flex items-center justify-center"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Salva Nuova Password'}
            </button>
          </form>
        ) : (
          <Link href="/dashboard" className="w-full block text-center bg-primary text-background-main font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-all">
            Vai alla Dashboard
          </Link>
        )}
      </div>
    </div>
  );
}