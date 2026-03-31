"use server";

export async function getParamValue(ParamName: string| undefined): Promise<string> {
    // console.log('inside get ParamValue with ParamName : ', ParamName);
    const baseUrl =process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const flowResponse = await fetch(`${baseUrl}/api/get-paramvalue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            ParamName: ParamName ? ParamName.toString() : '',

        }),
    });

    
    const body = await flowResponse?.json();
    // console.log("body of response ofget param value api : ", body?.flowResponse);
    
    const obj = JSON.parse(body?.flowResponse);

    const value = obj.d.results[0].Value;
    // console.log("value of param name : ", value);
    return value;
}