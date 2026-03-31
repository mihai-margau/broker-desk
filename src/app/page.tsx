"use server";
import Image from "next/image";
import Link from "next/link";
import Dashboard from "../components/Dashboard";
import { parseStringPromise } from "xml2js";
import Header from "./Header";

export default async function Home() {
   
    // const res = await fetch("http://localhost:3000/api/validate-cookie", { cache: "no-store" });

    // const data = await res.json();
    // const title = "wael.zemzem";
    // const message ="log from next.js";
   
  return (
    <main>
      <div>
      {/* <Link href="/CreateRequest" className="xl:w-auto m-4 flex items-center justify-center px-8 py-2 bg-secondary border border-secondary rounded text-white font-semibold hover:bg-secondaryhover hover:border-secondaryhover bg-secondaryactive border-secondaryactive">
        Add new Request
      </Link> */}
      
      <Dashboard />
      
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}

      </div>
    </main>
  );

  


}
