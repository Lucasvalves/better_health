import type { Metadata } from "next";
import { Sora } from "next/font/google"; 
import "../styles/global.scss";

const sora = Sora({
  variable: "--font-sora",  
  subsets: ["latin"],       
});

export const metadata: Metadata = {
  title: "Better health",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="shortcut icon" type="imagex/png" href="./logo-bg-blue.png"></link>
      <body className={`${sora.variable}`}> {/* Aplica a fonte Sora */}
        {children}
      </body>
    </html>
  );
}
