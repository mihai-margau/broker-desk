"use server";

import { Constants } from "@/app/Constants";
import { IRequestsListListItem, RequestsHistoryListBuildInItem } from "@/models/models";

export async function getRequestHistory(instancename: string | undefined, requestid: string| undefined): Promise<RequestsHistoryListBuildInItem[]> {
    
    
    const baseUrl =process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const flowResponse = await fetch(`${baseUrl}/api/get-requesthistory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            instancename: instancename?.toString(),
            requestid : requestid?.toString()
        })       
    });

    // console.log('flow response : ', flowResponse)
    const body = await flowResponse?.json()
    console.log("body of response of get request history value from power automate : ", body?.flowResponse);
    
    const obj = JSON.parse(body?.flowResponse);

    const value = obj?.d?.results  as RequestsHistoryListBuildInItem[];
    console.log('value of history : ', value);
    return value;
}