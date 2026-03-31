"use server";
import { IContractInfo } from "@/models/models";
import { parseStringPromise } from "xml2js";

export async function ValidateContract(contractnumber: string): Promise<IContractInfo> {
    
    console.log('inside get contracts info with contract number : ', contractnumber);
    const xmlbody = `<getContractIdentifiers><criteria><portfolioNum>${contractnumber}</portfolioNum></criteria><askingDate></askingDate></getContractIdentifiers>`
    const baseUrl =process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const flowResponse = await fetch(`${baseUrl}/api/validate-contract`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            xmlbody: xmlbody.toString(),

        }),
    });

    console.log('flow response validate contract : ', flowResponse)
    const body = await flowResponse?.text()
    console.log('flow response body validate contract : ', body)
   
    let xml = htmlUnescape(body.trim());
    xml = xml.slice(xml.indexOf("<"));
    const parsed = await parseStringPromise(xml, {
        explicitArray: false,
        mergeAttrs: true
    });
    console.log('parsed validate contract :', parsed);
    return parsed.result ?? null;
}
function htmlUnescape(s: string) {
    return s
        .replaceAll("&lt;", "<")
        .replaceAll("&gt;", ">")
        .replaceAll("&amp;", "&")
        .replaceAll("&quot;", '"')
        .replaceAll("&#39;", "'")
        .replaceAll(/\\+"/g, '"')
}