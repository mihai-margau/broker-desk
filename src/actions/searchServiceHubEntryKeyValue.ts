"use server";

import { ServiceHubResult } from "@/models/models";

export async function searchServiceHubEntryKeyValue( serviceHubEntryKey: string,
    serviceHubEntryKeyValue: string): Promise<ServiceHubResult[]> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const azureResponse = await fetch(`${baseUrl}/api/search-ServiceHubEntryKeyValue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            serviceHubEntryKey: serviceHubEntryKey?.toString(),
            serviceHubEntryKeyValue : serviceHubEntryKeyValue?.toString()
        })
    });

    console.log('flow search service hub entry key response : ', azureResponse);
    const body = await azureResponse?.json();
    // console.log("body of response ofget param value api : ", body?.flowResponse);
    
    const obj = body?.azureResponse;
    // console.log('flow response body : ', body)
   
    return obj;
}