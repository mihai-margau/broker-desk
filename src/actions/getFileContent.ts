"use server";

import { FileContent } from "@/models/models";

export async function getFileContent(FileUrl: string| undefined): Promise<FileContent> {
    const fileUrl = `${FileUrl}`;
    const baseUrl =process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const flowResponse = await fetch(`${baseUrl}/api/get-filecontent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            FileUrl: fileUrl.toString(),

        }),
    });
    console.log("flowResponse of get file content : ", flowResponse);
    const data = await flowResponse.arrayBuffer();
    const mimetype = flowResponse.headers.get("Content-Type");
    // const body = await flowResponse?.text();
    // const obj = JSON.parse(body);
    // console.log('flow get file content response body : ', obj.flowResponse);
    const obj :FileContent = {  mimeType: mimetype || "application/octet-stream",
                                content: data   };
    return obj;
}