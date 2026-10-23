import { cookies } from "next/headers";
import { PortalHome } from "@/components/home/PortalHome";
import { getPublicCommunityData } from "@/lib/api/public-community-data";
import { homeViewerFromSession } from "@/lib/security/home-viewer";
import { STEAM_SESSION_COOKIE, verifySession } from "@/lib/security/steam-session";

export const metadata = {
  title: "DAI VIET — The Isle cộng đồng",
  description:
    "Cổng cộng đồng DAI VIET với trạng thái máy chủ và những tín hiệu công khai đã xác minh.",
};

export default async function Home() {
  const [community, cookieStore] = await Promise.all([
    getPublicCommunityData(),
    cookies(),
  ]);
  const viewer = homeViewerFromSession(
    verifySession(cookieStore.get(STEAM_SESSION_COOKIE)?.value),
  );

  return <PortalHome server={community.server} players={community.players} viewer={viewer} />;
}
