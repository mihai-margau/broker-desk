"use server";
import { RawExportData } from "@/models/models";

export async function getWorkflowTypeConfig(): Promise<RawExportData> {
    
    const bodypost = `{}`;
    const baseUrl =process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/get-workflowtypeconfig`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
           bodypost         
        })
    });

    console.log('flow response : ', res);
    const body = await res?.json();
    const data: RawExportData = JSON.parse(body?.flowResponse);
   
    return data;
}