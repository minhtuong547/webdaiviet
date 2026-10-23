import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";

const sessionSchema=z.object({steamId:z.string().regex(/^\d{17}$/),expiresAt:z.number().int().positive()});
export const STEAM_SESSION_COOKIE="dv_session";
export function hasValidSessionSecret(value:string|undefined=process.env.SESSION_SECRET):value is string{return typeof value==="string"&&value.length>=32;}
function secret():string{const value=process.env.SESSION_SECRET;if(!hasValidSessionSecret(value))throw new Error("Session signing secret is not configured");return value;}
export function signSession(payload:{steamId:string;expiresAt:number}){
  const parsed=sessionSchema.parse(payload), body=Buffer.from(JSON.stringify(parsed)).toString("base64url");
  const sig=createHmac("sha256",secret()).update(body).digest("base64url");return `${body}.${sig}`;
}
export function verifySession(value:string|undefined,now=Date.now()):{steamId:string;expiresAt:number}|null{
  if(!value)return null;const [body,sig,...rest]=value.split(".");if(!body||!sig||rest.length)return null;
  try{const expected=createHmac("sha256",secret()).update(body).digest(),actual=Buffer.from(sig,"base64url");if(actual.length!==expected.length||!timingSafeEqual(actual,expected))return null;
    const data=sessionSchema.safeParse(JSON.parse(Buffer.from(body,"base64url").toString("utf8")));if(!data.success||data.data.expiresAt<=now)return null;return data.data;
  }catch{return null;}
}
