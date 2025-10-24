// app/components/Sidebar.tsx
"use client"; 

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; 
import { createClient } from "@/lib/supabase/client"; 
import { useState } from "react"; 
import {
  LayoutDashboard, Target, Wallet, User, LogOut, Shield, LifeBuoy, Loader2 
} from "lucide-react";

const navItems = [ 
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, admin: false },
  { name: "Missioni", href: "/missions", icon: Target, admin: false },
  { name: "Wallet", href: "/wallet", icon: Wallet, admin: false },
  { name: "Profilo", href: "/profile", icon: User, admin: false },
  { name: "Supporto", href: "/support", icon: LifeBuoy, admin: false }, 
  { name: "Admin", href: "/admin", icon: Shield, admin: true }, 
];

interface SidebarProps { isOpen: boolean; isAdmin: boolean; }

export default function Sidebar({ isOpen, isAdmin }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter(); 
  const supabase = createClient(); 
  const [loggingOut, setLoggingOut] = useState(false); 

  const handleLogout = async () => {
    if (loggingOut) return; 
    setLoggingOut(true);
    console.log("Tentativo di logout..."); 
    
    const { error } = await supabase.auth.signOut(); 
      
    if (error) {
      console.error("Errore durante il logout:", error.message);
      alert(`Errore durante il logout: ${error.message}`); 
      setLoggingOut(false); 
    } 
    // Il listener onAuthStateChange in useAuth gestirà il redirect
  };

  return (
    <div
      className={`
        fixed top-0 left-0 z-40 h-screen w-64 bg-background-secondary/90 backdrop-blur-lg border-r border-white/10 p-6 flex flex-col
        lg:sticky lg:translate-x-0 transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      <div className="mb-10">
        <h1 className="text-2xl font-heading font-bold text-white">Cred<span className="text-primary">Pulse</span></h1>
      </div>
      <nav className="flex flex-col gap-2 flex-grow">
        {navItems.map((item) => { 
          if (item.admin && !isAdmin) return null;
          const isActive = pathname === item.href; 
          return ( <Link key={item.name} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${ isActive ? "bg-primary/20 text-primary font-semibold" : "text-gray-400 hover:bg-primary/10 hover:text-white" } `}> <item.icon className="w-5 h-5" /> <span>{item.name}</span> </Link> );
        })}
      </nav>
      <div>
        <button
          onClick={handleLogout} 
          disabled={loggingOut} 
          className="flex items-center justify-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-secondary/10 hover:text-white w-full transition-colors disabled:opacity-50"
        >
          {loggingOut ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <LogOut className="w-5 h-5" />
          )}
          <span>{loggingOut ? 'Uscita...' : 'Esci'}</span>
        </button>
      </div>
    </div>
  );
}
