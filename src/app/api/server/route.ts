import { NextResponse } from "next/server";
import { islepilotGet } from "@/lib/api/islepilot-client";
import { publicErrorStatus } from "@/lib/api/islepilot-client";
import { publicServerSnapshot } from "@/lib/api/islepilot-schemas";
export const dynamic = "force-dynamic";
export async function GET() {
  const result = await islepilotGet("/server");
  if (!result.ok) return NextResponse.json({state:result.code,requestId:result.requestId},{status:publicErrorStatus(result.code),headers:{"Cache-Control":"no-store"}});
  const data = publicServerSnapshot(result.data);
  if (!data) return NextResponse.json({state:"INVALID_RESPONSE",requestId:result.requestId},{status:502,headers:{"Cache-Control":"no-store"}});
  return NextResponse.json({state:"OK",data,requestId:result.requestId},{headers:{"Cache-Control":"public, s-maxage=30, stale-while-revalidate=60"}});
}
