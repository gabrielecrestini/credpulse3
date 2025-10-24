// app/(dashboard)/support/page.tsx
import { Mail } from "lucide-react";

export default function SupportPage() {
  const supportEmail = "info@credpulse.it";

  return (
    <div className="w-full max-w-2xl mx-auto"> 
      <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-6 md:mb-8">
        Supporto Clienti
      </h1>

      <div className="bg-background-secondary/80 backdrop-blur-md border border-white/10 p-6 sm:p-8 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-4">
          Hai bisogno di aiuto?
        </h2>
        <p className="text-gray-300 mb-6">
          Se hai domande sul funzionamento di CredPulse, sulle missioni, sui prelievi o
          hai riscontrato un problema tecnico, non esitare a contattarci.
        </p>
        <p className="text-gray-300 mb-6">
          Il modo migliore per ricevere assistenza è inviare un&apos;email al nostro team di supporto.
          Descrivi il tuo problema nel dettaglio e ti risponderemo il prima possibile (solitamente entro 24 ore lavorative).
        </p>

        <a 
          href={`mailto:${supportEmail}`}
          className="inline-flex items-center gap-3 bg-primary text-background-main font-bold px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all text-base shadow-lg shadow-primary/30"
        >
          <Mail className="w-5 h-5" />
          Contatta: {supportEmail}
        </a>
      </div>

       <div className="mt-8 text-center text-sm text-gray-500">
            <p>Puoi anche consultare le nostre FAQ (presto disponibili).</p>
       </div>
    </div>
  );
}
