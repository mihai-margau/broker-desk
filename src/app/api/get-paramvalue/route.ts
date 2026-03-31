"use server";

import { Constants } from "@/app/Constants";

export async function POST(req: Request) {
    try {
      const body = await req.json();
  
      // Read Power Automate HTTP Trigger URL from env var
      const FLOW_URL = "https://4a3af1a6c009eb8f8daa28089ec959.54.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/15dc5ff3050441f7b18724df2475aa7b/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=OWNYZRjxZDegORmHal5u83i7kfpVUT6T18331ELfEv4";// Constants.POWER_AUTOMATE_PARAMVALUE_URL;
      // console.log('flow url get param value : ' , FLOW_URL);
      if (!FLOW_URL) {
        return new Response(JSON.stringify({ error: "FLOW_URL not configured" }), { status: 500 });
      }
  
      // Call the Power Automate Flow
      // console.log(body);
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