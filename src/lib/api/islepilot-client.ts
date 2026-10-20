import { z } from "zod";

const baseUrl = z.string().url().default("https://islepilot.eu/api/v1").parse(process.env.ISLEPILOT_API_BASE_URL || undefined);
const requestTimestamps: number[] = [];
const requestTimeoutMs = 8_000;
const maxRequestsPerMinute = 120;

export type IslePilotErrorCode = "NOT_CONFIGURED" | "UNAUTHORIZED" | "MISSING_SCOPE" | "ENTITLEMENT_UNAVAILABLE" | "NOT_FOUND" | "RATE_LIMITED" | "UPSTREAM_UNAVAILABLE" | "INVALID_RESPONSE";
export type IslePilotResult<T> = { ok:true; data:T; status:number; requestId:string } | { ok:false; code:IslePilotErrorCode; status?:number; requestId:string };

function newRequestId() { return `dv-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`; }
function hasRequestSlot() {
  const now=Date.now();
  while(requestTimestamps[0]!==undefined && now-requestTimestamps[0]>=60_000) requestTimestamps.shift();
  if(requestTimestamps.length>=maxRequestsPerMinute) return false;
  requestTimestamps.push(now); return true;
}
function classify(status:number,payload:unknown):IslePilotErrorCode {
  if(status===401)return "UNAUTHORIZED";
  if(status===404)return "NOT_FOUND";
  if(status===429)return "RATE_LIMITED";
  if(status===403){const body=JSON.stringify(payload).toLowerCase();return /entitlement|plan|feature/.test(body)?"ENTITLEMENT_UNAVAILABLE":"MISSING_SCOPE";}
  return status>=500?"UPSTREAM_UNAVAILABLE":"INVALID_RESPONSE";
}
function validatePath(path:string) { if(!path.startsWith("/")||path.includes("..")||path.includes("\\"))throw new Error("Invalid IslePilot path"); return path; }

export async function islepilotGet<T=unknown>(path:string):Promise<IslePilotResult<T>> {
  const id=newRequestId(), key=process.env.ISLEPILOT_API_KEY;
  if(!key)return {ok:false,code:"NOT_CONFIGURED",requestId:id};
  if(!hasRequestSlot())return {ok:false,code:"RATE_LIMITED",requestId:id};
  const url=new URL(validatePath(path).slice(1),`${baseUrl.replace(/\/$/,"")}/`);
  try {
    const response=await fetch(url,{method:"GET",headers:{Authorization:`Bearer ${key}`,Accept:"application/json"},signal:AbortSignal.timeout(requestTimeoutMs),next:{revalidate:30,tags:[`islepilot:${path}`]}});
    const contentType=response.headers.get("content-type")||"";
    const payload=contentType.includes("json")?await response.json().catch(()=>null):null;
    if(!response.ok)return {ok:false,code:classify(response.status,payload),status:response.status,requestId:id};
    if(payload===null)return {ok:false,code:"INVALID_RESPONSE",status:response.status,requestId:id};
    return {ok:true,data:payload as T,status:response.status,requestId:id};
  } catch { return {ok:false,code:"UPSTREAM_UNAVAILABLE",requestId:id}; }
}
export function publicErrorStatus(code:IslePilotErrorCode) {
  if(code==="NOT_CONFIGURED")return 503;
  if(code==="UNAUTHORIZED")return 401;
  if(code==="MISSING_SCOPE"||code==="ENTITLEMENT_UNAVAILABLE")return 403;
  if(code==="NOT_FOUND")return 404;
  if(code==="RATE_LIMITED")return 429;
  return 502;
}
