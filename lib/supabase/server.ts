import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Non prendiamo argomenti, chiamiamo cookies() all'interno.
export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            // Qui Next.js si lamenta se chiamato in modo sincrono. 
            // Ma nei Server Component che abbiamo, questo è l'approccio standard.
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Il try/catch è una misura per ignorare l'errore 
            // in Server Component che non dovrebbero settare cookies.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Ignora errore.
          }
        },
      },
    }
  )
}