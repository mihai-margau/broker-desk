"use client";
import Link from "next/link";

export default function Header() {

  return (
        <div className="flex p-2">
            <Link href="/"><img src="/Images/BDLogo.png" alt="Logo" className="h-16 mb-4 mt-4" /></Link>
            <Link href="/" className="p-6 mt-4 font-bold text-xl text-secondary">Broker Desk Tool</Link>
        </div> );
}