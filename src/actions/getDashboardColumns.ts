"use server";

import { IViewsColumnsListItem } from "@/models/models";

// we don't need columns for each instance for all brokers same columns
export async function GetDashboardColumns(): Promise<IViewsColumnsListItem[]> {
    const baseUrl =process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const flowResponse = await fetch(`${baseUrl}/api/get-dashboardcolumns`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            Country: ""
        })
    });

    // console.log('flow response : ', flowResponse)
    const body = await flowResponse?.json()
    // console.log("body of response of get requests value from api : ", body?.flowResponse);
    
    const obj = JSON.parse(body?.flowResponse);

    const value = obj?.d?.results as IViewsColumnsListItem[];
    console.log('value of columns : ', value);
    return value;
}