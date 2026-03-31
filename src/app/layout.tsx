import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import Header from "./Header";
import { GlobalProvider } from "./providers";
import "tailwindcss";
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Broker Desk Tool",
  description: "Developped by Coface SharePoint Team@2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {/* <Header /> */}
        <GlobalProvider>
        {children}
        </GlobalProvider>
      </body>
    </html>
  );
}
