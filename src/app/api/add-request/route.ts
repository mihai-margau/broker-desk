"use server";
export async function POST(req: Request) {
    try {
      const bodypost = await req.json();
      // console.log('region value in api : ', region);
      // Read ZPI Request Tool URL from env var
      // const API_REQUESTS_URL = `https://workflowplatform.azurewebsites.net/request-tools/${region}/requests/filter`;//process.env.API_REQUESTS_URL;
      const API_REQUESTS_URL = `https://workflowplatform.azurewebsites.net/request-tools/WER/requests`;//process.env.API_REQUESTS_URL;
      console.log('api add requests url value : ' , API_REQUESTS_URL);
      if (!API_REQUESTS_URL) {
        return new Response(JSON.stringify({ error: "FLOW_URL not configured" }), { status: 500 });
      }
      // token of service account 
      // eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6InNNMV95QXhWOEdWNHlOLUI2ajJ4em1pazVBbyIsImtpZCI6InNNMV95QXhWOEdWNHlOLUI2ajJ4em1pazVBbyJ9.eyJhdWQiOiJhcGk6Ly80MTA1M2U4Yi1lMDNjLTRiYWMtOWZkMS1lM2ZhNjQxZjVkNDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC8xZTdhZWIzYi0yNGE2LTRjOTctOTA2Mi0wMTM1NjQ0ZjA1MjYvIiwiaWF0IjoxNzcxMjM0OTIyLCJuYmYiOjE3NzEyMzQ5MjIsImV4cCI6MTc3MTIzOTkwNCwiYWNyIjoiMSIsImFpbyI6IkFVUUF1LzhiQUFBQU1vM1Y0bHlCRExUd0wxWWJzRFRzdktwcTQ3RmVyUWNCdmJwTkViSXBDTDlLaWlLSi9GRXJlVnhOZDlINFJVYW85cnNIM1puU0FpMzNXeFlKSStURS93PT0iLCJhbXIiOlsicHdkIl0sImFwcGlkIjoiNDEwNTNlOGItZTAzYy00YmFjLTlmZDEtZTNmYTY0MWY1ZDQwIiwiYXBwaWRhY3IiOiIwIiwiaXBhZGRyIjoiNC4xNzYuOC4xNzMiLCJuYW1lIjoiU2hhcmVQb2ludCBObyBSZXBseSIsIm9pZCI6IjMxYWE0YzkxLThmNWUtNDc3Yy05NTk0LTA1ODhhNTRlNTkxNCIsIm9ucHJlbV9zaWQiOiJTLTEtNS0yMS0zNTc2ODY4NzEwLTM1MjkzOTAwNTgtMzgzNjgxMTA2Mi0xODA0MzkiLCJyaCI6IjEuQVNBQU8tdDZIcVlrbDB5UVlnRTFaRThGSm9zLUJVRTg0S3hMbjlIai1tUWZYVUFnQUJzZ0FBLiIsInNjcCI6InVzZXJfaW1wZXJzb25hdGlvbiIsInNpZCI6IjAwMjBmZDZhLTQ1YjktMzE4Yi02OTliLWNjODZjNGFkNzViOSIsInN1YiI6Imh2bGMxRExUSFRFcmV4QjhrSzl4cm9NQmdJSWdSajFzR3ktSlZzUjVUdDAiLCJ0aWQiOiIxZTdhZWIzYi0yNGE2LTRjOTctOTA2Mi0wMTM1NjQ0ZjA1MjYiLCJ1bmlxdWVfbmFtZSI6InNhX2dyb3VwLXNoYXBhMS1wcm9AY29mYWNlY29ycHByb2Qub25taWNyb3NvZnQuY29tIiwidXBuIjoic2FfZ3JvdXAtc2hhcGExLXByb0Bjb2ZhY2Vjb3JwcHJvZC5vbm1pY3Jvc29mdC5jb20iLCJ1dGkiOiJHclFNTC1BWWFFT3M0Y1pMRjRwQkFBIiwidmVyIjoiMS4wIiwieG1zX2Z0ZCI6IlV2VUYwVFdhUnZNYkdwLVdxZVNVeGl6NGtPaExsOE5ZaklYTWFIM1d1V0FCWlhWeWIzQmxibTl5ZEdndFpITnRjdyJ9.jePLO7Oh0-vxFXndEEd6MJWQMEGMkLSK6SGgFSrm86aLGnXNzuMA63UoHjjgLGW0Uq4Labuf1XMSuoZkkwGVBJkRok2GQBkEuCx2BprTb7oQ9GuPksdEOO9kV8it9Ypk6DzY2LLGPKLLrAY3b9zK3TBAUpxm7MyNAmtqpG1fOTgT2PbfSiIaAxwhymbe9BCkXTvPkDN9vpele0eov2F8Q7Ms9xs7Fn8bgLak2kkFAxwLhBSLcxin9Q1Dw0-qLaLxehY_Mr9sjOF0YWKPz92Hy8xIfbHAJ8EZvyfhbxF39GQyf-80lhIF5n8VjpFyZGo492gcyMon93vmCAZOxhjX9g
      // Call the Power Automate Flow
      console.log('body add request before the call : ', bodypost);
      const paResponse = await fetch(API_REQUESTS_URL, {
        method: "POST",
        headers: {
            'accept': 'text/plain',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6InNNMV95QXhWOEdWNHlOLUI2ajJ4em1pazVBbyIsImtpZCI6InNNMV95QXhWOEdWNHlOLUI2ajJ4em1pazVBbyJ9.eyJhdWQiOiJhcGk6Ly80MTA1M2U4Yi1lMDNjLTRiYWMtOWZkMS1lM2ZhNjQxZjVkNDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC8xZTdhZWIzYi0yNGE2LTRjOTctOTA2Mi0wMTM1NjQ0ZjA1MjYvIiwiaWF0IjoxNzcxMjM0OTIyLCJuYmYiOjE3NzEyMzQ5MjIsImV4cCI6MTc3MTIzOTkwNCwiYWNyIjoiMSIsImFpbyI6IkFVUUF1LzhiQUFBQU1vM1Y0bHlCRExUd0wxWWJzRFRzdktwcTQ3RmVyUWNCdmJwTkViSXBDTDlLaWlLSi9GRXJlVnhOZDlINFJVYW85cnNIM1puU0FpMzNXeFlKSStURS93PT0iLCJhbXIiOlsicHdkIl0sImFwcGlkIjoiNDEwNTNlOGItZTAzYy00YmFjLTlmZDEtZTNmYTY0MWY1ZDQwIiwiYXBwaWRhY3IiOiIwIiwiaXBhZGRyIjoiNC4xNzYuOC4xNzMiLCJuYW1lIjoiU2hhcmVQb2ludCBObyBSZXBseSIsIm9pZCI6IjMxYWE0YzkxLThmNWUtNDc3Yy05NTk0LTA1ODhhNTRlNTkxNCIsIm9ucHJlbV9zaWQiOiJTLTEtNS0yMS0zNTc2ODY4NzEwLTM1MjkzOTAwNTgtMzgzNjgxMTA2Mi0xODA0MzkiLCJyaCI6IjEuQVNBQU8tdDZIcVlrbDB5UVlnRTFaRThGSm9zLUJVRTg0S3hMbjlIai1tUWZYVUFnQUJzZ0FBLiIsInNjcCI6InVzZXJfaW1wZXJzb25hdGlvbiIsInNpZCI6IjAwMjBmZDZhLTQ1YjktMzE4Yi02OTliLWNjODZjNGFkNzViOSIsInN1YiI6Imh2bGMxRExUSFRFcmV4QjhrSzl4cm9NQmdJSWdSajFzR3ktSlZzUjVUdDAiLCJ0aWQiOiIxZTdhZWIzYi0yNGE2LTRjOTctOTA2Mi0wMTM1NjQ0ZjA1MjYiLCJ1bmlxdWVfbmFtZSI6InNhX2dyb3VwLXNoYXBhMS1wcm9AY29mYWNlY29ycHByb2Qub25taWNyb3NvZnQuY29tIiwidXBuIjoic2FfZ3JvdXAtc2hhcGExLXByb0Bjb2ZhY2Vjb3JwcHJvZC5vbm1pY3Jvc29mdC5jb20iLCJ1dGkiOiJHclFNTC1BWWFFT3M0Y1pMRjRwQkFBIiwidmVyIjoiMS4wIiwieG1zX2Z0ZCI6IlV2VUYwVFdhUnZNYkdwLVdxZVNVeGl6NGtPaExsOE5ZaklYTWFIM1d1V0FCWlhWeWIzQmxibTl5ZEdndFpITnRjdyJ9.jePLO7Oh0-vxFXndEEd6MJWQMEGMkLSK6SGgFSrm86aLGnXNzuMA63UoHjjgLGW0Uq4Labuf1XMSuoZkkwGVBJkRok2GQBkEuCx2BprTb7oQ9GuPksdEOO9kV8it9Ypk6DzY2LLGPKLLrAY3b9zK3TBAUpxm7MyNAmtqpG1fOTgT2PbfSiIaAxwhymbe9BCkXTvPkDN9vpele0eov2F8Q7Ms9xs7Fn8bgLak2kkFAxwLhBSLcxin9Q1Dw0-qLaLxehY_Mr9sjOF0YWKPz92Hy8xIfbHAJ8EZvyfhbxF39GQyf-80lhIF5n8VjpFyZGo492gcyMon93vmCAZOxhjX9g'
          },
        body: JSON.stringify(bodypost)
      });
  
      const paText = await paResponse.json();
      console.log('flow response json : ', paText);
      return new Response(JSON.stringify({ status: paResponse.status, flowResponse: paText }), {
        status: paResponse.status
      });
    } catch (err: any) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
  }