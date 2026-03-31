"use server";

export async function addRequest(bodypost : Object): Promise<string> {
    console.log(bodypost);
    
    const baseUrl =process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

    const res = await fetch(`${baseUrl}/api/add-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodypost)
    });

    console.log('flow response : ', res);
    const body = await res?.json();
   
    return body;
}