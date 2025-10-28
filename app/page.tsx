// app/page.tsx
"use client";

import { useState, MouseEvent } from "react"; 
import Image from "next/image";
import {
  CreditCard,
  DatabaseZap,
  CheckSquare,
  UserPlus,
  Wallet,
  Wifi,
} from "lucide-react";
import { motion, Variants } from "framer-motion";

// Importa i nostri componenti
import AuthModal from "@/app/components/AuthModal";
import Header from "@/app/components/Header";
import GlassCard from "@/app/components/GlassCard";

// --- Varianti Animazione (Invariate) ---
const fadeInLeft: Variants = {
  hidden: { x: -50, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.8, ease: "circOut" } },
};
const fadeInRight: Variants = {
  hidden: { x: 50, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.8, ease: "circOut" } },
};
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};
const cardFadeInUp: Variants = {
  hidden: { y: 40, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
};
// --- Fine Varianti ---

export default function LandingPage() {
  const [modalState, setModalState] = useState({
    isOpen: false,
    tab: 'register' as 'login' | 'register'
  });

  const handleOpenAuth = (tab: 'login' | 'register') => {
    setModalState({ isOpen: true, tab: tab });
  };

  const handlePageMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY}px`);
  };

  return (
    // --- CORREZIONE: Usiamo un Fragment <> per separare il Modal dalla pagina ---
    <>
      <div 
        className="min-h-screen spotlight-effect" // Rimosso overflow-x-hidden
        onMouseMove={handlePageMouseMove}
      >
        
        <Header onOpenAuth={handleOpenAuth} />

        {/* 2. SEZIONE EROE */}
        <main 
          className="relative container mx-auto px-4 pt-32 md:pt-40 pb-16 md:pb-32 flex flex-col md:flex-row items-center"
        >
          {/* ... (Contenuto Hero Section identico) ... */}
          {/* Effetti Luce */}
          <div className="absolute -top-20 left-0 w-96 h-96 bg-primary/20 rounded-full filter blur-3xl opacity-30 animate-pulse-slow -z-10"></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-secondary/20 rounded-full filter blur-3xl opacity-30 animate-pulse-slow animation-delay-4000 -z-10"></div>
          {/* Testo a sinistra (Animato) */}
          <motion.div 
            className="md:w-1/2 z-10 text-center md:text-left"
            variants={fadeInLeft} initial="hidden" animate="visible" >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white">
              COMPLETA MISSIONI. GUADAGNA CREDS.
            </h1>
            <p className="text-lg text-gray-300 mt-4 mb-8">
              CredPulse è la piattaforma che ti premia in &quot;Creds&quot; per provare nuovi conti crypto e fintech. Accumula Creds e prelevali in crypto o PayPal.
            </p>
            <button
              onClick={() => handleOpenAuth('register')}
              className="relative bg-primary text-background-main font-bold px-6 py-3 sm:px-8 sm:py-4 rounded-lg text-base sm:text-lg inline-flex items-center gap-2 group hover:bg-opacity-90 transition-all shadow-lg shadow-primary/30 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-20 h-full bg-white/30 transform -skew-x-[15deg] translate-x-[-150px] group-hover:translate-x-[300px] transition-transform duration-700 opacity-50"></div>
              Inizia a Guadagnare
            </button>
          </motion.div>
          {/* Immagine della Carta a destra (Animata) */}
          <motion.div 
            className="md:w-1/2 mt-16 md:mt-0 z-10 flex justify-center"
            variants={fadeInRight} initial="hidden" animate="visible" >
            <div 
              className="relative w-[320px] h-[200px] md:w-[400px] md:h-[252px] animate-[float_6s_ease-in-out_infinite] rounded-xl overflow-hidden shadow-2xl transition-transform duration-300 hover:scale-105" >
              <Image src="/images/hero-card.png" alt="CredPulse Card" fill className="object-cover" priority={true} />
              <div className="absolute inset-0 py-5 px-8 md:py-6 md:px-12 flex flex-col justify-between text-white">
                <span className="text-xl md:text-2xl font-heading font-bold text-white">Cred<span className="text-primary">Pulse</span></span>
                <div className="text-right"><h2 className="text-2xl md:text-3xl font-heading font-bold text-primary">+10.000 CREDS</h2><h3 className="text-sm md:text-base font-sans mt-1 text-gray-300">PER LA TUA PRIMA MISSIONE</h3></div>
              </div>
            </div>
          </motion.div>
        </main>

        {/* 3. SEZIONE CATEGORIE (Animazione Stagger) */}
        <motion.section 
          id="categorie" 
          className="py-16 md:py-20 bg-background-secondary/50"
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} >
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-12">Esplora le Nostre Categorie</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <GlassCard variants={cardFadeInUp} icon={<DatabaseZap className="w-6 h-6" />} title="Conti Crypto & Exchange" description="Apri conti sui migliori exchange, ottieni bonus di benvenuto e impara a gestire i tuoi asset digitali." comingSoon={true} />
              <GlassCard variants={cardFadeInUp} icon={<CreditCard className="w-6 h-6" />} title="Carte Personali & Business" description="Richiedi carte innovative per le tue spese quotidiane o per far crescere il tuo business. Ricompense istantanee." comingSoon={true} />
              <GlassCard variants={cardFadeInUp} icon={<Wifi className="w-6 h-6" />} title="SIM Digitali (eSIM)" description="Rimani connesso in tutto il mondo con le eSIM. Attiva un piano e ricevi un cashback." comingSoon={true} />
            </div>
          </div>
        </motion.section>

        {/* 4. SEZIONE COME FUNZIONA (Animazione Stagger) */}
        <motion.section 
          id="come-funziona" 
          className="py-16 md:py-20"
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
        >
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-12">Il Tuo Loop di Guadagno</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <motion.div variants={cardFadeInUp} className="flex flex-col items-center group"><div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4 border-2 border-primary/30 transition-transform duration-300 group-hover:scale-110"><UserPlus className="w-8 h-8" /></div><h3 className="text-xl font-semibold text-white mb-2">1. SCEGLI UNA MISSIONE</h3><p className="text-gray-400">Registrati e scegli un&apos;offerta che ti interessa dalla nostra lista.</p></motion.div>
              <motion.div variants={cardFadeInUp} className="flex flex-col items-center group"><div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4 border-2 border-primary/30 transition-transform duration-300 group-hover:scale-110"><CheckSquare className="w-8 h-8" /></div><h3 className="text-xl font-semibold text-white mb-2">2. COMPLETA I PASSAGGI</h3><p className="text-gray-400">Segui le istruzioni: apri il conto, effettua un deposito, o prova il servizio.</p></motion.div>
              <motion.div variants={cardFadeInUp} className="flex flex-col items-center group"><div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4 border-2 border-primary/30 transition-transform duration-300 group-hover:scale-110"><Wallet className="w-8 h-8" /></div><h3 className="text-xl font-semibold text-white mb-2">3. GUADAGNA CREDS</h3><p className="text-gray-400">Ricevi i tuoi &quot;Creds&quot; nel wallet e prelevali in crypto o PayPal.</p></motion.div>
            </div>
          </div>
        </motion.section>

      </div> 
      {/* --- FINE div 'spotlight-effect' --- */}

      {/* 5. MODAL DI AUTENTICAZIONE (Ora è fuori dal div principale) */}
      <AuthModal 
        isOpen={modalState.isOpen} 
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        initialTab={modalState.tab} 
      />
    </>
  );
}
