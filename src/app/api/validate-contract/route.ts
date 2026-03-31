"use server";
import { getParamValue } from "@/actions/getParamValue";
import { Constants } from "@/app/Constants";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const FLOW_URL = await getParamValue(Constants.POWER_AUTOMATE_CONTRACT_URL);
        // Read Power Automate HTTP Trigger URL from env var
        // FLOW_URL = "https://4a3af1a6c009eb8f8daa28089ec959.54.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/54b7cc09121f47a498da2a452235162c/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=DrIbUfGxrANaIkg0YU5lawMgDtB4Wh5uL4ADJNZkgIE";//process.env.POWER_AUTOMATE_BROKER_URL!;
        // console.log('flow url broker: ' , FLOW_URL);
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