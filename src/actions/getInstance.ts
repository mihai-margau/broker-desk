"use server";

export async function getCurrentInstance(IsoCountry: string| undefined): Promise<string> {
    // FRA, ITA, etc...
    // console.log('inside get Current Instance with IsoCountry Code : ', IsoCountry);
    const country = `${IsoCountry}`;
    const baseUrl =process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const flowResponse = await fetch(`${baseUrl}/api/get-instance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            Country: country.toString(),

        }),
    });

    // console.log('flow response : ', flowResponse)
    const body = await flowResponse?.text()
    // console.log('flow response body : ', body)
   
    return body;
}