// supabase/functions/process-payout/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/**
 * Funzione per ottenere un Access Token da PayPal.
 * Questo token scade, quindi ne chiediamo uno nuovo ogni volta.
 */
async function getPayPalAccessToken() {
  const PAYPAL_CLIENT_ID = Deno.env.get("PAYPAL_CLIENT_ID");
  const PAYPAL_CLIENT_SECRET = Deno.env.get("PAYPAL_CLIENT_SECRET");
  const PAYPAL_API_BASE_URL = Deno.env.get("PAYPAL_API_BASE_URL");

  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET || !PAYPAL_API_BASE_URL) {
    throw new Error("Missing PayPal environment variables in Supabase Secrets.");
  }

  // Codifica le credenziali in Base64 per l'autenticazione Basic
  const auth = btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`);

  const response = await fetch(`${PAYPAL_API_BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Basic ${auth}`,
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to get PayPal token: ${errorData.error_description || response.statusText}`);
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * Funzione per inviare un pagamento Payout tramite l'API PayPal.
 */
async function sendPayPalPayout(email: string, amount: string, accessToken: string) {
  const PAYPAL_API_BASE_URL = Deno.env.get("PAYPAL_API_BASE_URL");

  const payoutResponse = await fetch(`${PAYPAL_API_BASE_URL}/v1/payments/payouts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`, // Token dinamico
    },
    body: JSON.stringify({
      sender_batch_header: {
        sender_batch_id: `credpulse_payout_${Date.now()}`,
        email_subject: "Hai ricevuto una ricompensa da CredPulse!",
        recipient_type: "EMAIL",
      },
      items: [
        {
          recipient_type: "EMAIL",
          amount: {
            value: amount, // es. "1.00"
            currency: "USD",
          },
          receiver: email, // L'email PayPal dell'utente
          note: "Grazie per aver usato CredPulse!",
        },
      ],
    }),
  });

  const data = await payoutResponse.json();

  if (!payoutResponse.ok) {
    // Prova a catturare l'errore specifico di PayPal
    const errorDetail = data.details?.[0]?.issue || data.message || "Errore sconosciuto da PayPal";
    throw new Error(errorDetail);
  }

  return data.batch_header.payout_batch_id; // Ritorna l'ID transazione
}

/**
 * Handler principale della Edge Function.
 * Viene triggerato per processare i pagamenti.
 */
serve(async (req) => {
  const supabaseClient = createClient(
    Deno.env.get("PROJECT_URL") ?? "",  // <-- MODIFICATA
    Deno.env.get("SERVICE_ROLE_KEY") ?? "" // <-- MODIFICATA
  );

  // 1. Cerca richieste approvate e non ancora processate
  const { data: requests, error: findError } = await supabaseClient
    .from("payout_requests")
    .select("*")
    .eq("status", "approved") // Processa solo quelle approvate dall'admin
    .limit(10); // Processa 10 alla volta per evitare timeout

  if (findError) {
    console.error("Errore Supabase (findError):", findError.message);
    return new Response(JSON.stringify({ error: findError.message }), { status: 500 });
  }

  if (!requests || requests.length === 0) {
    return new Response(JSON.stringify({ success: true, processed: 0, message: "Nessuna richiesta da processare." }), {
      headers: { "Content-Type": "application/json" },
    });
  }
  
  // 2. Ottieni UN solo token PayPal per processare l'intero batch
  let paypalAccessToken: string;
  try {
    paypalAccessToken = await getPayPalAccessToken();
  } catch (tokenError) {
    console.error("Errore Autenticazione PayPal:", tokenError.message);
    return new Response(JSON.stringify({ error: `PayPal Auth Failed: ${tokenError.message}` }), { status: 500 });
  }

  // 3. Processa ogni richiesta
  let processedCount = 0;
  for (const request of requests) {
    try {
      // 3a. Aggiorna lo stato a 'processing' per evitare doppi invii
      await supabaseClient
        .from("payout_requests")
        .update({ status: "processing" })
        .eq("id", request.id);

      // 3b. Invia i soldi (usando il token ottenuto)
      const transactionId = await sendPayPalPayout(request.paypal_email, request.usd_amount, paypalAccessToken);

      // 3c. Aggiorna a 'completed' con l'ID transazione
      await supabaseClient
        .from("payout_requests")
        .update({ 
          status: "completed", 
          transaction_id: transactionId, 
          processed_at: new Date().toISOString() 
        })
        .eq("id", request.id);
        
      processedCount++;

    } catch (payoutError) {
      console.error(`Errore Payout per request ${request.id}:`, payoutError.message);
      // 3d. Se fallisce, segna come 'failed' e salva il messaggio di errore
      await supabaseClient
        .from("payout_requests")
        .update({ status: "failed", transaction_id: payoutError.message }) // Salva l'errore per il debug
        .eq("id", request.id);
    }
  }

  return new Response(JSON.stringify({ success: true, processed: processedCount, total_found: requests.length }), {
    headers: { "Content-Type": "application/json" },
  });
});