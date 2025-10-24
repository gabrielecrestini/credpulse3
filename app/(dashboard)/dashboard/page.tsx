// app/(dashboard)/dashboard/page.tsx
import { createClient } from "@/lib/supabase/server"; 
import { CreditCard, Send, TrendingUp, Activity, ExternalLink } from "lucide-react"; 
import Link from "next/link";

const formatCreds = (creds: number) => { return new Intl.NumberFormat("it-IT").format(creds ?? 0); };
const CREDS_TO_USD_RATE = 0.001;

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Buongiorno";
  if (hour < 18) return "Buon pomeriggio";
  return "Buonasera";
};

export default async function DashboardPage() {
  const supabase = await createClient(); 
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) { return <div>Utente non trovato.</div>; }

  const { data: profile } = await supabase.from("profiles").select("email, rwc_balance").eq("id", user.id).single();
  const balance = profile?.rwc_balance ?? 0;
  const balanceInUSD = (balance * CREDS_TO_USD_RATE).toFixed(2);
  const userEmail = profile?.email ?? user?.email ?? "Utente";
  const welcomeName = userEmail.split('@')[0];
  const greeting = getGreeting();

  // Dati finti per le "Ultime Attività" (da sostituire con dati reali se li avrai)
  const recentActivity = [
    { id: 1, type: "reward", description: "Creds per Missione 'Esempio'", amount: 10000, date: "2 gg fa" },
    { id: 2, type: "payout", description: "Prelievo su PayPal", amount: -5000, date: "5 gg fa" },
    { id: 3, type: "reward", description: "Bonus Benvenuto", amount: 500, date: "1 sett fa" },
  ];

  return (
    <div className="w-full space-y-8"> 
      <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-6 md:mb-8">
        {greeting}, <span className="capitalize">{welcomeName}</span>!
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">       
        <div className="lg:col-span-2 bg-gradient-to-br from-blue-900/50 via-background-secondary to-purple-900/50 border border-white/10 p-6 rounded-2xl shadow-xl relative overflow-hidden transition-transform duration-300 hover:scale-[1.01]">
           <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/20 rounded-full filter blur-3xl opacity-50 animate-pulse-slow -z-10"></div>
           <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary/20 rounded-full filter blur-3xl opacity-50 animate-pulse-slow animation-delay-2000 -z-10"></div>
           <h2 className="text-sm font-sans uppercase text-gray-400 mb-2">Bilancio Creds</h2>
           <div className="flex items-baseline gap-3 mb-1"><span className="text-5xl lg:text-6xl font-heading font-bold text-white tracking-tighter">{formatCreds(balance)}</span><span className="text-2xl font-sans text-primary opacity-90">CREDS</span></div>
           <div className="text-lg font-sans font-medium text-gray-300 mb-6">≈ ${balanceInUSD} USD</div>
           <div className="flex flex-wrap gap-4">
            <Link href="/wallet" className="flex items-center justify-center gap-2 bg-primary text-background-main font-bold px-6 py-3 rounded-lg text-base hover:bg-opacity-90 transition-all shadow-lg shadow-primary/30"><Send className="w-5 h-5" />Preleva Creds</Link>
            <Link href="/missions" className="flex items-center justify-center gap-2 bg-white/10 text-white font-semibold px-6 py-3 rounded-lg text-base hover:bg-white/20 transition-all border border-white/10"><TrendingUp className="w-5 h-5" />Guadagna di Più</Link>
           </div>
        </div>
        <div className="bg-background-secondary/80 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] hover:border-primary/50">
           <div>
             <h3 className="text-lg font-semibold text-gray-300 mb-2">Valore Creds</h3>
             <div className="flex items-baseline gap-2"><span className="text-2xl font-heading font-bold text-primary">1.000</span><span className="text-base text-gray-400">Creds</span><span className="text-xl text-gray-200 mx-1">=</span><span className="text-2xl font-heading font-bold text-white">$1.00</span><span className="text-base text-gray-400">USD</span></div>
           </div>
           <div className="mt-4 border-t border-white/10 pt-4">
             <h3 className="text-lg font-semibold text-gray-300 mb-2">Info Rapide</h3>
             <p className="text-sm text-gray-400">Prelievo minimo: {formatCreds(5000)} Creds ($5.00).</p>
             <p className="text-sm text-gray-400">Pagamenti via PayPal.</p>
             <Link href="/support" className="text-sm text-primary hover:underline mt-2 inline-flex items-center gap-1">Serve aiuto? <ExternalLink className="w-3 h-3"/></Link>
           </div>
        </div>
      </div>
      <div className="mt-8 md:mt-10"> 
        <h2 className="text-xl sm:text-2xl font-heading font-bold text-white mb-4 flex items-center gap-2"><Activity className="w-6 h-6 text-primary"/> Ultime Attività</h2>
        <div className="bg-background-secondary/80 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-lg space-y-4 max-h-60 overflow-y-auto">
          {recentActivity.length > 0 ? recentActivity.map(activity => ( <div key={activity.id} className="flex justify-between items-center text-sm border-b border-gray-700 pb-2 last:border-b-0"><div><p className={`font-semibold ${activity.type === 'reward' ? 'text-green-400' : 'text-red-400'}`}>{activity.type === 'reward' ? '+' : ''}{formatCreds(activity.amount)} Creds</p><p className="text-gray-400 text-xs">{activity.description}</p></div><p className="text-gray-500 text-xs">{activity.date}</p></div> )) : ( <p className="text-gray-400 text-center py-4">Nessuna attività recente.</p> )}
        </div>
      </div>
    </div>
  );
}
