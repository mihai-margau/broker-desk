"use server";

import { Constants } from "@/app/Constants";
import { IRequestsListListItem } from "@/models/models";

export async function updateRequestById(instancename: string | undefined,
                                        requestid: string| undefined,
                                        bodyrequest:string | undefined): Promise<string> {
    
    
    const baseUrl =process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const flowResponse = await fetch(`${baseUrl}/api/update-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            instancename: instancename?.toString(),
            requestid : requestid?.toString(),
            bodyrequest : bodyrequest?.toString()
        })       
    });

    // console.log('flow response : ', flowResponse)
    const body = await flowResponse?.json()
    console.log("body of response of get request by id value from api : ", body?.flowResponse);
    
    const obj = JSON.parse(body?.flowResponse);

    // const value = obj as IRequestsListListItem;
   
    return obj;
}