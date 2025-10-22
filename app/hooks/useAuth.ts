// app/hooks/useAuth.ts
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

// Leggiamo l'ID admin dalle variabili d'ambiente
const ADMIN_ID = process.env.NEXT_PUBLIC_ADMIN_USER_ID;

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    
    // Funzione per controllare l'utente al caricamento
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // Utente non loggato, reindirizza alla home
        router.push('/');
      } else {
        // Utente loggato, imposta gli stati
        setUser(user);
        setIsAdmin(user.id === ADMIN_ID);
      }
      setLoading(false);
    };

    checkUser();

    // Listener per i cambi di stato (es. logout)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        router.push('/');
      } else if (event === 'SIGNED_IN') {
        const newUser = session?.user ?? null;
        setUser(newUser);
        setIsAdmin(newUser?.id === ADMIN_ID);
      }
    });

    // Pulisci il listener quando il componente viene smontato
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [router]);

  return { user, isAdmin, loading };
}