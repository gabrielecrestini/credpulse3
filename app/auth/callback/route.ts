// app/auth/callback/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server' // Importa la versione async

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  // Ignoriamo il parametro 'next' per ora e puntiamo sempre alla dashboard
  const redirectTo = '/dashboard' 

  console.log(`Callback ricevuto. Codice presente: ${!!code}. Origine: ${origin}`); // Log iniziale

  if (code) {
    const supabase = await createClient(); // CORRETTO: await
    console.log('Tentativo di scambiare il codice per la sessione...');
    
    // Scambia il codice per una sessione
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      console.log('Scambio codice riuscito! Reindirizzamento a:', `${origin}${redirectTo}`); // Log successo
      // Login riuscito! Reindirizza esplicitamente alla dashboard
      return NextResponse.redirect(`${origin}${redirectTo}`) 
    }
     // Logga l'errore specifico se lo scambio fallisce
    console.error('Errore durante exchangeCodeForSession:', error.message);
  } else {
    console.error('Codice mancante nel callback di autenticazione.');
  }

  // Se c'è un errore o manca il codice, reindirizza alla home
  console.log('Callback fallito o codice mancante, reindirizzamento alla home:', `${origin}/`); // Log fallback
  return NextResponse.redirect(`${origin}/`) 
}