// app/components/AuthModal.tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { X, Loader2, Mail, Lock, ChromeIcon } from "lucide-react"; // Importa le nuove icone

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, initialTab }: AuthModalProps) {
  const [tab, setTab] = useState(initialTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  
  const supabase = createClient();

  useEffect(() => {
    if (isOpen) {
      setTab(initialTab);
      setMessage("");
    }
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  const handleOAuthLogin = async (provider: 'google') => { // Rimosso 'twitter'
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
    setLoading(false);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (tab === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message);
      else {
        setMessage("Login effettuato! Ricarico...");
        window.location.reload(); 
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      // Modificato per dare un feedback più chiaro in entrambi i casi
      if (error) {
        setMessage(error.message);
      } else {
        setMessage("Registrazione completata! Controlla la tua email per la conferma.");
      }
    }
    setLoading(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-background-secondary/80 backdrop-blur-md border border-white/10 rounded-2xl p-8 z-10 shadow-2xl m-4"
        onClick={(e) => e.stopPropagation()} 
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex justify-center gap-6 mb-6 border-b border-white/10">
          <button
            onClick={() => setTab("login")}
            className={`pb-3 font-semibold ${tab === 'login' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}
          >
            LOGIN
          </button>
          <button
            onClick={() => setTab("register")}
            className={`pb-3 font-semibold ${tab === 'register' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}
          >
            REGISTRATI
          </button>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          
          {/* Campo Email con Icona */}
          <div className="relative">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <Mail className="absolute left-3 top-10 w-5 h-5 text-gray-500" />
            <input
              type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full pl-10 pr-4 py-3 bg-background-main border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Campo Password con Icona */}
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <Lock className="absolute left-3 top-10 w-5 h-5 text-gray-500" />
            <input
              type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-3 bg-background-main border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-background-main font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-all flex items-center justify-center"
          >
            {loading ? <Loader2 className="animate-spin" /> : (tab === 'login' ? 'Accedi' : 'Crea Account')}
          </button>
        </form>

        {message && (
          <p className="text-center text-sm text-secondary mt-4">{message}</p>
        )}

        <div className="flex items-center my-6">
          <hr className="flex-grow border-t border-gray-700" />
          <span className="px-4 text-gray-500 text-sm">OPPURE</span>
          <hr className="flex-grow border-t border-gray-700" />
        </div>
        
        {/* Bottone Social (Solo Google) */}
        <div className="w-full">
          <button
            onClick={() => handleOAuthLogin('google')} disabled={loading}
            className="flex items-center justify-center gap-3 w-full bg-white/10 border border-white/20 text-white font-semibold py-3 rounded-lg hover:bg-white/20 transition-all"
          >
            <ChromeIcon className="w-5 h-5" />
            Continua con Google
          </button>
        </div>
      </div>
    </div>
  );
}