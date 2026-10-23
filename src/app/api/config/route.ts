import { NextResponse } from "next/server";
import { hasValidSessionSecret } from "@/lib/security/steam-session";
export const dynamic="force-dynamic";
export function GET(){
  const state={
    officialApi:process.env.ISLEPILOT_API_KEY?"CONFIGURED":"NOT_CONFIGURED",
    steamLogin:process.env.STEAM_AUTH_ENABLED==="true"&&hasValidSessionSecret()?"CONTRACT_PENDING":"AUTH_NOT_CONFIGURED",
    writes:"DISABLED",
    admin:"DISABLED",
  };
  return NextResponse.json({state},{headers:{"Cache-Control":"no-store"}});
}
