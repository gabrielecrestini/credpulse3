// app/auth/callback/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server' // Importa la versione async

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // Ottieni 'next' dall'URL o usa '/dashboard' come default
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient(); // CORRETTO: await
    // Scambia il codice per una sessione
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Reindirizza all'URL 'next' (o dashboard)
      return NextResponse.redirect(`${origin}${next}`)
    }
     // Logga l'errore se lo scambio fallisce
    console.error('Errore durante exchangeCodeForSession:', error.message);
  } else {
    console.error('Codice mancante nel callback di autenticazione');
  }

  // Se c'è un errore o manca il codice, reindirizza alla pagina di errore auth
  // o semplicemente alla home per semplicità
  return NextResponse.redirect(`${origin}/`) 
}