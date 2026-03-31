"use server";
import { getParamValue } from "@/actions/getParamValue";
import { Constants } from "@/app/Constants";
import { ServiceHubResult } from "@/models/models";
// app/api/searchServiceHubEntryKeyValue/route.ts
import { NextRequest, NextResponse } from "next/server";

// Optional: choose runtime
// export const runtime = "nodejs"; // default
// export const runtime = "edge";   // if you want Edge

// Optional: disable caching for dynamic responses
// export const dynamic = "force-dynamic";

type SearchBody = {
  serviceHubEntryKey?: string;
  serviceHubEntryKeyValue?: string;
};

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return new NextResponse("Unsupported Media Type", { status: 415 });
    }
    let result: ServiceHubResult[] = [];
    const body = (await req.json()) as SearchBody;
    const { serviceHubEntryKey, serviceHubEntryKeyValue } = body ?? {};
    const azureApi: string = await getParamValue(Constants.SERVICE_HUB_SEARCH_URL);
    console.log('Azure api url : ' , azureApi);
    if (!azureApi) {
      return new Response(JSON.stringify({ error: "SERVICE_HUB_SEARCH_URL not configured" }), { status: 500 });
    }
    // Basic validation
    if (!serviceHubEntryKey || !serviceHubEntryKeyValue) {
      return new NextResponse(
        "Both 'serviceHubEntryKey' and 'serviceHubEntryKeyValue' are required.",
        { status: 400 }
      );
    }

    const response =  await fetch(`${azureApi}&entryKey=${serviceHubEntryKey}&entryKeyValue=${serviceHubEntryKeyValue}`);
    console.log("response of azure function service hub search api : ", response);
    // You return text in your Server Action, so we’ll return text here:
    if (!response.ok) {
      return new NextResponse("NOT_FOUND", { status: 404 });
    }
    result = (await response.json()) as ServiceHubResult[];
    console.log("result from azure function service hub search api : ", result);
    return new Response(JSON.stringify({ status: response.status, azureResponse: result }), {
      status: response.status
    });
    
  } catch (err) {
    console.error("[searchServiceHubEntryKeyValue] POST error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}