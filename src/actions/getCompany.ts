"use server";
import { parseStringPromise } from "xml2js";

export async function getCompanyInfo(companyId: string| undefined): Promise<void> {
    //CG280242
    // console.log('inside get broker info with cgnumber : ', companyId);
    const xmlbody = `<getCompaniesBaseData><easyNumbers><easyNumber>${companyId}</easyNumber></easyNumbers></getCompaniesBaseData>`;

    const baseUrl =process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const flowResponse = await fetch(`${baseUrl}/api/get-company`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            xmlbody: xmlbody.toString(),

        }),
    });

    // console.log('flow response : ', flowResponse)
    const body = await flowResponse?.text()
    // console.log('flow response body : ', body)
   
    let xml = htmlUnescape(body.trim()); 
    xml = xml.slice(xml.indexOf("<"));
    const parsed = await parseStringPromise(xml, {
        explicitArray: false,
        mergeAttrs: true
    });
    // console.log('parsed :', parsed);
    return parsed.result.array ?? null;
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