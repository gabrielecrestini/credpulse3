import { createClient } from "@/lib/supabase/server"; // Rimosso import cookies
import { CreditCard, Send } from "lucide-react";
import Link from "next/link";

// Funzione per formattare i numeri
const formatCreds = (creds: number) => {
  return new Intl.NumberFormat("it-IT").format(creds);
};

// Tasso di conversione
const CREDS_TO_USD_RATE = 0.001; // 1000 Creds = $1

export default async function DashboardPage() {
  // const cookieStore = cookies(); // RIMOSSO
  const supabase = createClient(); // CORRETTO

  // Prendiamo l'ID utente
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Prendiamo il profilo utente dal DB per il saldo
  const { data: profile } = await supabase
    .from("profiles")
    .select("email, rwc_balance")
    .eq("id", user!.id)
    .single();

  const balance = profile?.rwc_balance ?? 0;
  const balanceInUSD = (balance * CREDS_TO_USD_RATE).toFixed(2);
  const userEmail = profile?.email ?? user?.email ?? "Utente";
  const welcomeName = userEmail.split('@')[0]; // Mostra solo la parte prima della @

  return (
    <div className="w-full">
      {/* Saluto */}
      <h1 className="text-3xl font-heading font-bold text-white mb-8">
        Ciao, <span className="capitalize">{welcomeName}</span>
      </h1>

      {/* Sezione Wallet */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card Bilancio */}
        <div className="md:col-span-2 bg-gradient-to-r from-primary/80 to-secondary/80 p-6 rounded-2xl shadow-2xl text-white">
          <h2 className="text-sm font-sans uppercase opacity-80 mb-2">
            Bilancio Totale
          </h2>
          <div className="flex items-baseline gap-3 mb-1">
            <span className="text-5xl font-heading font-bold">
              {formatCreds(balance)}
            </span>
            <span className="text-2xl font-sans opacity-90">Creds</span>
          </div>
          <div className="text-lg font-sans font-medium opacity-80">
            ~ ${balanceInUSD} USD
          </div>

          {/* Azioni Rapide */}
          <div className="mt-8 flex gap-4">
            <Link
              href="/wallet"
              className="flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/30 transition-all"
            >
              <Send className="w-5 h-5" />
              Preleva
            </Link>
            <Link
              href="/missions"
              className="flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/30 transition-all"
            >
              <CreditCard className="w-5 h-5" />
              Guadagna di più
            </Link>
          </div>
        </div>

        {/* Card Tasso di Conversione (Bonus) */}
        <div className="bg-background-secondary/80 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex flex-col justify-center items-center">
          <h3 className="text-lg font-semibold text-gray-300 mb-2">
            Tasso di Conversione
          </h3>
          <div className="text-center">
            <span className="text-3xl font-heading font-bold text-primary">
              1.000
            </span>
            <span className="text-lg text-gray-400"> Creds</span>
          </div>
          <div className="text-xl text-gray-200">=</div>
          <div className="text-center">
            <span className="text-3xl font-heading font-bold text-white">
              $1.00
            </span>
            <span className="text-lg text-gray-400"> USD</span>
          </div>
        </div>
      </div>

      {/* Placeholder per le Missioni Future */}
      <div className="mt-10">
        <h2 className="text-2xl font-heading font-bold text-white mb-4">
          Le tue Missioni Attive
        </h2>
        <div className="bg-background-secondary/80 backdrop-blur-md border border-white/10 p-10 rounded-2xl text-center">
          <p className="text-gray-400">
            Non hai missioni attive.
          </p>
          <Link
            href="/missions"
            className="mt-4 inline-block bg-primary text-background-main font-bold px-6 py-2 rounded-lg hover:bg-opacity-90 transition-all"
          >
            Esplora le Missioni
          </Link>
        </div>
      </div>
    </div>
  );
}