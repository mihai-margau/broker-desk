"use server";

import { Constants } from "@/app/Constants";
import { IRequestsListListItem } from "@/models/models";

export async function GetRequests(InstanceName: string| undefined): Promise<IRequestsListListItem[]> {
    
    const bodypost = `{
        "startDate": "2026-01-01T08:54:34.8763433Z",
        "endDate": "2026-12-31T08:54:34.8763762Z",
        "workflowTypes": [${Constants.WORKFLOW_TYPE_ID}],
        "status": ["Ongoing"],
        "sortBy": "Id",
        "sortOrder": "asc"
      }`;
    const baseUrl =process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const flowResponse = await fetch(`${baseUrl}/api/get-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: 
           bodypost         
    });

    // console.log('flow response : ', flowResponse)
    const body = await flowResponse?.json()
    console.log("body of response of get requests value from api : ", body?.flowResponse);
    
    const obj = JSON.parse(body?.flowResponse);

    const value = obj.requests as IRequestsListListItem[];
   
    return value;
}