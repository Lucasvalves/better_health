import type { Metadata } from "next";
import { Sora, Poppins } from "next/font/google"; 
import "../styles/global.scss";

// Configuração da Sora
const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

// Configuração da Poppins
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Peso(s) desejados
});

export const metadata: Metadata = {
  title: "Better Health",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sora.variable} ${poppins.variable}`}>
      <head>
        <link rel="shortcut icon" type="imagex/png" href="/logo-bg-blue.png" />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}