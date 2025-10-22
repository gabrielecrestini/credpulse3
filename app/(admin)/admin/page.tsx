// app/(admin)/admin/page.tsx
import { createClient } from "@/lib/supabase/server";
import ApproveMissionButton from "@/app/components/ApproveMissionButton";
import MarkAsPaidButton from "@/app/components/MarkAsPaidButton"; // Il bottone manuale

// Funzione helper
const formatCreds = (creds: number | null | undefined = 0) => {
  return new Intl.NumberFormat("it-IT").format(creds ?? 0);
};

export default async function AdminPage() {
  const supabase = createClient();

  // 1. Carica missioni da approvare (Status: started)
  // Qui il join restituisce profiles come array
  const { data: missionsToReview, error: missionError } = await supabase
    .from("user_missions")
    .select(`
      id,
      status,
      started_at,
      profiles ( email ), 
      missions ( title )
    `)
    .eq("status", "started")
    .order("started_at", { ascending: true });

  // 2. Carica i prelievi da PAGARE MANUALMENTE (Status: pending)
  // Anche qui profiles è un array
  const { data: payoutsToPay, error: payoutError } = await supabase
    .from("payout_requests")
    .select(`
      id,
      status,
      requested_at,
      rwc_amount,
      usd_amount,
      paypal_email,
      profiles ( email ) 
    `)
    .eq("status", "pending") 
    .order("requested_at", { ascending: true });

  // Gestione errori caricamento
  if (missionError || payoutError) {
    return <div className="text-red-400">Errore nel caricamento dei dati admin: {missionError?.message || payoutError?.message}</div>;
  }

  return (
    <div className="w-full space-y-10">
      
      {/* SEZIONE 1: MISSIONI (Da approvare per i Creds) */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-white mb-8">
          ADMIN: MISSIONI DA APPROVARE ({missionsToReview?.length ?? 0})
        </h1>
        <div className="bg-background-secondary/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg overflow-x-auto">
          <table className="w-full text-left min-w-[600px]"> 
            <thead className="border-b border-white/10">
              <tr>
                <th className="p-4">Utente</th>
                <th className="p-4">Missione</th>
                <th className="p-4">Data Inizio</th>
                <th className="p-4 text-right">Azione</th>
              </tr>
            </thead>
            <tbody>
              {missionsToReview && missionsToReview.length > 0 ? (
                missionsToReview.map((item) => (
                  <tr key={`mission-${item.id}`} className="border-b border-gray-700 hover:bg-white/5">
                    {/* CORREZIONE QUI */}
                    <td className="p-4 text-gray-300">{item.profiles?.[0]?.email ?? 'N/A'}</td> 
                    <td className="p-4 text-white font-semibold">{item.missions?.title ?? 'N/A'}</td>
                    <td className="p-4 text-gray-400">
                      {new Date(item.started_at).toLocaleString("it-IT")}
                    </td>
                    <td className="p-4 text-right">
                      <ApproveMissionButton userMissionId={item.id} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-gray-400">
                    Nessuna missione da approvare.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <hr className="border-white/10" />

      {/* SEZIONE 2: PAGAMENTI MANUALI (La tua TO-DO List) */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-white mb-8">
          ADMIN: PRELIEVI DA PAGARE MANUALMENTE ({payoutsToPay?.length ?? 0})
        </h1>
        <p className="text-gray-400 mb-4 -mt-6 text-sm">
          Questa lista mostra le richieste in attesa. Invia i soldi tramite PayPal, poi clicca "Segna come Pagato".
        </p>
        <div className="bg-background-secondary/80 backdrop-blur-md border border-secondary/50 rounded-2xl shadow-lg overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="border-b border-white/10 bg-secondary/10">
              <tr>
                <th className="p-4">Utente</th>
                <th className="p-4">Email PayPal</th>
                <th className="p-4">Importo USD</th>
                <th className="p-4">Data Richiesta</th>
                <th className="p-4 text-right">Azione</th>
              </tr>
            </thead>
            <tbody>
              {payoutsToPay && payoutsToPay.length > 0 ? (
                payoutsToPay.map((item) => (
                  <tr key={`payout-${item.id}`} className="border-b border-gray-700 hover:bg-white/5">
                    {/* CORREZIONE QUI */}
                    <td className="p-4 text-gray-300">{item.profiles?.[0]?.email ?? 'N/A'}</td> 
                    <td className="p-4 text-white font-semibold">{item.paypal_email}</td>
                    <td className="p-4 text-secondary font-bold">
                      ${item.usd_amount} <span className="text-xs text-gray-400">({formatCreds(item.rwc_amount)} Creds)</span>
                    </td>
                    <td className="p-4 text-gray-400">
                      {new Date(item.requested_at).toLocaleString("it-IT")}
                    </td>
                    <td className="p-4 text-right space-y-1">
                      <a 
                         href={`https://www.paypal.com/myaccount/transfer/send`} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="text-primary hover:text-white underline text-sm block"
                      >
                         Invia su PayPal (Manuale)
                      </a>
                      <MarkAsPaidButton payoutRequestId={item.id} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-gray-400">Nessun pagamento in attesa.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}