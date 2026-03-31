"use server";

export async function writeInLog(title: string| undefined, message: string | undefined): Promise<string> {

    const baseUrl =process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const flowResponse = await fetch(`${baseUrl}/api/log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            Title: title?.toString(),
            Message : message?.toString()
        }),
    });

    // console.log('flow response : ', flowResponse)
    const body = await flowResponse?.text()
    // console.log('flow response body : ', body)
   
    return body;
}