import Link from "next/link";
import { Activity, ArrowRight, CircleDot, Users } from "lucide-react";
import { getPublicCommunityData, publicReadStateText } from "@/lib/api/public-community-data";
import styles from "@/components/public/PublicCommunityPage.module.css";

export const metadata = {
  title: "Người chơi trực tuyến | Đại Việt",
  description: "Danh sách người chơi Đại Việt đang trực tuyến từ dữ liệu công khai đã xác minh.",
};

export const revalidate = 30;

export default async function PlayersPage() {
  const { players, server } = await getPublicCommunityData();

  return (
    <main className={styles.page} data-public-page="players">
      <section className={styles.hero}>
        <div className={styles.container}>
          <p className={styles.eyebrow}>ĐẠI VIỆT · NGƯỜI CHƠI</p>
          <h1 className={styles.heading}>Những người <em>trên đảo.</em></h1>
          <p className={styles.lead}>Danh sách này chỉ hiển thị tên và loài của người chơi được nguồn dữ liệu xác nhận đang online. Không có hồ sơ riêng tư hoặc định danh tài khoản.</p>
          <div className={styles.heroActions}><Link href="/may-chu" className={styles.actionLink}>Xem trạng thái máy chủ <ArrowRight aria-hidden="true" size={16} /></Link></div>
        </div>
      </section>

      <section className={styles.content}>
        <div className={styles.container}>
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div><h2 className={styles.sectionTitle}>Đang trực tuyến</h2><p className={styles.sectionDescription}>Bảng được làm mới từ dữ liệu công khai đã lọc; không tạo người chơi thay thế khi nguồn chưa sẵn sàng.</p></div>
              <span className={styles.statusBadge} data-state={players.state}><Users aria-hidden="true" />{publicReadStateText[players.state]}</span>
            </div>
            {players.data ? (
              players.data.players.length ? <ul className={styles.playerGrid} aria-label={`${players.data.count} người chơi trực tuyến`}>{players.data.players.map((player, index) => <li key={`${player.name ?? "unknown"}-${index}`} className={styles.player}><span className={styles.playerStatus}><CircleDot aria-hidden="true" />Online</span><strong className={styles.playerName}>{player.name ?? "Người chơi chưa đặt tên"}</strong><span className={styles.playerSpecies}>{player.species ?? "Chưa có thông tin loài"}</span></li>)}</ul>
                : <div className={styles.empty}><strong>Chưa có người chơi trực tuyến.</strong><p>Nguồn dữ liệu đang hoạt động nhưng không trả về người chơi online ở thời điểm cập nhật này.</p></div>
            ) : <div className={styles.empty} role="status"><strong>Chưa thể tải danh sách.</strong><p>{publicReadStateText[players.state]}. Không có danh sách mẫu được hiển thị.</p></div>}
          </div>
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div><h2 className={styles.sectionTitle}>Máy chủ liên kết</h2><p className={styles.sectionDescription}>Trạng thái này được lấy trong cùng một lần đọc công khai, nhưng vẫn được hiển thị độc lập với danh sách người chơi.</p></div>
              <span className={styles.statusBadge} data-state={server.state}><Activity aria-hidden="true" />{publicReadStateText[server.state]}</span>
            </div>
            <div className={styles.overviewGrid}>
              <article className={[styles.surface, styles.primarySurface].join(" ")}><span className={styles.metaLabel}>Máy chủ</span><h3 className={styles.serverName}>{server.data?.name ?? "Chưa xác minh tên máy chủ"}</h3><p className={styles.stateText}>{server.data?.online === null || server.data?.online === undefined ? publicReadStateText[server.state] : `${server.data.online} người chơi được máy chủ báo cáo trực tiếp.`}</p></article>
              <aside className={[styles.surface, styles.sideSurface].join(" ")}><div><h3 className={styles.sideTitle}>Theo dõi trạng thái</h3><p className={styles.sideText}>Trang máy chủ hiển thị các chỉ số công khai và thời điểm cập nhật gần nhất.</p></div><Link href="/may-chu" className={styles.actionLink}>Đến trang máy chủ <ArrowRight aria-hidden="true" size={16} /></Link></aside>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
