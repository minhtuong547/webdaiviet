import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Download,
  LockKeyhole,
  MessageCircle,
  Radio,
} from "lucide-react";
import styles from "@/components/home/HomePage.module.css";
import { navigationConfig, type NavigationDestination } from "@/components/navigation/navigation.config";
import { getPublicCommunityData, publicReadStateText } from "@/lib/api/public-community-data";

const featureDescriptions: Record<string, string> = {
  "garage-dino": "Quản lý nhân vật của bạn.",
  "garage-skin": "Lưu giữ bộ skin riêng.",
  "shop-dino": "Danh mục khủng long chính thức.",
  "shop-skin": "Skin được cập nhật từ cộng đồng.",
  "live-map": "Theo dõi đảo khi dữ liệu sẵn sàng.",
  leaderboard: "Thành tích đã được xác minh.",
  "skin-editor": "Công cụ tùy biến skin.",
  donate: "Cổng ủng hộ dự án.",
  launcher: "Ứng dụng kết nối Đại Việt.",
};

const homeFeatures = [
  ...navigationConfig.menus.flatMap((menu) => menu.items),
  ...navigationConfig.destinations,
  navigationConfig.launcher,
] as NavigationDestination[];

function FeatureCard({ feature, compact = false }: { feature: NavigationDestination; compact?: boolean }) {
  const Icon = feature.icon;
  const content = (
    <>
      <span className={styles.featureIcon}>{Icon ? <Icon aria-hidden="true" size={compact ? 18 : 21} strokeWidth={1.8} /> : null}</span>
      <span className={styles.featureBody}>
        <strong>{feature.label}</strong>
        <small>{featureDescriptions[feature.id]}</small>
      </span>
      {feature.available && feature.href ? <ArrowUpRight className={styles.featureArrow} aria-hidden="true" size={18} /> : <span className={styles.featureStatus}>{feature.status ?? "Chưa khả dụng"}</span>}
    </>
  );

  if (feature.available && feature.href) {
    return <Link href={feature.href} className={[styles.featureCard, compact ? styles.featureCompact : ""].filter(Boolean).join(" ")}>{content}</Link>;
  }

  return <article className={[styles.featureCard, styles.featureUnavailable, compact ? styles.featureCompact : ""].filter(Boolean).join(" ")} title={feature.status ?? "Chưa khả dụng"}>{content}</article>;
}

