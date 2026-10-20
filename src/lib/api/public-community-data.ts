import { getPlayers, getServer } from "./islepilot-endpoints";
import type { IslePilotErrorCode, IslePilotResult } from "./islepilot-client";
import { publicPlayersSummary, publicServerSnapshot } from "./islepilot-schemas";

export type PublicReadState = "LIVE_VERIFIED" | IslePilotErrorCode;
export type PublicServerData = NonNullable<ReturnType<typeof publicServerSnapshot>>;
export type PublicPlayersData = NonNullable<ReturnType<typeof publicPlayersSummary>>;

export type PublicRead<T> = {
  state: PublicReadState;
  data: T | null;
};

export const publicReadStateText: Record<PublicReadState, string> = {
  LIVE_VERIFIED: "Dữ liệu trực tiếp đã xác minh",
  NOT_CONFIGURED: "Chưa cấu hình API key",
  UNAUTHORIZED: "API key không được chấp nhận",
  MISSING_SCOPE: "API key thiếu quyền đọc",
  ENTITLEMENT_UNAVAILABLE: "Tính năng chưa có trong gói IslePilot",
  NOT_FOUND: "Endpoint chưa được cung cấp",
  RATE_LIMITED: "API đang giới hạn yêu cầu; thử lại sau",
  UPSTREAM_UNAVAILABLE: "Không thể kết nối IslePilot",
  INVALID_RESPONSE: "Phản hồi IslePilot chưa đúng định dạng",
};

export function mapPublicServerResult(result: IslePilotResult<unknown>): PublicRead<PublicServerData> {
  if (!result.ok) return { state: result.code, data: null };
  const data = publicServerSnapshot(result.data);
  return data ? { state: "LIVE_VERIFIED", data } : { state: "INVALID_RESPONSE", data: null };
}

export function mapPublicPlayersResult(result: IslePilotResult<unknown>): PublicRead<PublicPlayersData> {
  if (!result.ok) return { state: result.code, data: null };
  const data = publicPlayersSummary(result.data);
  return data ? { state: "LIVE_VERIFIED", data } : { state: "INVALID_RESPONSE", data: null };
}

export async function getPublicCommunityData() {
  const [serverResult, playersResult] = await Promise.all([getServer(), getPlayers()]);
  return {
    server: mapPublicServerResult(serverResult),
    players: mapPublicPlayersResult(playersResult),
  };
}
