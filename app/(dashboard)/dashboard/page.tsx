// app/(dashboard)/dashboard/page.tsx
import { createClient } from "@/lib/supabase/server"; 
import { CreditCard, Send } from "lucide-react";
import Link from "next/link";

const formatCreds = (creds: number) => { /* ... */ 
  return new Intl.NumberFormat("it-IT").format(creds);
};
const CREDS_TO_USD_RATE = 0.001;

export default async function DashboardPage() {
  const supabase = await createClient(); 

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) { return <div>Utente non trovato. Effettua il login.</div>; }

  const { data: profile } = await supabase.from("profiles").select("email, rwc_balance").eq("id", user.id).single();
  const balance = profile?.rwc_balance ?? 0;
  const balanceInUSD = (balance * CREDS_TO_USD_RATE).toFixed(2);
  const userEmail = profile?.email ?? user?.email ?? "Utente";
  const welcomeName = userEmail.split('@')[0];

  return (
    <div className="w-full">
      {/* Saluto - Adjusted margin */}
      <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-6 md:mb-8"> 
        Ciao, <span className="capitalize">{welcomeName}</span>
      </h1>

      {/* Sezione Wallet */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"> {/* Adjusted gap */}
        
        {/* Card Bilancio */}
        <div className="md:col-span-2 bg-gradient-to-r from-primary/80 to-secondary/80 p-5 sm:p-6 rounded-2xl shadow-2xl text-white transition-transform duration-300 hover:scale-[1.02]">
          <h2 className="text-xs sm:text-sm font-sans uppercase opacity-80 mb-2">
            Bilancio Totale
          </h2>
          <div className="flex items-baseline gap-2 sm:gap-3 mb-1">
            <span className="text-4xl sm:text-5xl font-heading font-bold">
              {formatCreds(balance)}
            </span>
            <span className="text-xl sm:text-2xl font-sans opacity-90">Creds</span>
          </div>
          <div className="text-base sm:text-lg font-sans font-medium opacity-80">
            ~ ${balanceInUSD} USD
          </div>
          {/* Azioni Rapide - Adjusted padding/text size */}
          <div className="mt-6 sm:mt-8 flex flex-wrap gap-3 sm:gap-4"> 
            <Link
              href="/wallet"
              className="flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm text-white font-semibold px-4 py-2 sm:px-6 sm:py-3 rounded-lg text-sm sm:text-base hover:bg-white/30 transition-all"
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              Preleva
            </Link>
            <Link
              href="/missions"
              className="flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm text-white font-semibold px-4 py-2 sm:px-6 sm:py-3 rounded-lg text-sm sm:text-base hover:bg-white/30 transition-all"
            >
              <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
              Guadagna
            </Link>
          </div>
        </div>

        {/* Card Tasso di Conversione */}
        <div className="bg-background-secondary/80 backdrop-blur-md border border-white/10 p-5 sm:p-6 rounded-2xl flex flex-col justify-center items-center transition-all duration-300 hover:scale-[1.02] hover:border-primary/50">
          <h3 className="text-base sm:text-lg font-semibold text-gray-300 mb-2">
            Tasso Conversione
          </h3>
          <div className="text-center">
            <span className="text-2xl sm:text-3xl font-heading font-bold text-primary">1.000</span>
            <span className="text-sm sm:text-lg text-gray-400"> Creds</span>
          </div>
          <div className="text-lg sm:text-xl text-gray-200">=</div>
          <div className="text-center">
            <span className="text-2xl sm:text-3xl font-heading font-bold text-white">$1.00</span>
            <span className="text-sm sm:text-lg text-gray-400"> USD</span>
          </div>
        </div>
      </div>

      {/* Placeholder Missioni - Adjusted margin/padding */}
      <div className="mt-8 md:mt-10"> 
        <h2 className="text-xl sm:text-2xl font-heading font-bold text-white mb-4">
          Missioni Attive
        </h2>
        <div className="bg-background-secondary/80 backdrop-blur-md border border-white/10 p-6 sm:p-10 rounded-2xl text-center transition-all duration-300 hover:border-primary/50">
          <p className="text-gray-400 text-sm sm:text-base"> 
            Non hai missioni attive.
          </p>
          <Link
            href="/missions"
            className="mt-4 inline-block bg-primary text-background-main font-bold px-5 py-2 sm:px-6 rounded-lg text-sm sm:text-base hover:bg-opacity-90 transition-all"
          >
            Esplora Missioni
          </Link>
        </div>
      </div>
    </div>
  );
}