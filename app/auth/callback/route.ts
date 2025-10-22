import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server' // Rimosso import cookies

export async function GET(request: Request) {
  // Prende l'URL da cui l'utente proviene
  const { searchParams, origin } = new URL(request.url)
  
  // Prende il "code" che Google ci ha inviato
  const code = searchParams.get('code')
  
  // (Opzionale) 'next' è dove l'utente voleva andare prima del login
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    // const cookieStore = cookies() // RIMOSSO
    const supabase = createClient() // CORRETTO
    
    // Scambia il codice per una sessione
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Login riuscito! Reindirizza alla dashboard
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Se c'è un errore o non c'è il codice, rimanda alla home
  console.error('Errore durante il callback di autenticazione');
  return NextResponse.redirect(`${origin}/`)
}