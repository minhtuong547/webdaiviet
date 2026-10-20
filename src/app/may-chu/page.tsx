import Link from "next/link";
import { Activity, ArrowRight, CheckCircle2, ShieldCheck, Users } from "lucide-react";
import { getPublicCommunityData, publicReadStateText } from "@/lib/api/public-community-data";
import styles from "@/components/public/PublicCommunityPage.module.css";

export const metadata = {
  title: "Máy chủ | Đại Việt",
  description: "Trạng thái máy chủ Đại Việt và số người chơi trực tuyến từ dữ liệu đã xác minh.",
};

export const revalidate = 30;

function formatTimestamp(value: string | null) {
  if (!value) return "Chưa có mốc thời gian";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Mốc thời gian chưa hợp lệ" : date.toLocaleString("vi-VN");
}

export default async function ServerPage() {
  const { server, players } = await getPublicCommunityData();
  const online = server.data?.online ?? null;
  const maxPlayers = server.data?.maxPlayers ?? null;
  const capacity = online === null ? "—" : maxPlayers === null ? String(online) : `${online} / ${maxPlayers}`;

  return (
    <main className={styles.page} data-public-page="server">
      <section className={styles.hero}>
        <div className={styles.container}>
          <p className={styles.eyebrow}>ĐẠI VIỆT · MÁY CHỦ</p>
          <h1 className={styles.heading}>Tình trạng <em>trên đảo.</em></h1>
          <p className={styles.lead}>Dữ liệu hiển thị được lấy trực tiếp từ nguồn IslePilot đã xác minh và chỉ dùng các trường công khai cho cộng đồng.</p>
          <div className={styles.heroActions}><Link href="/nguoi-choi" className={styles.actionLink}>Xem người chơi trực tuyến <ArrowRight aria-hidden="true" size={16} /></Link></div>
        </div>
      </section>

      <section className={styles.content}>
        <div className={styles.container}>
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div><h2 className={styles.sectionTitle}>Trạng thái hiện tại</h2><p className={styles.sectionDescription}>Không có dữ liệu mô phỏng khi nguồn chưa phản hồi hoặc API thiếu quyền.</p></div>
              <span className={styles.statusBadge} data-state={server.state}><Activity aria-hidden="true" />{publicReadStateText[server.state]}</span>
            </div>
            <div className={styles.overviewGrid}>
              <article className={[styles.surface, styles.primarySurface].join(" ")}>
                <span className={styles.metaLabel}>Máy chủ</span>
                <h3 className={styles.serverName}>{server.data?.name ?? "Chưa xác minh tên máy chủ"}</h3>
                <p className={styles.stateText}>{publicReadStateText[server.state]}</p>
                <div className={styles.metricGrid}>
                  <div className={styles.metric}><span><Users aria-hidden="true" size={15} />Sức chứa trực tuyến</span><strong>{capacity}</strong><small>{maxPlayers === null ? "Chưa có giới hạn công khai" : "Người chơi / giới hạn"}</small></div>
                  <div className={styles.metric}><span><Activity aria-hidden="true" size={15} />Cập nhật gần nhất</span><strong>{server.state === "LIVE_VERIFIED" ? "Live" : "—"}</strong><small>{formatTimestamp(server.data?.lastSeenAt ?? null)}</small></div>
                </div>
              </article>
              <aside className={[styles.surface, styles.sideSurface].join(" ")}>
                <div><div className={styles.sideIcon}><ShieldCheck aria-hidden="true" size={21} /></div><h3 className={styles.sideTitle}>Dữ liệu công khai có kiểm soát</h3><p className={styles.sideText}>Trang này không hiển thị Steam ID, Discord ID, ví, lịch sử xử phạt hoặc thông tin quản trị.</p></div>
                <ul className={styles.policyList}><li><CheckCircle2 aria-hidden="true" size={15} />Chỉ đọc từ API đã xác minh</li><li><CheckCircle2 aria-hidden="true" size={15} />Làm mới theo bộ nhớ đệm 30 giây</li></ul>
              </aside>
            </div>
          </div>
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div><h2 className={styles.sectionTitle}>Hoạt động cộng đồng</h2><p className={styles.sectionDescription}>Số người chơi trực tuyến được kiểm tra độc lập với trạng thái máy chủ.</p></div>
              <span className={styles.statusBadge} data-state={players.state}><Users aria-hidden="true" />{publicReadStateText[players.state]}</span>
            </div>
            <div className={styles.overviewGrid}>
              <article className={[styles.surface, styles.primarySurface].join(" ")}><span className={styles.metaLabel}>Người chơi đang trực tuyến</span><h3 className={styles.serverName}>{players.data?.count ?? "—"}</h3><p className={styles.stateText}>{players.data ? "Danh sách công khai đã được lọc sẵn, chỉ gồm tên và loài." : publicReadStateText[players.state]}</p></article>
              <aside className={[styles.surface, styles.sideSurface].join(" ")}><div><h3 className={styles.sideTitle}>Danh sách trực tuyến</h3><p className={styles.sideText}>Mở trang người chơi để xem danh sách tên và loài hiện được API xác nhận online.</p></div><Link href="/nguoi-choi" className={styles.actionLink}>Đến danh sách <ArrowRight aria-hidden="true" size={16} /></Link></aside>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
