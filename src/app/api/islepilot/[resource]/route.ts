import { NextResponse } from "next/server";
import { getOfficialResource, officialReadEndpoints, type OfficialResource } from "@/lib/api/islepilot-endpoints";
import { publicErrorStatus } from "@/lib/api/islepilot-client";
import { publicPlayersSummary, publicServerSnapshot } from "@/lib/api/islepilot-schemas";

export const dynamic = "force-dynamic";
export const revalidate = 30;
const publicResources = new Set(["server", "players", "leaderboard", "events", "killfeed"]);

export async function GET(_request: Request, context: { params: Promise<{ resource: string }> }) {
  const { resource } = await context.params;
  if (!publicResources.has(resource) || !(resource in officialReadEndpoints)) {
    return NextResponse.json({ state: "NOT_FOUND" }, { status: 404, headers: { "Cache-Control": "no-store" } });
  }
  const result = await getOfficialResource(resource as OfficialResource);
  if (!result.ok) {
    return NextResponse.json({ state: result.code, requestId: result.requestId }, {
      status: publicErrorStatus(result.code),
      headers: { "Cache-Control": "no-store", "X-Request-Id": result.requestId },
    });
  }
  if (resource !== "server" && resource !== "players") {
    return NextResponse.json({state:"CONTRACT_PENDING",requestId:result.requestId},{status:502,headers:{"Cache-Control":"no-store"}});
  }
  const safeData = resource === "server" ? publicServerSnapshot(result.data) : publicPlayersSummary(result.data);
  if (safeData === null) return NextResponse.json({state:"INVALID_RESPONSE",requestId:result.requestId},{status:502,headers:{"Cache-Control":"no-store"}});
  return NextResponse.json({ state: "OK", data: safeData, requestId: result.requestId }, {
    headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60", "X-Request-Id": result.requestId },
  });
}
