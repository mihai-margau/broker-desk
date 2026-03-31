"use client";
import { useEffect, useState } from "react";
import DashboardDataTable from "./subComponents/DashboardDataTable/DashboardDataTable";
import Header from "@/app/Header";
import { useGlobal } from "@/app/providers";
import ProgressIndicator from "./common/ProgressIndicator";

export default function Dashboard() {
  const { cg, setCg, search, brokerdata, companyInfo, RTInstance} = useGlobal();
  const [ready, setReady] = useState(false);


useEffect(() => {
  const runSearch = async () => {
    const ok = await search();
    if (ok) setReady(true);
  };

  runSearch();
}, []);

  if (!ready) return <ProgressIndicator label="Loading ..." />;
  return (
    <div>
        <Header />
        <DashboardDataTable  Instance='WER' />
    </div>
  );
}