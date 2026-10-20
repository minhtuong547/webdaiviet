import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { Activity, ArrowUpRight, CircleDot, ShieldCheck, Users } from "lucide-react";
import styles from "@/components/home/HomePage.module.css";
import { navigationConfig } from "@/components/navigation/navigation.config";
import { getPublicCommunityData, publicReadStateText } from "@/lib/api/public-community-data";

const featureDetails: Record<string, { description: string; layout: string }> = {
  "garage-dino": { description: "Không gian quản lý nhân vật khủng long của bạn.", layout: "featureFeatured" },
  "garage-skin": { description: "Bộ sưu tập skin dành cho nhân vật.", layout: "featureTall" },
  "shop-dino": { description: "Danh mục khủng long sẽ được mở khi có contract.", layout: "featureWide" },
  "shop-skin": { description: "Nơi cập nhật skin chính thức của cộng đồng.", layout: "featureCompact" },
  "live-map": { description: "Tín hiệu bản đồ sẽ hiển thị khi route được xác minh.", layout: "featureMap" },
  leaderboard: { description: "Thành tích sẽ xuất hiện khi API cấp quyền đọc.", layout: "featureCompact" },
  "skin-editor": { description: "Công cụ sáng tạo skin đang trong giai đoạn chuẩn bị.", layout: "featureTall" },
  donate: { description: "Cổng ủng hộ chỉ mở khi có đơn vị thanh toán hợp lệ.", layout: "featureDonate" },
  launcher: { description: "Ứng dụng kết nối Đại Việt sẽ được công bố sau.", layout: "featureLauncher" },
};

const homeFeatures = [
  ...navigationConfig.menus.flatMap((menu) => menu.items),
  ...navigationConfig.destinations,
  navigationConfig.launcher,
].map((feature) => ({ ...feature, ...featureDetails[feature.id] }));

