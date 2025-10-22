// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

// Definiamo una funzione per creare il client
export function createClient() {
  // createBrowserClient è il nuovo standard per App Router
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}