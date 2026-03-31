"use server";
import { getParamValue } from "@/actions/getParamValue";
import { Constants } from "@/app/Constants";

export async function POST(req: Request) {
    try {
      const body = await req.json();
  
      // Read Power Automate HTTP Trigger URL from env var
      const FLOW_URL = await getParamValue(Constants.POWER_AUTOMATE_GETCOLUMNS_URL);
      console.log('flow url get param value : ' , FLOW_URL);
      if (!FLOW_URL) {
        return new Response(JSON.stringify({ error: "FLOW_URL not configured" }), { status: 500 });
      }
  
      // Call the Power Automate Flow
      console.log(body);
      const paResponse = await fetch(FLOW_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });
  
      const paText = await paResponse.text();
  
      return new Response(JSON.stringify({ status: paResponse.status, flowResponse: paText }), {
        status: paResponse.status
      });
    } catch (err: any) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
  }