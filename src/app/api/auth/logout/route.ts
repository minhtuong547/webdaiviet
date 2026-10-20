import { NextResponse } from "next/server";
import { STEAM_SESSION_COOKIE } from "@/lib/security/steam-session";
export async function POST(){
  const response=NextResponse.json({state:"SIGNED_OUT"},{headers:{"Cache-Control":"no-store"}});
  response.cookies.set(STEAM_SESSION_COOKIE,"",{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:0});
  return response;
}
