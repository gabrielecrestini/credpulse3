// app/page.tsx
"use client";

import { useState, MouseEvent } from "react"; // Importa MouseEvent
import Image from "next/image";
import {
  CreditCard,
  DatabaseZap,
  CheckSquare,
  UserPlus,
  Wallet,
  Wifi,
} from "lucide-react";
import { motion } from "framer-motion"; // Importa Framer Motion

// Importa i nostri componenti premium
import AuthModal from "@/app/components/AuthModal";
import Header from "@/app/components/Header";
import GlassCard from "@/app/components/GlassCard";

// Definiamo una variante per l'animazione di scroll
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  },
};

// Pagina Principale
export default function LandingPage() {
  const [modalState, setModalState] = useState({
    isOpen: false,
    tab: 'register' as 'login' | 'register'
  });

  // Stato per l'effetto 3D Tilt
  const [rotation, setRotation] = useState({ rotateX: 0, rotateY: 0 });

  const handleOpenAuth = (tab: 'login' | 'register') => {
    setModalState({ isOpen: true, tab: tab });
  };

  // Logica per il 3D Tilt
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calcola la rotazione (valore da -10 a 10 gradi)
    const rotateY = (mouseX / width - 0.5) * -20; // Inverte per un effetto naturale
    const rotateX = (mouseY / height - 0.5) * 20;

    setRotation({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    // Resetta la rotazione
    setRotation({ rotateX: 0, rotateY: 0 });
  };


  return (
    <div className="min-h-screen overflow-x-hidden">
      
      <Header onOpenAuth={handleOpenAuth} />

      {/* 2. SEZIONE EROE (Con 3D Tilt) */}
      <main 
        className="relative container mx-auto px-4 pt-32 md:pt-40 pb-16 md:pb-32 flex flex-col md:flex-row items-center"
        // Applichiamo i listener per il mouse qui
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ perspective: "1000px" }} // Attiva la prospettiva 3D
      >
        {/* Effetti Luce */}
        <div className="absolute -top-20 left-0 w-96 h-96 bg-primary/20 rounded-full filter blur-3xl opacity-30 animate-pulse-slow -z-10"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-secondary/20 rounded-full filter blur-3xl opacity-30 animate-pulse-slow animation-delay-4000 -z-10"></div>


        {/* Testo a sinistra */}
        <div className="md:w-1/2 z-10 text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white">
            COMPLETA MISSIONI. GUADAGNA CREDS.
          </h1>
          <p className="text-lg text-gray-300 mt-4 mb-8">
            CredPulse è la piattaforma che ti premia in "Creds" per provare nuovi conti crypto e fintech. Accumula Creds e prelevali in crypto o PayPal.
          </p>
          <button
            onClick={() => handleOpenAuth('register')}
            className="relative bg-primary text-background-main font-bold px-6 py-3 sm:px-8 sm:py-4 rounded-lg text-base sm:text-lg inline-flex items-center gap-2 group hover:bg-opacity-90 transition-all shadow-lg shadow-primary/30 overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-20 h-full bg-white/30 transform -skew-x-[15deg] translate-x-[-150px] group-hover:translate-x-[300px] transition-transform duration-700 opacity-50"></div>
            Inizia a Guadagnare
          </button>
        </div>

        {/* Immagine della Carta (Con 3D Tilt e Padding corretto) */}
        <div className="md:w-1/2 mt-16 md:mt-0 z-10 flex justify-center">
          <motion.div
            className="relative w-[320px] h-[200px] md:w-[400px] md:h-[252px] animate-[float_6s_ease-in-out_infinite] rounded-xl overflow-hidden shadow-2xl"
            // Applica la rotazione 3D e una transizione fluida
            style={{
              transform: `rotateX(${rotation.rotateX}deg) rotateY(${rotation.rotateY}deg)`,
              transition: "transform 0.1s ease-out",
            }}
          >
            <Image
              src="/images/hero-card.png"
              alt="CredPulse Card"
              fill
              className="object-cover"
              priority={true}
            />
            {/*
              Overlay CORRETTO:
              Padding orizzontale aumentato a px-8 e md:px-12 per
              spingere il testo lontano dai bordi trasparenti del PNG.
            */}
            <div className="absolute inset-0 py-5 px-8 md:py-6 md:px-12 flex flex-col justify-between text-white">
              <span className="text-xl md:text-2xl font-heading font-bold text-white">
                Cred<span className="text-primary">Pulse</span>
              </span>
              <div className="text-right">
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary">
                  +10.000 CREDS
                </h2>
                <h3 className="text-sm md:text-base font-sans mt-1 text-gray-300">
                  PER LA TUA PRIMA MISSIONE
                </h3>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* 3. SEZIONE CATEGORIE (Con Animazione Scroll) */}
      <motion.section 
        id="categorie" 
        className="py-16 md:py-20 bg-background-secondary/50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }} // L'animazione parte quando il 30% è visibile
        variants={sectionVariants}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-12">
            Esplora le Nostre Categorie
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <GlassCard
              icon={<DatabaseZap className="w-6 h-6" />}
              title="Conti Crypto & Exchange"
              description="Apri conti sui migliori exchange, ottieni bonus di benvenuto e impara a gestire i tuoi asset digitali."
              comingSoon={true}
            />
            <GlassCard
              icon={<CreditCard className="w-6 h-6" />}
              title="Carte Personali & Business"
              description="Richiedi carte innovative per le tue spese quotidiane o per far crescere il tuo business. Ricompense istantanee."
              comingSoon={true}
            />
            <GlassCard
              icon={<Wifi className="w-6 h-6" />}
              title="SIM Digitali (eSIM)"
              description="Rimani connesso in tutto il mondo con le eSIM. Attiva un piano e ricevi un cashback."
              comingSoon={true}
            />
          </div>
        </div>
      </motion.section>

      {/* 4. SEZIONE COME FUNZIONA (Con Animazione Scroll) */}
      <motion.section 
        id="come-funziona" 
        className="py-16 md:py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-12">
            Il Tuo Loop di Guadagno
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {/* Step 1 */}
            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4 border-2 border-primary/30 transition-transform duration-300 group-hover:scale-110">
                <UserPlus className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">1. SCEGLI UNA MISSIONE</h3>
              <p className="text-gray-400">
                Registrati e scegli un'offerta che ti interessa dalla nostra lista.
              </p> 
            </div>
            {/* Step 2 */}
            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4 border-2 border-primary/30 transition-transform duration-300 group-hover:scale-110">
                <CheckSquare className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">2. COMPLETA I PASSAGGI</h3>
              <p className="text-gray-400">
                Segui le istruzioni: apri il conto, effettua un deposito, o prova il servizio.
              </p>
            </div>
            {/* Step 3 */}
            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4 border-2 border-primary/30 transition-transform duration-300 group-hover:scale-110">
                <Wallet className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">3. GUADAGNA CREDS</h3>
              <p className="text-gray-400">
                Ricevi i tuoi "Creds" nel wallet e prelevali in crypto o PayPal.
              </p>
              {/* ^^^ CORREZIONE QUI: </Vp> è diventato </p> */}
            </div>
          </div>
        </div>
      </motion.section>

      {/* 5. MODAL DI AUTENTICAZIONE */}
      <AuthModal 
        isOpen={modalState.isOpen} 
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        initialTab={modalState.tab} 
      />
    </div>
  );
}