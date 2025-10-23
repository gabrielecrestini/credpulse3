// app/components/AuthModal.tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { X, Loader2, Mail, Lock, ChromeIcon } from "lucide-react";
import Link from "next/link"; // Make sure Link is imported

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, initialTab }: AuthModalProps) {
  const [tab, setTab] = useState(initialTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ type: "", content: "" }); // Use object for type and content
  const [loading, setLoading] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  // Update tab if initialTab prop changes while modal is open
  useEffect(() => {
    if (isOpen) {
      setTab(initialTab);
      setMessage({ type: "", content: "" }); // Reset messages when tab changes
      setEmail(""); // Reset fields
      setPassword(""); // Reset fields
    }
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  // Handler for Social Login (Google)
  const handleOAuthLogin = async (provider: 'google') => { // Only Google
    setLoading(true);
    setMessage({ type: "", content: "" });
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        // Redirects to the callback handler, which then redirects to dashboard
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
    if (error) {
        setMessage({ type: "error", content: `Errore login Google: ${error.message}` });
        setLoading(false);
    }
    // No need to setLoading(false) here, the page will redirect
  };

  // Handler for Email/Password Login & Registration
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", content: "" });

    if (tab === "login") {
      // Login logic
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setMessage({ type: "error", content: error.message });
      } else {
        setMessage({ type: "success", content: "Login effettuato! Reindirizzamento..." });
        // Redirect to dashboard after successful login
        // Use router.push for client-side navigation instead of full reload
        router.push('/dashboard');
        // You might still want router.refresh() if server components need updated session data immediately
        router.refresh();
      }
    } else {
      // Registration logic
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // **HERE'S THE ADDITION:**
          // Tell Supabase where to redirect the user AFTER they click the confirmation link
          emailRedirectTo: `${location.origin}/dashboard`
        }
      });

      if (error) {
        setMessage({ type: "error", content: error.message });
      } else if (data.user && data.user.identities?.length === 0) {
        // Handle case where user might already exist but is unconfirmed
         setMessage({ type: "error", content: "Utente già esistente ma non confermato. Controlla la tua email o prova a fare login." });
      }
       else if (data.session) {
         // User is created AND automatically logged in (if email confirmation is disabled)
         setMessage({ type: "success", content: "Registrazione completata! Reindirizzamento..." });
         router.push('/dashboard');
         router.refresh();
       }
      else {
        // Standard case: User created, needs email confirmation
        setMessage({ type: "success", content: "Registrazione completata! Controlla la tua email per il link di conferma." });
        // Optionally clear fields or close modal after signup request
        // setEmail("");
        // setPassword("");
        // onClose();
      }
    }
    setLoading(false);
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300"
      onClick={onClose}
    >
      {/* Modal Card */}
      <div
        className="relative w-full max-w-md bg-background-secondary/80 backdrop-blur-md border border-white/10 rounded-2xl p-8 z-10 shadow-2xl m-4 transition-transform duration-300 scale-95 animate-scale-in" // Added animation
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'scaleIn 0.3s ease-out forwards' }} // Simple scale-in animation
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Chiudi modale"
        >
          <X size={20} />
        </button>

        {/* Tabs */}
        <div className="flex justify-center gap-6 mb-6 border-b border-white/10">
          <button
            onClick={() => setTab("login")}
            className={`pb-3 font-semibold transition-colors duration-200 ${tab === 'login' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-gray-200'}`}
          >
            LOGIN
          </button>
          <button
            onClick={() => setTab("register")}
            className={`pb-3 font-semibold transition-colors duration-200 ${tab === 'register' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-gray-200'}`}
          >
            REGISTRATI
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleAuth} className="space-y-4">
          {/* Email Field */}
          <div className="relative">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <Mail className="absolute left-3 top-10 w-5 h-5 text-gray-500 pointer-events-none" /> {/* Added pointer-events-none */}
            <input
              type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com" required // Added required
              className="w-full pl-10 pr-4 py-3 bg-background-main border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <Lock className="absolute left-3 top-10 w-5 h-5 text-gray-500 pointer-events-none" /> {/* Added pointer-events-none */}
            <input
              type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" required minLength={6} // Added required and minLength
              className="w-full pl-10 pr-4 py-3 bg-background-main border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-background-main font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed" // Added disabled styles
          >
            {loading ? <Loader2 className="animate-spin" /> : (tab === 'login' ? 'Accedi' : 'Crea Account')}
          </button>
        </form>

        {/* Message Area */}
        {message.content && (
          <p className={`text-center text-sm mt-4 px-2 ${ message.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>
             {message.content}
          </p>
        )}

        {/* Divider */}
        <div className="flex items-center my-6">
          <hr className="flex-grow border-t border-gray-700" />
          <span className="px-4 text-gray-500 text-sm font-medium">OPPURE</span>
          <hr className="flex-grow border-t border-gray-700" />
        </div>

        {/* Social Login (Only Google) */}
        <div className="w-full">
          <button
            onClick={() => handleOAuthLogin('google')} disabled={loading}
            className="flex items-center justify-center gap-3 w-full bg-white/10 border border-white/20 text-white font-semibold py-3 rounded-lg hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed" // Added disabled styles
          >
            <ChromeIcon className="w-5 h-5" />
            Continua con Google
          </button>
        </div>

         {/* Legal Text with Links */}
         <p className="text-center text-xs text-gray-500 mt-6">
           Creando un account, accetti i nostri{" "}
           <Link href="/terms" target="_blank" className="underline hover:text-primary transition-colors">
             Termini di Servizio
           </Link>{" "}
           e la nostra{" "}
           <Link href="/privacy" target="_blank" className="underline hover:text-primary transition-colors">
             Privacy Policy
           </Link>
           .
         </p>

      </div>
      {/* Simple CSS Animation (add this to globals.css if preferred) */}
      <style jsx global>{`
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scaleIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}