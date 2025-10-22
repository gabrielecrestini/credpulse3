import type { Metadata } from "next";
import { Inter, Rubik } from "next/font/google"; // Importa Inter e Rubik
import "./globals.css";

// Configura i font
const inter = Inter({
  subsets: ["latin"],
  weight: ["700", "800"], // Solo pesi bold per i titoli
  variable: "--font-inter",
});

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["300", "400", "500"], // Pesi normali per il corpo
  variable: "--font-rubik",
});

export const metadata: Metadata = {
  title: "CredPulse | Completa missioni. Guadagna Creds.",
  description: "Accumula Creds provando nuovi conti crypto e fintech. Preleva in crypto o PayPal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      {/* Applica le variabili dei font */}
      <body className={`${inter.variable} ${rubik.variable} font-sans text-gray-200`}>
        {children}
      </body>
    </html>
  );
}