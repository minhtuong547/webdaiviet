import Link from "next/link";
import { Activity, ArrowUpRight, CircleDot, Radio, ShieldCheck, Users } from "lucide-react";
import { getPublicCommunityData, publicReadStateText } from "@/lib/api/public-community-data";

function formatTime(value: string | null | undefined) {
  if (!value) return "Đang chờ tín hiệu mới";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Mốc thời gian chưa hợp lệ" : date.toLocaleTimeString("vi-VN");
}

export const revalidate = 30;

export default async function Home() {
  const { server, players } = await getPublicCommunityData();
  const online = server.data?.online ?? null;
  const capacity = online === null ? "—" : server.data?.maxPlayers ? `${online} / ${server.data.maxPlayers}` : String(online);
  const visiblePlayers = players.data?.players.slice(0, 6) ?? [];

  return (
    <main className="home" data-home-page="true">
      <section className="homeHero">
        <div className="homeContainer homeHeroGrid">
          <div className="homeHeroCopy">
            <p className="homeEyebrow">ĐẠI VIỆT · THE ISLE EVRIMA</p>
            <h1 className="homeTitle">Nơi bản năng<br />gặp <em>bầy đàn.</em></h1>
            <p className="homeLead">Một không gian cộng đồng được xây quanh những phiên sinh tồn thật, dữ liệu trực tiếp có kiểm soát và những người vẫn đang trên đảo.</p>
            <div className="homeActions">
              <Link className="homeActionPrimary" href="/may-chu" data-home-action="server">Khám phá máy chủ <ArrowUpRight aria-hidden="true" size={16} /></Link>
              <Link className="homeActionSecondary" href="/nguoi-choi" data-home-action="players">Gặp những người trên đảo</Link>
            </div>
            <dl className="homeHeroMetrics" aria-label="Tóm tắt cộng đồng">
              <div><dt>Máy chủ</dt><dd>{server.data?.name ?? "Chưa xác minh"}</dd></div>
              <div><dt>Người đang online</dt><dd>{players.data?.count ?? "—"}</dd></div>
              <div><dt>Lần cập nhật</dt><dd>{formatTime(server.data?.lastSeenAt)}</dd></div>
            </dl>
          </div>

          <aside className="homeLivePanel" aria-label="Tình trạng trực tiếp">
            <div className="homeLiveHeader"><span className="homePanelLabel">TÍN HIỆU TRỰC TIẾP</span><span className="homeState" data-state={server.state}><Activity aria-hidden="true" size={14} />{publicReadStateText[server.state]}</span></div>
            <div className="homeLiveValue"><span>SỨC CHỨA HIỆN TẠI</span><strong>{capacity}</strong><small>{server.data?.maxPlayers ? "Người chơi / giới hạn" : "Người chơi được máy chủ báo cáo"}</small></div>
            <div className="homeLiveDivider" />
            <div className="homeLiveFooter"><span><CircleDot aria-hidden="true" size={15} />Danh sách công khai</span><strong>{players.data?.count ?? "—"} online</strong></div>
          </aside>
        </div>
      </section>

      <section className="homeSignal" aria-labelledby="home-signal-title">
        <div className="homeContainer">
          <div className="homeSectionHeading"><div><p className="homeEyebrow">DÒNG CHẢY CỘNG ĐỒNG</p><h2 id="home-signal-title">Tình trạng, không phải phỏng đoán.</h2></div><p>Chỉ các trường dữ liệu công khai đã xác minh được hiển thị ở đây. Khi nguồn không sẵn sàng, trạng thái thực được giữ nguyên.</p></div>
          <div className="homeSignalGrid">
            <article className="homeSignalCard"><div className="homeCardIcon"><Radio aria-hidden="true" size={19} /></div><span>Máy chủ</span><strong>{server.data?.name ?? "Chưa xác minh tên máy chủ"}</strong><small>{publicReadStateText[server.state]}</small></article>
            <article className="homeSignalCard"><div className="homeCardIcon homeCardIconMint"><Users aria-hidden="true" size={19} /></div><span>Người chơi</span><strong>{players.data?.count ?? "—"} trực tuyến</strong><small>{publicReadStateText[players.state]}</small></article>
            <article className="homeSignalCard"><div className="homeCardIcon"><ShieldCheck aria-hidden="true" size={19} /></div><span>Quyền riêng tư</span><strong>Dữ liệu đã lọc</strong><small>Không Steam ID, Discord ID, ví hay dữ liệu quản trị.</small></article>
          </div>
        </div>
      </section>

      <section className="homeRoster" aria-labelledby="home-roster-title">
        <div className="homeContainer">
          <div className="homeSectionHeading"><div><p className="homeEyebrow">TRÊN ĐẢO LÚC NÀY</p><h2 id="home-roster-title">Những dấu chân đang tiếp tục.</h2></div><Link href="/nguoi-choi" className="homeTextLink">Xem toàn bộ danh sách <ArrowUpRight aria-hidden="true" size={15} /></Link></div>
          {players.data ? (
            visiblePlayers.length ? <ul className="homePlayerGrid" aria-label={`${players.data.count} người chơi trực tuyến`}>{visiblePlayers.map((player, index) => <li key={`${player.name ?? "unknown"}-${index}`}><span><CircleDot aria-hidden="true" size={14} />Online</span><strong>{player.name ?? "Người chơi chưa đặt tên"}</strong><small>{player.species ?? "Chưa có thông tin loài"}</small></li>)}</ul>
              : <div className="homeEmpty"><strong>Đảo đang yên lặng.</strong><p>Nguồn dữ liệu đang hoạt động nhưng chưa ghi nhận người chơi online tại thời điểm cập nhật.</p></div>
          ) : <div className="homeEmpty"><strong>Danh sách chưa thể tải.</strong><p>{publicReadStateText[players.state]}. Không có người chơi mẫu được thay thế vào giao diện.</p></div>}
        </div>
      </section>

      <section className="homePaths" aria-labelledby="home-paths-title">
        <div className="homeContainer"><div className="homeSectionHeading"><div><p className="homeEyebrow">LỐI ĐI CÔNG KHAI</p><h2 id="home-paths-title">Đi sâu hơn khi bạn cần.</h2></div></div>
          <div className="homePathGrid">
            <Link href="/may-chu" className="homePath"><span className="homePathNumber">01</span><div><strong>Trạng thái máy chủ</strong><small>Xem tín hiệu trực tiếp, sức chứa và thời điểm cập nhật.</small></div><ArrowUpRight aria-hidden="true" size={20} /></Link>
            <Link href="/nguoi-choi" className="homePath"><span className="homePathNumber">02</span><div><strong>Người chơi trực tuyến</strong><small>Xem danh sách công khai gồm tên và loài đang online.</small></div><ArrowUpRight aria-hidden="true" size={20} /></Link>
          </div>
        </div>
      </section>

      <footer className="homeFooter"><div className="homeContainer"><strong>ĐẠI VIỆT</strong><span>THE ISLE EVRIMA · CỘNG ĐỒNG VIỆT NAM</span><span>Dữ liệu công khai, chỉ đọc</span></div></footer>
    </main>
  );
}
