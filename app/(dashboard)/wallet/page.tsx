// app/(dashboard)/wallet/page.tsx
import { createClient } from "@/lib/supabase/server"; 
import PayoutForm from "@/app/components/PayoutForm";
import { CheckCircle, Clock, XCircle, Loader2 } from "lucide-react";

const formatCreds = (creds: number) => { return new Intl.NumberFormat("it-IT").format(creds); };
const CREDS_TO_USD_RATE = 0.001;

const StatusIcon = ({ status }: { status: string }) => { 
  switch (status) {
    case "completed": return <CheckCircle className="w-5 h-5 text-green-400" />;
    case "pending": return <Clock className="w-5 h-5 text-yellow-400" />;
    case "processing": return <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />; // Se implementerai stati futuri
    case "failed": return <XCircle className="w-5 h-5 text-red-400" />; // Se implementerai stati futuri
    default: return null;
  }
};

export default async function WalletPage() {
  const supabase = await createClient(); // CORRETTO: await

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase.from("profiles").select("rwc_balance, paypal_email").eq("id", user.id).single();
  const balance = profile?.rwc_balance ?? 0;
  const balanceInUSD = (balance * CREDS_TO_USD_RATE).toFixed(2);
  const { data: payouts, error: payoutError } = await supabase.from("payout_requests").select("*").eq("user_id", user.id).order("requested_at", { ascending: false });

  if (payoutError) {
      console.error("Errore caricamento prelievi:", payoutError);
      // Mostra un errore ma non bloccare la pagina
  }

  return (
    <div className="w-full">
      <h1 className="text-3xl font-heading font-bold text-white mb-8">
        Il Tuo Wallet
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonna Sinistra: Form e Saldo */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Card Saldo */}
          <div className="bg-background-secondary/80 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-lg transition-transform duration-300 hover:scale-[1.02]">
            <h2 className="text-sm font-sans uppercase text-gray-400 mb-2">
              Saldo Disponibile
            </h2>
            <div className="flex items-baseline gap-3 mb-1">
              <span className="text-5xl font-heading font-bold text-primary">
                {formatCreds(balance)}
              </span>
              <span className="text-2xl font-sans opacity-90 text-white">Creds</span>
            </div>
            <div className="text-lg font-sans font-medium text-gray-300">
              ~ ${balanceInUSD} USD
            </div>
          </div>
          
          {/* Form Prelievo (Componente Client) */}
          <PayoutForm 
            userId={user.id}
            userPayPalEmail={profile?.paypal_email}
            currentBalance={balance}
          />
        </div>

        {/* Colonna Destra: Storico Prelievi */}
        <div className="lg:col-span-1">
          <div className="bg-background-secondary/80 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-lg h-full">
             <h3 className="text-xl font-heading font-bold text-white mb-6">
               Storico Prelievi
             </h3>
             {payoutError && <p className="text-red-400 text-sm">Errore caricamento storico.</p>}
             {payouts && payouts.length > 0 ? (
               <ul className="space-y-4 max-h-[600px] overflow-y-auto">
                 {payouts.map(p => (
                   <li key={p.id} className="flex items-center justify-between p-4 bg-background-main rounded-lg border border-gray-700">
                     <div className="flex items-center gap-3">
                       <StatusIcon status={p.status} />
                       <div>
                         <p className="font-semibold text-white">
                           ${p.usd_amount}
                         </p>
                         <p className="text-sm text-gray-400">
                           {formatCreds(p.rwc_amount)} Creds
                         </p>
                       </div>
                     </div>
                     <div className="text-right">
                       <p className="text-sm text-gray-300 capitalize">{p.status}</p>
                       <p className="text-xs text-gray-500">
                         {new Date(p.requested_at).toLocaleDateString("it-IT", { day: '2-digit', month: 'short', year: 'numeric'})}
                       </p>
                     </div>
                   </li>
                 ))}
               </ul>
             ) : ( 
               <p className="text-gray-400 text-sm text-center mt-10">
                 {payoutError ? '' : 'Nessuna richiesta di prelievo trovata.'}
               </p> 
             )}
          </div>
        </div>
      </div>
    </div>
  );
}