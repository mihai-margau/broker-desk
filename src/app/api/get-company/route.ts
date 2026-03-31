"use server";
import { getParamValue } from "@/actions/getParamValue";
import { Constants } from "@/app/Constants";
//require('dotenv').config();
// app/api/get-company/route.ts
export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Read Power Automate HTTP Trigger URL from env var
        // const FLOW_URL = "https://8731a045c3f8e6789071303fd7649c.5a.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/61da9fbc55a74533adc440b0c4e89bb8/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=CsqVO1H3I87erJMMTn561Jpci7c00KUChf2zm3eFCYI";//process.env.POWER_AUTOMATE_COMPANY_URL!;
        const FLOW_URL = await getParamValue(Constants.POWER_AUTOMATE_COMPANY_URL);
        // console.log('flow url Company: ' , FLOW_URL);
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