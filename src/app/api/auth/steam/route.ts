import { NextResponse } from "next/server";
export const dynamic="force-dynamic";
export function GET(){
  if(process.env.STEAM_AUTH_ENABLED!=="true"||!process.env.SESSION_SECRET){
    return NextResponse.json({state:"AUTH_NOT_CONFIGURED"},{status:503,headers:{"Cache-Control":"no-store"}});
  }
  return NextResponse.json({state:"CONTRACT_PENDING",message:"Steam OpenID provider configuration and callback URL have not been verified."},{status:503,headers:{"Cache-Control":"no-store"}});
}
