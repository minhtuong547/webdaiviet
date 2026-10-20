import { NextResponse } from "next/server";
export const dynamic="force-dynamic";
export function GET(){
  const state={
    officialApi:process.env.ISLEPILOT_API_KEY?"CONFIGURED":"NOT_CONFIGURED",
    steamLogin:process.env.STEAM_AUTH_ENABLED==="true"&&Boolean(process.env.SESSION_SECRET)?"CONTRACT_PENDING":"AUTH_NOT_CONFIGURED",
    writes:"DISABLED",
    admin:"DISABLED",
  };
  return NextResponse.json({state},{headers:{"Cache-Control":"no-store"}});
}
