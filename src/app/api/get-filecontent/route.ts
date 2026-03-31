"use server";
import { getParamValue } from "@/actions/getParamValue";
import { Constants } from "@/app/Constants";
export async function POST(req: Request) {
    try {
      const body = await req.json();
  
      const FLOW_URL = await getParamValue(Constants.POWER_AUTOMATE_GET_FILE_CONTENT_URL);
      // console.log('flow url get instance : ' , FLOW_URL);
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
      console.log('get file content flow response :', paResponse);
      const data = await paResponse.arrayBuffer();
  
      
      return new Response(data, {
        status: 200,
        headers: { "Content-Type": paResponse.headers.get.call(paResponse.headers, "Content-Type") || "application/octet-stream" },
      });

    } catch (err: any) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
  }