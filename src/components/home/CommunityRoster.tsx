import { ArrowUpRight, Footprints } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { StatusIndicator } from "@/components/ui/StatusIndicator";
import type { PublicPlayersData, PublicRead } from "@/lib/api/public-community-data";
import { publicReadStateText } from "@/lib/api/public-community-data";
import styles from "./PortalHome.module.css";

export function CommunityRoster({ players }: { players: PublicRead<PublicPlayersData> }) {
  const rows = players.data?.players.slice(0, 6) ?? [];
  const live = players.state === "LIVE_VERIFIED";
  return (
    <Card className={styles.rosterCard} variant="default" data-panel="community-roster">
      <div className={styles.panelHeader}><div><p className={styles.overline}>COMMUNITY ROSTER</p><h2>Những người đang ở trên đảo</h2></div><Badge variant={live ? "online" : "unavailable"}><Footprints aria-hidden="true" size={13} />{players.data?.count ?? "—"}</Badge></div>
      <p className={styles.panelLead}>{live ? "Tên và loài được lọc từ dữ liệu công khai đã xác minh." : `${publicReadStateText[players.state]}. Không có danh sách thay thế.`}</p>
      {rows.length ? <ol className={styles.rosterList} aria-label={`${players.data?.count ?? rows.length} người chơi công khai`}>{rows.map((player, index) => <li key={`${player.name ?? "unknown"}-${index}`}><span>{String(index + 1).padStart(2, "0")}</span><strong title={player.name ?? undefined}>{player.name ?? "Người chơi chưa đặt tên"}</strong><small title={player.species ?? undefined}>{player.species ?? "Chưa có thông tin loài"}</small><StatusIndicator status="online" className={styles.rosterStatus} /></li>)}</ol> : <div className={styles.emptyPanel} role="status"><strong>{players.data ? "Đảo đang lặng." : "Tín hiệu đang chờ."}</strong><p>{players.data ? "Chưa ghi nhận người chơi online từ nguồn công khai." : publicReadStateText[players.state]}</p></div>}
      <Link href="/nguoi-choi" className={styles.textLink}>Mở danh sách người chơi <ArrowUpRight aria-hidden="true" size={16} /></Link>
    </Card>
  );
}
