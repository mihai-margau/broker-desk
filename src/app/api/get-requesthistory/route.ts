"use server";
import { getParamValue } from "@/actions/getParamValue";
import { Constants } from "@/app/Constants";
type SearchBody = {
    instancename?: string;
    requestid?: string;
  };
export async function POST(req: Request) {
    try {
      const body = (await req.json()) as SearchBody;
      const { instancename, requestid } = body ?? {};
      console.log('InstanceName : ', instancename);
      console.log('RequestId : ', requestid);
  
      const FLOW_URL = await getParamValue(Constants.POWER_AUTOMATE_GET_HISTORY_URL);
      console.log('flow url get history : ' , FLOW_URL);
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
      
      console.log('response of get history url : ', paResponse);
      const paText = await paResponse.text();
  
      return new Response(JSON.stringify({ status: paResponse.status, flowResponse: paText }), {
        status: paResponse.status
      });
    } catch (err: any) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
  }