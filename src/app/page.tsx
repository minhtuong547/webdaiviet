import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Download,
  LockKeyhole,
  MessageCircle,
  Radio,
} from "lucide-react";
import { EcosystemShowcase } from "@/components/home/EcosystemShowcase";
import styles from "@/components/home/HomePage.module.css";
import { navigationConfig, type NavigationDestination } from "@/components/navigation/navigation.config";
import { getPublicCommunityData, publicReadStateText } from "@/lib/api/public-community-data";

const featureDescriptions: Record<string, string> = {
  "garage-dino": "Quản lý nhân vật trong hành trình sinh tồn.",
  "garage-skin": "Lưu giữ bộ skin mang dấu ấn riêng.",
  "shop-dino": "Danh mục khủng long chính thức.",
  "shop-skin": "Skin được cập nhật từ cộng đồng.",
  "live-map": "Quan sát đảo khi dữ liệu sẵn sàng.",
  leaderboard: "Thành tích được xác minh công khai.",
  "skin-editor": "Không gian tùy biến skin.",
  donate: "Cổng ủng hộ dành cho dự án.",
  launcher: "Ứng dụng kết nối Đại Việt.",
};

const featureStyle: Record<string, string> = {
  "garage-dino": "featureGarageDino",
  "garage-skin": "featureGarageSkin",
  "shop-dino": "featureShopDino",
  "shop-skin": "featureShopSkin",
  "live-map": "featureLiveMap",
  leaderboard: "featureLeaderboard",
  "skin-editor": "featureSkinEditor",
  donate: "featureDonate",
  launcher: "featureLauncher",
};

const homeFeatures = [
  ...navigationConfig.menus.flatMap((menu) => menu.items),
  ...navigationConfig.destinations,
  navigationConfig.launcher,
] as NavigationDestination[];

