"use server";

import { Constants } from "@/app/Constants";
import { IRequestsListListItem } from "@/models/models";

export async function getRequestById(instancename: string | undefined, requestid: string| undefined): Promise<IRequestsListListItem> {
    
    
    const baseUrl =process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const flowResponse = await fetch(`${baseUrl}/api/get-requestbyid`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            instancename: instancename?.toString(),
            requestid : requestid?.toString()
        })       
    });

    // console.log('flow response : ', flowResponse)
    const body = await flowResponse?.json()
    console.log("body of response of get request by id value from api : ", body?.flowResponse);
    
    const obj = JSON.parse(body?.flowResponse);

    const value = obj as IRequestsListListItem;
   
    return value;
}