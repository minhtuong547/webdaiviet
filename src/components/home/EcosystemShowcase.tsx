"use client";

import { useState } from "react";
import { Activity, Palette, ShieldCheck, Trophy, Users, VenetianMask } from "lucide-react";
import styles from "./EcosystemShowcase.module.css";

const showcaseItems = [
  {
    id: "survival",
    label: "Sinh tồn",
    title: "Theo dõi đảo từ những tín hiệu đã xác minh.",
    description: "Trạng thái máy chủ và roster công khai là điểm khởi đầu cho trải nghiệm DAI VIET.",
    status: "Dữ liệu công khai đang hiển thị",
    Icon: Activity,
  },
  {
    id: "garage",
    label: "Quản lý Dino",
    title: "Garage được thiết kế cho hành trình dài hơn.",
    description: "Không gian quản lý Dino chỉ mở khi route và contract liên quan đã sẵn sàng.",
    status: "Sắp ra mắt",
    Icon: VenetianMask,
  },
  {
    id: "skin",
    label: "Skin & Customization",
    title: "Cá tính hóa, có kiểm soát và đúng tiến độ.",
    description: "Skin, editor và thư viện màu được giữ ở trạng thái định hướng cho đến khi dịch vụ hợp lệ được công bố.",
    status: "Sắp ra mắt",
    Icon: Palette,
  },
  {
    id: "community",
    label: "Cộng đồng",
    title: "Một cộng đồng thật ở phía sau mỗi tín hiệu live.",
    description: "Tên, loài và trạng thái online chỉ xuất hiện khi API công khai cho phép.",
    status: "Dữ liệu công khai đang hiển thị",
    Icon: Users,
  },
  {
    id: "ranking",
    label: "Xếp hạng",
    title: "Thành tích sẽ chỉ xuất hiện khi có nguồn đọc đáng tin cậy.",
    description: "DAI VIET không hiển thị bảng xếp hạng hay chỉ số thành tích thay thế khi endpoint chưa tồn tại.",
    status: "Chưa có route",
    Icon: Trophy,
  },
] as const;

export function EcosystemShowcase() {
  const [activeId, setActiveId] = useState<(typeof showcaseItems)[number]["id"]>("survival");
  const activeItem = showcaseItems.find((item) => item.id === activeId) ?? showcaseItems[0];
  const ActiveIcon = activeItem.Icon;

  return (
    <section className={styles.section} data-home-section="showcase" aria-labelledby="showcase-title">
      <div className={styles.container}>
        <header className={styles.header}>
          <div><p>03 / ECOSYSTEM</p><h2 id="showcase-title">Một thế giới. Nhiều trải nghiệm.</h2></div>
          <span>Chọn một hướng để xem trạng thái phát triển hiện tại.</span>
        </header>
        <div className={styles.surface}>
          <div className={styles.tabList} role="tablist" aria-label="Nhóm trải nghiệm DAI VIET">
            {showcaseItems.map((item) => {
              const Icon = item.Icon;
              const active = item.id === activeId;
              return <button type="button" className={active ? styles.tabActive : styles.tab} key={item.id} role="tab" aria-selected={active} aria-controls="ecosystem-preview" onClick={() => setActiveId(item.id)}><Icon aria-hidden="true" size={16} /><span>{item.label}</span></button>;
            })}
          </div>
          <div className={styles.preview} id="ecosystem-preview" role="tabpanel">
            <div className={styles.previewIcon} aria-hidden="true"><ActiveIcon size={35} strokeWidth={1.45} /></div>
            <div className={styles.previewCopy}><span>{activeItem.label}</span><h3>{activeItem.title}</h3><p>{activeItem.description}</p></div>
            <div className={styles.previewStatus}><ShieldCheck aria-hidden="true" size={15} /><span>{activeItem.status}</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}