function FeatureCard({ feature, index, compact = false }: { feature: NavigationDestination; index: number; compact?: boolean }) {
  const Icon = feature.icon;
  const classes = [
    styles.featureCard,
    styles[featureStyle[feature.id]],
    compact ? styles.featureCompact : "",
    !feature.available || !feature.href ? styles.featureUnavailable : "",
  ].filter(Boolean).join(" ");
  const content = (
    <>
      <span className={styles.featureVisual} aria-hidden="true">{Icon ? <Icon size={compact ? 21 : 26} strokeWidth={1.55} /> : null}</span>
      <span className={styles.featureOrdinal} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
      <span className={styles.featureBody}>
        <strong>{feature.label}</strong>
        <small>{featureDescriptions[feature.id]}</small>
      </span>
      <span className={styles.featureFooter}>
        {feature.available && feature.href ? <span className={styles.featureAction}>Khám phá <ArrowUpRight aria-hidden="true" size={16} /></span> : <span className={styles.featureStatus}>{feature.status ?? "Chưa khả dụng"}</span>}
      </span>
    </>
  );

  if (feature.available && feature.href) {
    return <Link href={feature.href} className={classes} data-home-feature={feature.id}>{content}</Link>;
  }

  return <article className={classes} data-home-feature={feature.id} title={feature.status ?? "Chưa khả dụng"}>{content}</article>;
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
  const serverName = server.data?.name ?? "Máy chủ chờ xác minh";
  const visiblePlayers = players.data?.players.slice(0, 8) ?? [];
  const primaryFeatures = homeFeatures.slice(0, 6);
  const utilityFeatures = homeFeatures.slice(6);
  const serverUnavailable = server.data === null;

  return (
    <main className={styles.page} data-home-page="true">
      <section className={styles.hero} data-home-section="hero" aria-labelledby="hero-title">
        <div className={styles.heroMedia} aria-hidden="true"><Image src="/art/dai-viet-forest-hero.jpg" alt="" fill priority quality={90} sizes="100vw" /></div>
        <div className={styles.heroOverlay} aria-hidden="true" />
        <div className={styles.heroGrain} aria-hidden="true" />
        <div className={styles.heroFrame} aria-hidden="true"><span /><span /><span /></div>
        <aside className={styles.heroHud} data-state={server.state} aria-label="Thông tin máy chủ rút gọn">
          <span>DAI VIET SURVIVAL PORTAL</span>
          <strong title={serverName}>{serverName}</strong>
          <small>{server.state === "LIVE_VERIFIED" ? "Public server signal active" : "Public server signal pending"}</small>
        </aside>
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

          <dl className={styles.serverStrip} data-unavailable={serverUnavailable} aria-label="Tình trạng máy chủ trực tiếp">
            <div className={styles.serverState} data-state={server.state} title={serverName}>
              <dt><span className={styles.serverPulse} aria-hidden="true" /><Radio aria-hidden="true" size={14} />Trạng thái máy chủ</dt>
              <dd>{publicReadStateText[server.state]}</dd>
              <small>{serverName}</small>
            </div>
            <div>
              <dt>PLAYERS ONLINE</dt>
              <dd className={serverUnavailable ? styles.serverValuePending : undefined}>{onlineCount ?? "Chưa xác minh"}</dd>
              <small>IslePilot public read</small>
            </div>
            {maxSlots !== null ? <div><dt>MAX SLOTS</dt><dd>{maxSlots}</dd><small>Máy chủ báo cáo</small></div> : null}
            <div>
              <dt>Cập nhật</dt>
              <dd>{formatTime(server.data?.lastSeenAt)}</dd>
              <small>Thời điểm gần nhất</small>
            </div>
          </dl>
        </div>
      </section>

      <section className={styles.features} data-home-section="ecosystem" aria-labelledby="features-title">
        <div className={styles.container}>
          <header className={styles.sectionHeader}>
            <div><p className={styles.sectionKicker}>01 / DAI VIET PORTAL</p><h2 id="features-title">Khám phá DAI VIET</h2></div>
            <p>Các không gian được trình bày theo đúng tiến độ hiện tại. Không route giả, không cửa hàng hoặc dữ liệu giả.</p>
          </header>
          <div className={styles.featureGrid}>
            {primaryFeatures.map((feature, index) => <FeatureCard feature={feature} index={index} key={feature.id} />)}
          </div>
          <div className={styles.utilityGrid}>
            {utilityFeatures.map((feature, index) => <FeatureCard compact feature={feature} index={index + primaryFeatures.length} key={feature.id} />)}
          </div>
        </div>
      </section>

      <section className={styles.community} data-home-section="community" aria-labelledby="community-title">
        <div className={`${styles.container} ${styles.communityLayout}`}>
          <header className={styles.communityHeader}>
            <p className={styles.sectionKicker}>02 / COMMUNITY LIVE</p>
            <h2 id="community-title">Cộng đồng đang trên đảo</h2>
            <p>Danh sách công khai giữ lại đúng tên, loài và trạng thái trực tuyến đã được IslePilot xác minh.</p>
            <dl className={styles.communityMetrics}>
              <div><dt>PUBLIC ROSTER</dt><dd>{players.data?.count ?? "—"}</dd><small>người chơi</small></div>
              <div><dt>SERVER READ</dt><dd data-state={players.state}>{publicReadStateText[players.state]}</dd></div>
            </dl>
            <Link href="/nguoi-choi" className={styles.communityLink}>Mở danh sách người chơi <ArrowUpRight aria-hidden="true" size={16} /></Link>
          </header>
          <div className={styles.roster}>
            <div className={styles.rosterTop}><div><strong>Public player roster</strong><span>Chỉ dữ liệu đã được phép hiển thị</span></div><span className={styles.rosterLive} data-state={players.state}><i aria-hidden="true" />{players.state === "LIVE_VERIFIED" ? "Live" : "Pending"}</span></div>
            <div className={styles.rosterHeading} aria-hidden="true"><span>Người chơi</span><span>Loài</span><span>Trạng thái</span></div>
            {players.data ? (
              visiblePlayers.length ? <ol className={styles.playerList} aria-label={`${players.data.count} người chơi trực tuyến`}>
                {visiblePlayers.map((player, index) => <li key={`${player.name ?? "unknown"}-${index}`}><strong title={player.name ?? "Người chơi chưa đặt tên"}>{player.name ?? "Người chơi chưa đặt tên"}</strong><span className={styles.speciesTag} title={player.species ?? "Chưa có thông tin loài"}>{player.species ?? "Chưa có thông tin loài"}</span><span className={styles.playerOnline}><i aria-hidden="true" />Online</span></li>)}
              </ol> : <div className={styles.rosterEmpty}><strong>Đảo đang yên lặng.</strong><p>Nguồn dữ liệu đang hoạt động nhưng chưa ghi nhận người chơi online.</p></div>
            ) : <div className={styles.rosterEmpty} role="status"><strong>Danh sách chưa thể tải.</strong><p>{publicReadStateText[players.state]}. Không có dữ liệu thay thế được hiển thị.</p></div>}
          </div>
        </div>
      </section>

      <EcosystemShowcase />

      <section className={styles.cta} data-home-section="cta" aria-labelledby="cta-title">
        <div className={`${styles.container} ${styles.ctaSurface}`}>
          <div className={styles.ctaDecor} aria-hidden="true"><span /><span /></div>
          <div className={styles.ctaCopy}>
            <p className={styles.sectionKicker}>DAI VIET / NEXT STEP</p>
            <h2 id="cta-title">Hành trình sinh tồn bắt đầu tại DAI VIET.</h2>
            <p>Theo dõi máy chủ, gặp cộng đồng và trở lại khi những không gian tiếp theo được xác minh.</p>
          </div>
          <div className={styles.ctaActions}>
            <Link href="/may-chu" className={styles.ctaPrimary}>Khám phá máy chủ <ArrowUpRight aria-hidden="true" size={17} /></Link>
            <span className={styles.ctaUnavailable} title="Discord chưa được cấu hình URL chính thức"><MessageCircle aria-hidden="true" size={16} />Discord đang chờ cấu hình</span>
          </div>
        </div>
      </section>

      <footer className={styles.footer}><div className={styles.container}><strong>ĐẠI VIỆT</strong><span>THE ISLE EVRIMA · CỘNG ĐỒNG VIỆT NAM</span><span>Dữ liệu công khai, chỉ đọc</span></div></footer>
    </main>
  );
}
