"use client";

// Definiamo le props per passare la funzione
// Ora accetta quale tab aprire
interface HeaderProps {
  onOpenAuth: (tab: 'login' | 'register') => void;
}

export default function Header({ onOpenAuth }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-background-main/60 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto flex justify-between items-center py-4 px-4 md:px-6">
        <h1 className="text-2xl font-bold text-white">
          Cred<span className="text-primary">Pulse</span>
        </h1>
        
        {/* Nuova sezione bottoni */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onOpenAuth('login')} // Apre il tab LOGIN
            className="text-gray-300 hover:text-white transition-colors font-medium text-sm sm:text-base"
          >
            Accedi
          </button>
          <button
            onClick={() => onOpenAuth('register')} // Apre il tab REGISTRATI
            className="bg-primary text-background-main font-semibold px-5 py-2 rounded-lg text-sm sm:text-base hover:bg-opacity-90 transition-all"
          >
            Registrati
          </button>
        </div>
      </div>
    </header>
  );
}