"use server";

export async function ManageViews(Method: string,
                                CGNumber: string,
                                Config: string,
                                ViewName: string,
                                Keywords: string,
                                IsDefault: string,): Promise<string> {
   
    const baseUrl =process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const flowResponse = await fetch(`${baseUrl}/api/manage-views`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            Method : Method.toString(),
            CG: CGNumber.toString(),
            Config: Config?.toString(),
            ViewName: ViewName?.toString(),
            Keywords: Keywords?.toString(),
            IsDefault: IsDefault?.toString()
        })
    });

    // console.log('flow response : ', flowResponse)
    const body = await flowResponse?.json();
    // console.log('flow response body : ', body)
    const obj = JSON.parse(body?.flowResponse);

  
    return obj.value;
}