import { Activity, ArrowUpRight, Compass, Crown, Gamepad2, Shield, Users } from "lucide-react";
import { getLeaderboard, getPlayers, getServer } from "@/lib/api/islepilot-endpoints";
import { parseServerSnapshot, publicPlayersSummary } from "@/lib/api/islepilot-schemas";

const stateText: Record<string, string> = {
  NOT_CONFIGURED: "Chưa cấu hình API key",
  UNAUTHORIZED: "API key không được chấp nhận",
  MISSING_SCOPE: "API key thiếu quyền đọc",
  ENTITLEMENT_UNAVAILABLE: "Tính năng chưa có trong gói IslePilot",
  RATE_LIMITED: "Đang giới hạn yêu cầu; thử lại sau",
  UPSTREAM_UNAVAILABLE: "Không kết nối được IslePilot",
  INVALID_RESPONSE: "Phản hồi IslePilot chưa đúng định dạng",
  NOT_FOUND: "Endpoint chưa được cung cấp",
};

async function getDashboardData() {
  const [serverResult, playersResult, leaderboardResult] = await Promise.all([getServer(), getPlayers(), getLeaderboard()]);
  const server = serverResult.ok ? parseServerSnapshot(serverResult.data) : null;
  const players = playersResult.ok ? publicPlayersSummary(playersResult.data) : null;
  const leaders = leaderboardResult.ok ? leaderboardResult.data : null;
  return { serverResult, playersResult, leaderboardResult, server: server?.success ? server.data : null, players, leaders };
}

export default async function Home() {
  const { serverResult, playersResult, leaderboardResult, server, players, leaders } = await getDashboardData();
  const serverState = serverResult.ok ? (server ? "OK" : "INVALID_RESPONSE") : serverResult.code;
  const leaderboardState = leaderboardResult.ok ? "OK" : leaderboardResult.code;
  const leaderCount = Array.isArray(leaders) ? leaders.length : (leaders && typeof leaders === "object" && Array.isArray((leaders as {leaderboard?:unknown[]}).leaderboard) ? (leaders as {leaderboard:unknown[]}).leaderboard.length : null);
  return <main><section className="hero"><div className="eyebrow"><span className="dot"/> CỘNG ĐỒNG THE ISLE EVRIMA</div><h1>Tiếng gọi<br/>của <em>hoang dã.</em></h1><p>Một thế giới sinh tồn, nơi mỗi dấu chân kể nên câu chuyện. Sống cùng bầy đàn Đại Việt.</p><div className="actions"><a className="primary" href="#server">Khám phá máy chủ <ArrowUpRight size={16}/></a><a className="secondary" href="#community">Tham gia cộng đồng</a></div><div className="hero-art"><div className="sun"/><div className="ridge ridge-a"/><div className="ridge ridge-b"/><div className="ridge ridge-c"/><div className="hero-caption">VÙNG ĐẤT CỦA NHỮNG KẺ SỐNG SÓT <span>01 / 04</span></div></div></section><section className="stats" id="server"><div className="stat-head"><div><span className="kicker">TRỰC TIẾP TỪ ĐẢO</span><h2>Thế giới vẫn đang sống.</h2></div><span className="status"><Activity size={15}/> {serverState === "OK" ? "DỮ LIỆU ISLEPILOT ĐÃ XÁC MINH" : stateText[serverState]}</span></div><div className="stat-grid"><article><span><Users/> Người chơi</span><strong>{server?.online ?? "—"}</strong><small>{server?.lastSeenAt ? `Cập nhật ${new Date(server.lastSeenAt).toLocaleTimeString("vi-VN")}` : stateText[serverState]}</small></article><article><span><Gamepad2/> Máy chủ</span><strong>{server ? "Đang phản hồi" : "—"}</strong><small>{server?.name ?? stateText[serverState]}</small></article><article><span><Crown/> Bảng xếp hạng</span><strong>{leaderCount ?? "—"}</strong><small>{leaderboardState === "OK" ? "Bản ghi nhận từ API IslePilot" : stateText[leaderboardState]}</small></article><article><span><Shield/> Trạng thái tích hợp</span><strong>{serverState === "OK" ? "Đã xác minh" : "Chưa xác minh"}</strong><small>{serverState === "OK" ? "HTTP 200 và schema hợp lệ" : "Không hiển thị dữ liệu mô phỏng"}</small></article></div></section><section className="players" id="players"><div className="stat-head"><div><span className="kicker">NGƯỜI CHƠI ĐANG TRỰC TUYẾN</span><h2>Những người đang trên đảo.</h2></div><span className="status"><Users size={15}/> {playersResult.ok ? `${players?.count ?? 0} NGƯỜI` : stateText[playersResult.code]}</span></div>{playersResult.ok && players ? <div className="player-grid">{players.players.map((player,index)=><article key={`${player.name}-${index}`}><strong>{player.name ?? "Người chơi"}</strong><small>{player.species ?? "Đang sinh tồn"}</small></article>)}</div> : <p className="empty-state">{playersResult.ok ? "Dữ liệu người chơi chưa đúng định dạng." : stateText[playersResult.code]}</p>}</section><section className="lower" id="community"><div><span className="kicker">LÃNH THỔ CỦA CHÚNG TA</span><h2>Chọn hành trình<br/>của bạn.</h2></div><div className="tiles"><a href="#"><Compass/><b>Bản đồ đảo</b><small>Khám phá các khu vực</small><ArrowUpRight/></a><a href="#"><Crown/><b>Người dẫn đầu</b><small>{leaderCount === null ? stateText[leaderboardState] : `${leaderCount} bản ghi thật từ IslePilot`}</small><ArrowUpRight/></a></div></section><footer>ĐẠI VIỆT <span>THE ISLE EVRIMA · CỘNG ĐỒNG VIỆT NAM</span></footer></main>
}
