import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Compass, Footprints, Radio, Wind } from "lucide-react";
import { PrehistoricMark } from "@/components/brand/PrehistoricMark";
import styles from "@/components/home/HomePage.module.css";
import { navigationConfig } from "@/components/navigation/navigation.config";
import {
  getPublicCommunityData,
  publicReadStateText,
} from "@/lib/api/public-community-data";

const futureTrails = [
  {
    id: "garage",
    label: navigationConfig.menus[0].items
      .map((item) => item.label)
      .join(" & "),
    note: "Nhân vật và dấu ấn riêng sẽ mở theo cùng một hành trình.",
  },
  {
    id: "shop",
    label: navigationConfig.menus[1].items
      .map((item) => item.label)
      .join(" & "),
    note: "Những không gian trao đổi chỉ xuất hiện khi đã sẵn sàng.",
  },
  {
    id: "island-tools",
    label: [
      navigationConfig.destinations[0].label,
      navigationConfig.destinations[1].label,
    ].join(" & "),
    note: "Dữ liệu về đảo và thành tích cần một nguồn đọc đáng tin cậy.",
  },
  {
    id: "community-tools",
    label: [
      navigationConfig.destinations[2].label,
      navigationConfig.destinations[3].label,
      navigationConfig.launcher.label,
    ].join(" / "),
    note: "Các công cụ cộng đồng được giữ lại cho đúng thời điểm.",
  },
] as const;

function formatTime(value: string | null | undefined) {
  if (!value) return "Chờ tín hiệu mới";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Chờ tín hiệu mới"
    : date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}

export const revalidate = 30;

