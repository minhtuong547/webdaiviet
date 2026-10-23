import { LockKeyhole, Radio, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatusIndicator } from "@/components/ui/StatusIndicator";
import type { PublicPlayersData, PublicRead, PublicServerData } from "@/lib/api/public-community-data";
import { CommunityRoster } from "./CommunityRoster";
import { DinoStatus } from "./DinoStatus";
import { QuickAccess } from "./QuickAccess";
import { ServerStatus } from "./ServerStatus";
import styles from "./PortalHome.module.css";
import SiteFooter from "@/components/layout/SiteFooter";
import type { HomeViewer } from "@/lib/security/home-viewer";

export function PortalHome({
  server,
  players,
  viewer,
}: {
  server: PublicRead<PublicServerData>;
  players: PublicRead<PublicPlayersData>;
  viewer: HomeViewer;
}) {
  const isPlayer = viewer.mode === "player";

  return (
    <main className={styles.page} data-home-page="true" data-viewer-mode={viewer.mode}>
      <div className={styles.container}>
        <section className={styles.portalHeader} aria-labelledby="portal-title">
          <div className={styles.welcome}>
            <p className={styles.overline}>01 / DAI VIET PORTAL</p>
            <h1 id="portal-title">
              {isPlayer ? "Chào mừng trở lại, " : "Chào mừng đến "}
              <em>{isPlayer ? "người sống sót." : "DAI VIET."}</em>
            </h1>
            <p className={styles.lead}>
              {isPlayer
                ? "Những dữ liệu đã được cấp quyền sẽ xuất hiện tại đây khi hợp đồng IslePilot sẵn sàng."
                : "Một không gian chung cho những cuộc săn, những lần trở về và các tín hiệu thật đang diễn ra trên đảo."}
            </p>
            <div className={styles.welcomeMeta}>
              <StatusIndicator status="online" label={isPlayer ? "Phiên đã xác minh" : "Public portal"} />
              <span>{isPlayer ? "Player access · riêng tư" : "Guest access · chỉ đọc"}</span>
            </div>
          </div>
          <Card className={styles.identityCard} variant="elevated" data-panel="player-identity">
            <div className={styles.identityTop}>
              <div className={styles.avatar}>DV</div>
              <div>
                <p className={styles.overline}>PLAYER IDENTITY</p>
                <h2>{isPlayer ? "Tài khoản Steam đã xác minh" : "Không gian cá nhân"}</h2>
              </div>
            </div>
            <p>
              {isPlayer
                ? "Steam ID và dữ liệu cá nhân không được hiển thị tại đây."
                : "Đăng nhập Steam sẽ mở các khu vực cá nhân khi luồng xác minh được cấu hình."}
            </p>
            {isPlayer ? (
              <span className={styles.unavailableText}>Dữ liệu Garage đang chờ quyền đọc</span>
            ) : (
              <Button variant="secondary" disabled>
                <LockKeyhole aria-hidden="true" size={15} /> Kết nối Steam · Chưa khả dụng
              </Button>
            )}
          </Card>
        </section>

        <div className={styles.mainGrid}>
          <div className={styles.primaryColumn}>
            <ServerStatus server={server} />
            <section className={styles.previewGrid} aria-label="Các không gian trong portal">
              <Card className={[styles.previewCard, styles.previewDino].join(" ")} variant="elevated"><Sparkles aria-hidden="true" size={20} /><p className={styles.overline}>GARAGE DINO</p><h2>Nhân vật của bạn.</h2><p>Không gian lưu giữ hành trình sinh tồn sẽ được mở khi có route và dữ liệu được xác minh.</p><span className={styles.unavailableText}>Sắp ra mắt</span></Card>
              <Card className={[styles.previewCard, styles.previewSkin].join(" ")} variant="default"><Radio aria-hidden="true" size={20} /><p className={styles.overline}>GARAGE SKIN</p><h2>Dấu ấn riêng.</h2><p>Skin và customization chưa có contract đọc hợp lệ cho production.</p><span className={styles.unavailableText}>Sắp ra mắt</span></Card>
            </section>
            {isPlayer ? <DinoStatus /> : null}
            <QuickAccess />
          </div>
          <aside className={styles.sidebar}>
            <Card className={styles.sideNote} variant="quiet"><ShieldCheck aria-hidden="true" size={20} /><p className={styles.overline}>PUBLIC BY DESIGN</p><h2>Chỉ hiển thị những gì đã được xác minh.</h2><p>Không Steam ID, Discord ID, ví, dữ liệu quản trị hoặc chỉ số cá nhân được đưa vào portal công khai.</p><div><span>IslePilot BFF</span><strong>read-only</strong></div></Card>
            <CommunityRoster players={players} />
          </aside>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
