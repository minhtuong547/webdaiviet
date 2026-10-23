import { Activity, Radio, Server, ShieldCheck, Users } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatusIndicator } from "@/components/ui/StatusIndicator";
import { publicReadStateText, type PublicRead, type PublicServerData } from "@/lib/api/public-community-data";
import styles from "./PortalHome.module.css";

function getStatus(state: string): "neutral" | "warning" | "unavailable" {
  return state === "LIVE_VERIFIED"
    ? "neutral"
    : state === "UPSTREAM_UNAVAILABLE" || state === "RATE_LIMITED"
      ? "warning"
      : "unavailable";
}

function formatReadTime(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}

export function ServerStatus({ server }: { server: PublicRead<PublicServerData> }) {
  const online = server.data?.online ?? null;
  const maxPlayers = server.data?.maxPlayers ?? null;
  const hasCapacity = typeof maxPlayers === "number" && maxPlayers > 0;
  const status = getStatus(server.state);

  return (
    <Card className={styles.serverCard} variant="elevated" data-panel="server-status">
      <div className={styles.panelHeader}>
        <div><p className={styles.overline}>SERVER STATUS</p><h2>DAI VIET <span>•</span> EVRIMA</h2></div>
        <Badge variant={status}>
          {status === "neutral" ? <ShieldCheck aria-hidden="true" size={13} /> : null}
          {status === "neutral" ? "API đã xác minh" : status === "warning" ? <StatusIndicator status="warning" label="Đang kiểm tra" /> : <Radio aria-hidden="true" size={13} />}
          {status === "unavailable" ? "Chưa khả dụng" : null}
        </Badge>
      </div>
      <p className={styles.panelLead}>
        {server.state === "LIVE_VERIFIED"
          ? "Nguồn đọc IslePilot đã xác minh; trạng thái runtime của máy chủ không được giả định."
          : publicReadStateText[server.state]}
      </p>
      <div className={styles.serverMetrics}>
        <div><span><Users aria-hidden="true" size={14} /> ĐANG TRÊN ĐẢO</span><strong>{online ?? "—"}</strong><small>người chơi công khai</small></div>
        <div><span><Server aria-hidden="true" size={14} /> SỨC CHỨA</span><strong>{hasCapacity ? maxPlayers : "—"}</strong><small>{hasCapacity ? "giới hạn đã xác minh" : "chưa có giới hạn công khai"}</small></div>
        <div><span><Activity aria-hidden="true" size={14} /> MỐC ĐỌC</span><strong>{formatReadTime(server.data?.lastSeenAt)}</strong><small>{server.data?.lastSeenAt ? "mốc đọc công khai" : "chưa có mốc mới"}</small></div>
      </div>
      {hasCapacity && online !== null ? (
        <ProgressBar label="Sức chứa máy chủ" value={online} max={maxPlayers} />
      ) : null}
      <p className={styles.serverNote} title={server.data?.name ?? undefined}>{server.data?.name ?? "Tên máy chủ chưa được xác minh"}</p>
    </Card>
  );
}