export default async function Home() {
  const { server, players } = await getPublicCommunityData();
  const serverLive = server.state === "LIVE_VERIFIED";
  const onlineCount = server.data?.online ?? null;
  const maxSlots = server.data?.maxPlayers ?? null;
  const serverName = server.data?.name ?? "DAI VIET đang chờ xác minh";
  const visiblePlayers = players.data?.players.slice(0, 7) ?? [];

  return (
    <main className={styles.page} data-home-page="true">
      <section
        className={styles.hero}
        data-home-section="hero"
        aria-labelledby="hero-title"
      >
        <Image
          className={styles.heroMedia}
          src="/art/dai-viet-forest-hero.jpg"
          alt=""
          fill
          priority
          quality={90}
          sizes="100vw"
        />
        <div className={styles.heroShade} aria-hidden="true" />
        <div className={styles.heroCurrent} aria-hidden="true" />
        <div className={styles.heroFrame} aria-hidden="true">
          <span />
          <span />
        </div>
        <PrehistoricMark
          className={styles.heroMark}
          title="Dấu hiệu tiền sử DAI VIET"
        />

        <div className={`${styles.container} ${styles.heroContent}`}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>
              <span />
              THE ISLE EVRIMA / VIETNAM
            </p>
            <h1 id="hero-title">
              DAI
              <br />
              VIET
            </h1>
            <p className={styles.heroClaim}>
              Sinh tồn không phải chuyện một mình.
            </p>
            <p className={styles.heroLead}>
              Một hòn đảo cho những cuộc săn, những cú chạy trốn và những người
              đồng đội vẫn còn ở lại.
            </p>
            <Link href="/may-chu" className={styles.heroAction}>
              Khám phá máy chủ <ArrowUpRight aria-hidden="true" size={18} />
            </Link>
          </div>

          <dl
            className={styles.liveSignal}
            data-live={serverLive}
            aria-label="Tín hiệu máy chủ công khai"
          >
            <div className={styles.signalHeading}>
              <dt>
                <Radio aria-hidden="true" size={14} />
                Tín hiệu từ đảo
              </dt>
              <dd>{publicReadStateText[server.state]}</dd>
            </div>
            <div>
              <dt>Đang trên đảo</dt>
              <dd
                className={
                  onlineCount === null ? styles.pendingValue : undefined
                }
              >
                {onlineCount ?? "—"}
              </dd>
            </div>
            {maxSlots !== null ? (
              <div>
                <dt>Sức chứa báo cáo</dt>
                <dd>{maxSlots}</dd>
              </div>
            ) : null}
            <small title={serverName}>
              {serverName} · {formatTime(server.data?.lastSeenAt)}
            </small>
          </dl>
        </div>
      </section>

      <section
        className={styles.arrival}
        data-home-section="arrival"
        aria-labelledby="arrival-title"
      >
        <div className={styles.container}>
          <p className={styles.sectionNumber}>01</p>
          <div className={styles.arrivalLayout}>
            <div>
              <p className={styles.sectionKicker}>A PLACE TO RETURN TO</p>
              <h2 id="arrival-title">
                Đảo không chờ ai.
                <br />
                <em>Nhưng luôn có chỗ cho đồng đội.</em>
              </h2>
            </div>
            <div className={styles.arrivalText}>
              <Wind aria-hidden="true" size={29} />
              <p>
                DAI VIET là nơi câu chuyện bắt đầu từ những gì đang diễn ra trên
                đảo, không phải từ một danh sách công cụ chưa mở.
              </p>
              <Link href="/may-chu">
                Xem tín hiệu máy chủ{" "}
                <ArrowUpRight aria-hidden="true" size={17} />
              </Link>
            </div>
          </div>
          <div className={styles.arrivalLine} aria-hidden="true">
            <span>THE ISLE / EVRIMA</span>
            <i />
            <span>DAI VIET / 2026</span>
          </div>
        </div>
      </section>

      <section
        className={styles.community}
        data-home-section="community"
        aria-labelledby="community-title"
      >
        <div className={`${styles.container} ${styles.communityLayout}`}>
          <header className={styles.communityCopy}>
            <p className={styles.sectionKicker}>02 / CALLSIGNS ON THE ISLAND</p>
            <h2 id="community-title">
              Những cái tên
              <br />
              đang ở trong rừng.
            </h2>
            <p>
              Chỉ những tín hiệu công khai được IslePilot xác minh mới xuất hiện
              ở đây.
            </p>
            <div
              className={styles.communityRead}
              data-live={players.state === "LIVE_VERIFIED"}
            >
              <span>{players.data?.count ?? "—"}</span>
              <div>
                <strong>{publicReadStateText[players.state]}</strong>
                <small>public community signal</small>
              </div>
            </div>
            <Link href="/nguoi-choi" className={styles.communityLink}>
              Mở danh sách người chơi{" "}
              <ArrowUpRight aria-hidden="true" size={17} />
            </Link>
          </header>

          <div className={styles.callSignField}>
            <div className={styles.fieldHead}>
              <Footprints aria-hidden="true" size={22} />
              <span>FIELD ROLL / PUBLIC</span>
            </div>
            {players.data && visiblePlayers.length ? (
              <ol
                className={styles.callSigns}
                aria-label={`${players.data.count} người chơi công khai`}
              >
                {visiblePlayers.map((player, index) => (
                  <li key={`${player.name ?? "unknown"}-${index}`}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong title={player.name ?? "Người chơi chưa đặt tên"}>
                      {player.name ?? "Người chơi chưa đặt tên"}
                    </strong>
                    <small title={player.species ?? "Chưa có thông tin loài"}>
                      {player.species ?? "Chưa có thông tin loài"}
                    </small>
                    <i aria-label="Online" />
                  </li>
                ))}
              </ol>
            ) : (
              <div className={styles.fieldEmpty} role="status">
                <strong>
                  {players.data ? "Đảo đang lặng." : "Tín hiệu đang chờ."}
                </strong>
                <p>
                  {players.data
                    ? "Chưa ghi nhận người chơi online từ nguồn công khai."
                    : `${publicReadStateText[players.state]}. Không có dữ liệu thay thế được hiển thị.`}
                </p>
              </div>
            )}
            <PrehistoricMark className={styles.fieldMark} />
          </div>
        </div>
      </section>

      <section
        className={styles.trails}
        data-home-section="trails"
        aria-labelledby="trails-title"
      >
        <div className={styles.container}>
          <header className={styles.trailsHeader}>
            <p className={styles.sectionKicker}>03 / BEYOND THE TREE LINE</p>
            <h2 id="trails-title">
              Những lối đi
              <br />
              đang mở dần.
            </h2>
            <p>
              Garage, skin, bản đồ và những công cụ khác sẽ chỉ xuất hiện khi
              hành trình của chúng thật sự bắt đầu.
            </p>
          </header>
          <ol className={styles.trailList}>
            {futureTrails.map((trail, index) => (
              <li key={trail.id}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{trail.label}</strong>
                <small>{trail.note}</small>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        className={styles.finalCall}
        data-home-section="cta"
        aria-labelledby="cta-title"
      >
        <Image
          className={styles.finalMedia}
          src="/art/dai-viet-forest-hero.jpg"
          alt=""
          fill
          sizes="100vw"
        />
        <div className={styles.finalShade} aria-hidden="true" />
        <div className={`${styles.container} ${styles.finalContent}`}>
          <PrehistoricMark className={styles.finalMark} />
          <p className={styles.sectionKicker}>DAI VIET / THE NEXT TRACK</p>
          <h2 id="cta-title">
            Vào rừng
            <br />
            <em>cùng chúng tôi.</em>
          </h2>
          <p>
            Theo dõi máy chủ, gặp cộng đồng, và trở lại khi dấu vết tiếp theo
            xuất hiện.
          </p>
          <Link href="/may-chu" className={styles.finalAction}>
            Khám phá máy chủ <Compass aria-hidden="true" size={18} />
          </Link>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <strong>ĐẠI VIỆT</strong>
          <span>THE ISLE EVRIMA · CỘNG ĐỒNG VIỆT NAM</span>
          <span>Dữ liệu công khai, chỉ đọc</span>
        </div>
      </footer>
    </main>
  );
}
