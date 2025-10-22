// app/(dashboard)/profile/page.tsx
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import ProfileForm from "@/app/components/ProfileForm";

export default async function ProfilePage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Fetch profilo
  const { data: profile } = await supabase
    .from("profiles")
    .select("username, paypal_email")
    .eq("id", user.id)
    .single();

  const userProfile = {
    username: profile?.username ?? null,
    paypal_email: profile?.paypal_email ?? null,
  };

  return (
    <div className="w-full">
      <h1 className="text-3xl font-heading font-bold text-white mb-8">
        Profilo
      </h1>
      
      <ProfileForm 
        userId={user.id}
        userEmail={user.email || ""}
        profile={userProfile}
      />
    </div>
  );
}