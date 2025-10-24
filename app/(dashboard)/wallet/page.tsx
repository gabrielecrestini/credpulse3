// app/(dashboard)/wallet/page.tsx
import { createClient } from "@/lib/supabase/server"; 
import PayoutForm from "@/app/components/PayoutForm";
import { CheckCircle, Clock, XCircle, Loader2 } from "lucide-react";

const formatCreds = (creds: number) => { return new Intl.NumberFormat("it-IT").format(creds ?? 0); };
const CREDS_TO_USD_RATE = 0.001;

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case "completed": return <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-xs font-medium"><CheckCircle className="w-3 h-3" /> Completato</div>;
    case "pending": return <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 text-xs font-medium"><Clock className="w-3 h-3" /> In Attesa</div>;
    case "processing": return <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium"><Loader2 className="w-3 h-3 animate-spin" /> In Lavorazione</div>;
    case "failed": return <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 text-xs font-medium"><XCircle className="w-3 h-3" /> Fallito</div>;
    default: return <div className="px-2 py-0.5 rounded-full bg-gray-500/10 text-gray-400 text-xs font-medium">{status}</div>;
  }
};


export default async function WalletPage() {
  const supabase = await createClient(); 

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase.from("profiles").select("rwc_balance, paypal_email").eq("id", user.id).single();
  const balance = profile?.rwc_balance ?? 0;
  const balanceInUSD = (balance * CREDS_TO_USD_RATE).toFixed(2);
  const { data: payouts, error: payoutError } = await supabase.from("payout_requests").select("*").eq("user_id", user.id).order("requested_at", { ascending: false });

  return (
    <div className="w-full">
      <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-6 md:mb-8">
        Wallet e Prelievi
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">       
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-background-secondary/80 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-lg transition-transform duration-300 hover:scale-[1.01]">
            <h2 className="text-sm font-sans uppercase text-gray-400 mb-2">Saldo Disponibile</h2>
            <div className="flex items-baseline gap-3 mb-1"><span className="text-5xl font-heading font-bold text-primary">{formatCreds(balance)}</span><span className="text-2xl font-sans opacity-90 text-white">Creds</span></div>
            <div className="text-lg font-sans font-medium text-gray-300">~ ${balanceInUSD} USD</div>
          </div>
          <PayoutForm userId={user.id} userPayPalEmail={profile?.paypal_email} currentBalance={balance} />
        </div>
        <div className="lg:col-span-1">
          <div className="bg-background-secondary/80 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-lg h-full">
             <h3 className="text-xl font-heading font-bold text-white mb-6">
               Storico Prelievi
             </h3>
             {payoutError && <p className="text-red-400 text-sm">Errore caricamento storico.</p>}
             {payouts && payouts.length > 0 ? (
               <ul className="space-y-3 -mx-2 max-h-[600px] overflow-y-auto px-2"> 
                 {payouts.map(p => (
                   <li key={p.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-background-main rounded-lg border border-gray-700/50 hover:border-primary/30 transition-colors duration-200">
                     <div className="flex items-center gap-3 mb-2 sm:mb-0">
                       <div><p className="font-semibold text-white text-lg">${p.usd_amount}</p><p className="text-sm text-gray-400">{formatCreds(p.rwc_amount)} Creds via PayPal</p></div>
                     </div>
                     <div className="flex flex-col sm:items-end space-y-1">
                        <StatusBadge status={p.status} />
                       <p className="text-xs text-gray-500">{new Date(p.requested_at).toLocaleDateString("it-IT", { day: '2-digit', month: 'short', year: 'numeric', hour:'2-digit', minute:'2-digit'})}</p>
                     </div>
                   </li>
                 ))}
               </ul>
             ) : ( <p className="text-gray-400 text-sm text-center mt-10">{payoutError ? '' : 'Nessuna richiesta di prelievo trovata.'}</p> )}
          </div>
        </div>
      </div>
    </div>
  );
}