function formatTime(value: string | null | undefined) {
  if (!value) return "Chưa có mốc cập nhật";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Mốc thời gian chưa hợp lệ" : date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}

function formatDate(value: string | null | undefined) {
  if (!value) return "Chưa có mốc cập nhật";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Mốc thời gian chưa hợp lệ" : date.toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });
}

export const revalidate = 30;

export default async function Home() {
  const { server, players } = await getPublicCommunityData();
  const serverOnline = server.data?.online ?? null;
  const maxSlots = server.data?.maxPlayers ?? null;
  const playerListCount = players.data?.count ?? null;
  const visiblePlayers = players.data?.players.slice(0, 6) ?? [];
  const population = serverOnline !== null && maxSlots !== null && maxSlots > 0
    ? Math.min(100, Math.round((serverOnline / maxSlots) * 100))
    : null;
  const populationStyle = population === null ? undefined : { "--population": `${population}%` } as CSSProperties;

  return (
    <main className={styles.page} data-home-page="true">
      <section className={styles.hero} data-home-section="hero">
        <div className={`${styles.container} ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>ĐẠI VIỆT · THE ISLE EVRIMA</p>
            <h1 className={styles.title}><span>DAI VIET</span>SỐNG SÓT.<br />SĂN MỒI.<br /><em>THỐNG TRỊ.</em></h1>
            <p className={styles.lead}>Cộng đồng The Isle Evrima dành cho những cuộc săn, những cuộc chạy trốn và những dấu chân vẫn còn trên đảo.</p>
            <div className={styles.actions}>
              <Link className={styles.primaryAction} href="/may-chu" data-home-action="server">Khám phá máy chủ <ArrowUpRight aria-hidden="true" size={16} /></Link>
              <Link className={styles.secondaryAction} href="/nguoi-choi" data-home-action="players">Xem người chơi online</Link>
            </div>
            <dl className={styles.heroFacts} aria-label="Thông tin cộng đồng trực tiếp">
              <div><dt>Máy chủ</dt><dd>{server.data?.name ?? "Chưa xác minh"}</dd></div>
              <div><dt>Danh sách công khai</dt><dd>{playerListCount ?? "—"} người chơi</dd></div>
              <div><dt>Cập nhật</dt><dd>{formatTime(server.data?.lastSeenAt)}</dd></div>
            </dl>
          </div>

          <figure className={styles.heroVisual} aria-label="Minh họa sinh tồn nguyên bản của Đại Việt">
            <Image className={styles.artwork} src="/art/dai-viet-survival-scene.svg" alt="Khủng long trong khung cảnh núi đêm minh họa cho Đại Việt" fill priority sizes="(max-width: 960px) 100vw, 58vw" />
            <figcaption className={styles.artBadge}>SURVIVAL <span aria-hidden="true">{"//"}</span> EVRIMA</figcaption>
            <aside className={styles.liveWidget} aria-label="Tình trạng máy chủ trực tiếp">
              <div className={styles.liveTop}>
                <span className={styles.liveLabel}>LIVE SERVER STATUS</span>
                <span className={styles.liveState} data-state={server.state}><Activity aria-hidden="true" size={13} />{publicReadStateText[server.state]}</span>
              </div>
              <div className={styles.liveBody}>
                <div>
                  <span className={styles.onlineLabel}>PLAYERS ONLINE</span>
                  <strong className={styles.onlineValue}>{serverOnline ?? "—"}<small>người chơi</small></strong>
                  {population === null ? <p className={styles.populationNote}>Max slots chưa được nguồn dữ liệu công khai cung cấp.</p> : <><div className={styles.populationTrack} aria-label={`${population}% số slot đang được sử dụng`}><div className={styles.populationFill} style={populationStyle} /></div><p className={styles.populationNote}>{population}% số slot đang được sử dụng</p></>}
                </div>
                <dl className={styles.widgetMeta}>
                  <div><dt>MAX SLOTS</dt><dd>{maxSlots ?? "—"}</dd><small>{maxSlots === null ? "Chưa công khai" : "Số slot được máy chủ báo cáo"}</small></div>
                  <div><dt>LAST UPDATE</dt><dd>{formatDate(server.data?.lastSeenAt)}</dd></div>
                </dl>
              </div>
            </aside>
          </figure>
        </div>
      </section>

      <section className={styles.community} data-home-section="community" aria-labelledby="community-title">
        <div className={`${styles.container} ${styles.communityLayout}`}>
          <div className={styles.communitySide}>
            <p className={styles.sectionKicker}>COMMUNITY ACTIVITY</p>
            <h2 className={styles.sectionTitle} id="community-title">Những người đang giữ đảo sống động.</h2>
            <p className={styles.sectionLead}>Danh sách chỉ sử dụng tên, loài và trạng thái trực tuyến mà nguồn công khai đã xác minh.</p>
            <div className={styles.communityStat}><strong>{playerListCount ?? "—"}</strong><span>người chơi trong danh sách công khai</span></div>
            <ul className={styles.communityRules}>
              <li><ShieldCheck aria-hidden="true" size={16} />Không hiển thị Steam ID, Discord ID hay dữ liệu quản trị.</li>
              <li><Activity aria-hidden="true" size={16} />Không thay thế dữ liệu thật bằng người chơi mẫu.</li>
            </ul>
          </div>
          <div className={styles.communityPanel}>
            <div className={styles.panelHeader}><strong>Đang trực tuyến</strong><Link href="/nguoi-choi" className={styles.panelLink}>Xem tất cả <ArrowUpRight aria-hidden="true" size={15} /></Link></div>
            {players.data ? (
              visiblePlayers.length ? <ol className={styles.playerList} aria-label={`${players.data.count} người chơi trực tuyến`}>{visiblePlayers.map((player, index) => <li className={styles.playerRow} key={`${player.name ?? "unknown"}-${index}`}><span className={styles.playerSignal}><CircleDot aria-hidden="true" size={13} /></span><span className={styles.playerCopy}><strong>{player.name ?? "Người chơi chưa đặt tên"}</strong><span>{player.species ?? "Chưa có thông tin loài"}</span></span><span className={styles.playerIndex}>{String(index + 1).padStart(2, "0")}</span></li>)}</ol>
                : <div className={styles.emptyPlayers}><div><strong>Đảo đang yên lặng.</strong><p>Nguồn dữ liệu đang hoạt động nhưng chưa ghi nhận người chơi online.</p></div></div>
            ) : <div className={styles.emptyPlayers} role="status"><div><strong>Danh sách chưa thể tải.</strong><p>{publicReadStateText[players.state]}. Không có dữ liệu thay thế được hiển thị.</p></div></div>}
          </div>
        </div>
      </section>

      <section className={styles.ecosystem} data-home-section="ecosystem" aria-labelledby="ecosystem-title">
        <div className={styles.container}>
          <div className={styles.ecosystemHeader}><div><p className={styles.sectionKicker}>DAI VIET ECOSYSTEM</p><h2 className={styles.sectionTitle} id="ecosystem-title">Hệ thống đang lớn lên cùng cộng đồng.</h2></div><p>Mỗi khu vực được hiển thị theo đúng trạng thái hiện tại. Không có route hoặc launcher giả để tạo cảm giác đã sẵn sàng.</p></div>
          <div className={styles.featureGrid}>
            {homeFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return <article className={`${styles.feature} ${styles[feature.layout]}`} data-home-feature={feature.id} key={feature.id} title={feature.status ?? "Chưa khả dụng"}>
                <div className={styles.featureTop}><span className={styles.featureIcon}>{Icon ? <Icon aria-hidden="true" size={20} strokeWidth={1.8} /> : null}</span><span className={styles.featureIndex}>{String(index + 1).padStart(2, "0")}</span></div>
                <div className={styles.featureCopy}><strong>{feature.label}</strong><p>{featureDetails[feature.id]?.description}</p><span className={styles.featureStatus}>{feature.status ?? "Chưa khả dụng"}</span></div>
              </article>;
            })}
          </div>
        </div>
      </section>

      <section className={styles.identity} aria-labelledby="identity-title">
        <div className={`${styles.container} ${styles.identityLayout}`}>
          <div><p className={styles.sectionKicker}>WHY DAI VIET</p><h2 className={styles.identityTitle} id="identity-title">Một thế giới sinh tồn <em>có cộng đồng thật.</em></h2></div>
          <div><p className={styles.identityLead}>Đại Việt là điểm gặp của cộng đồng The Isle Evrima Việt Nam, dữ liệu công khai có kiểm soát và những hệ thống chỉ được mở khi đã sẵn sàng.</p><ol className={styles.identityList}><li><span>01</span><div><strong>Đảo của cộng đồng Việt Nam</strong><p>Một không gian tập trung vào trải nghiệm The Isle Evrima và những người đang chơi.</p></div></li><li><span>02</span><div><strong>Dữ liệu đúng trạng thái</strong><p>Thông tin máy chủ và người chơi chỉ hiển thị từ nguồn đã xác minh.</p></div></li><li><span>03</span><div><strong>Hệ sinh thái có chủ đích</strong><p>Garage, shop và công cụ chỉ mở khi có route, contract hoặc URL hợp lệ.</p></div></li></ol></div>
        </div>
      </section>

      <section className={styles.cta} aria-labelledby="cta-title">
        <div className={styles.container}><div className={styles.ctaSurface}><div><p className={styles.sectionKicker}>YOUR NEXT MOVE</p><h2 className={styles.ctaTitle} id="cta-title">Gia nhập thế giới <em>DAI VIET.</em></h2><p className={styles.ctaCopy}>Kiểm tra tình trạng đảo, xem những người đang online và theo dõi hệ sinh thái Đại Việt khi từng phần được xác minh.</p></div><div className={styles.ctaActions}><Link className={styles.primaryAction} href="/may-chu">Xem máy chủ <ArrowUpRight aria-hidden="true" size={16} /></Link><Link className={styles.secondaryAction} href="/nguoi-choi">Khám phá cộng đồng <Users aria-hidden="true" size={16} /></Link></div></div></div>
      </section>

      <footer className={styles.footer}><div className={styles.container}><strong>ĐẠI VIỆT</strong><span>THE ISLE EVRIMA · CỘNG ĐỒNG VIỆT NAM</span><span>Dữ liệu công khai, chỉ đọc</span></div></footer>
    </main>
  );
}
