// app/(dashboard)/profile/page.tsx
import { createClient } from "@/lib/supabase/server"; 
import ProfileForm from "@/app/components/ProfileForm";

export default async function ProfilePage() {
  const supabase = await createClient(); // CORRETTO: await

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("username, paypal_email")
    .eq("id", user.id)
    .single();

   if (profileError && profileError.code !== 'PGRST116') { // Ignora solo errore 'nessuna riga trovata' se il profilo non esiste ancora
     console.error("Errore caricamento profilo:", profileError);
     // Potresti mostrare un messaggio di errore all'utente
   }

  const userProfile = { 
    username: profile?.username ?? null, 
    paypal_email: profile?.paypal_email ?? null, 
  };

  return (
    <div className="w-full">
      <h1 className="text-3xl font-heading font-bold text-white mb-8">
        Il Tuo Profilo
      </h1>
      
      <ProfileForm 
        userId={user.id}
        userEmail={user.email || ""} // Passa l'email dell'utente
        profile={userProfile} // Passa i dati del profilo fetchati
      />
    </div>
  );
}