function formatTime(value: string | null | undefined) {
  if (!value) return "Chưa có mốc cập nhật";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Mốc thời gian chưa hợp lệ" : date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}

export const revalidate = 30;

export default async function Home() {
  const { server, players } = await getPublicCommunityData();
  const onlineCount = server.data?.online ?? null;
  const maxSlots = server.data?.maxPlayers ?? null;
  const visiblePlayers = players.data?.players.slice(0, 6) ?? [];
  const primaryFeatures = homeFeatures.slice(0, 6);
  const utilityFeatures = homeFeatures.slice(6);

  return (
    <main className={styles.page} data-home-page="true">
      <section className={styles.hero} data-home-section="hero" aria-labelledby="hero-title">
        <div className={styles.heroMedia} aria-hidden="true">
          <Image src="/art/dai-viet-forest-hero.jpg" alt="" fill priority quality={90} sizes="100vw" />
        </div>
        <div className={styles.heroOverlay} aria-hidden="true" />
        <div className={`${styles.container} ${styles.heroContent}`}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>THE ISLE: EVRIMA • VIETNAM</p>
            <h1 id="hero-title" className={styles.title}>DAI VIET <span>SINH TỒN CÙNG ANH EM.</span></h1>
            <p className={styles.lead}>Cộng đồng The Isle Evrima Việt Nam cho những cuộc săn, những chuyến chạy trốn và hành trình sống sót cùng đồng đội.</p>
            <div className={styles.actions} aria-label="Hành động cộng đồng">
              <button type="button" className={[styles.heroAction, styles.primaryAction].join(" ")} disabled title="Launcher chưa được cấu hình URL tải"><Download aria-hidden="true" size={17} />Tải Launcher</button>
              <button type="button" className={styles.heroAction} disabled title="Steam authentication chưa được xác minh"><LockKeyhole aria-hidden="true" size={16} />Đăng nhập Steam</button>
              <button type="button" className={styles.heroAction} disabled title="Discord chưa được cấu hình URL chính thức"><MessageCircle aria-hidden="true" size={17} />Discord</button>
            </div>
          </div>

          <dl className={styles.serverStrip} aria-label="Tình trạng máy chủ trực tiếp">
            <div className={styles.serverState} data-state={server.state}>
              <dt><Radio aria-hidden="true" size={14} />Trạng thái máy chủ</dt>
              <dd>{publicReadStateText[server.state]}</dd>
            </div>
            <div>
              <dt>PLAYERS ONLINE</dt>
              <dd>{onlineCount ?? "Chưa xác minh"}</dd>
            </div>
            {maxSlots !== null ? <div><dt>MAX SLOTS</dt><dd>{maxSlots}</dd></div> : null}
            <div>
              <dt>Cập nhật</dt>
              <dd>{formatTime(server.data?.lastSeenAt)}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className={styles.features} data-home-section="ecosystem" aria-labelledby="features-title">
        <div className={styles.container}>
          <header className={styles.sectionHeader}>
            <div><p className={styles.sectionKicker}>DAI VIET PORTAL</p><h2 id="features-title">Khám phá DAI VIET</h2></div>
            <p>Mỗi tiện ích chỉ mở khi route, quyền truy cập hoặc dịch vụ liên quan đã được xác minh.</p>
          </header>
          <div className={styles.featureGrid}>
            {primaryFeatures.map((feature) => <FeatureCard feature={feature} key={feature.id} />)}
          </div>
          <div className={styles.utilityGrid}>
            {utilityFeatures.map((feature) => <FeatureCard feature={feature} compact key={feature.id} />)}
          </div>
        </div>
      </section>

      <section className={styles.community} data-home-section="community" aria-labelledby="community-title">
        <div className={`${styles.container} ${styles.communityLayout}`}>
          <header className={styles.communityHeader}>
            <p className={styles.sectionKicker}>COMMUNITY LIVE</p>
            <h2 id="community-title">Cộng đồng đang trên đảo</h2>
            <p>Chỉ hiển thị tên, loài và trạng thái trực tuyến mà IslePilot đã xác minh công khai.</p>
            <Link href="/nguoi-choi" className={styles.communityLink}>Mở danh sách người chơi <ArrowUpRight aria-hidden="true" size={16} /></Link>
          </header>
          <div className={styles.roster}>
            <div className={styles.rosterHeading} aria-hidden="true"><span>Người chơi</span><span>Loài</span><span>Trạng thái</span></div>
            {players.data ? (
              visiblePlayers.length ? <ol className={styles.playerList} aria-label={`${players.data.count} người chơi trực tuyến`}>
                {visiblePlayers.map((player, index) => <li key={`${player.name ?? "unknown"}-${index}`}><strong>{player.name ?? "Người chơi chưa đặt tên"}</strong><span>{player.species ?? "Chưa có thông tin loài"}</span><span className={styles.playerOnline}><i aria-hidden="true" />Online</span></li>)}
              </ol> : <div className={styles.rosterEmpty}><strong>Đảo đang yên lặng.</strong><p>Nguồn dữ liệu đang hoạt động nhưng chưa ghi nhận người chơi online.</p></div>
            ) : <div className={styles.rosterEmpty} role="status"><strong>Danh sách chưa thể tải.</strong><p>{publicReadStateText[players.state]}. Không có dữ liệu thay thế được hiển thị.</p></div>}
          </div>
        </div>
      </section>

      <footer className={styles.footer}><div className={styles.container}><strong>ĐẠI VIỆT</strong><span>THE ISLE EVRIMA · CỘNG ĐỒNG VIỆT NAM</span><span>Dữ liệu công khai, chỉ đọc</span></div></footer>
    </main>
  );
}
