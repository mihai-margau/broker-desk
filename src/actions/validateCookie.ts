"use server";
import { DOMParser } from 'xmldom';

export async function validateCookie(token: string| undefined): Promise<string | null> {
    // FRA, ITA, etc...
    // console.log('inside Validate Cookie with Token Value : ', token);
    const Encryptedtoken = `${token}`;
    const baseUrl =process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const flowResponse = await fetch(`${baseUrl}/api/validate-cookie`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            Token: Encryptedtoken.toString(),

        }),
    });

    // console.log('flow response : ', flowResponse)
    const body = await flowResponse?.json();

    // console.log('flow response body : ', body)

    const xmlString = body.flowResponse;
    
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlString, "text/xml");

    const result = xml.getElementsByTagName("result")[0]?.textContent;

    return result;
}