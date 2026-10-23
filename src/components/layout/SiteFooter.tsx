import { Heart } from "lucide-react";
import Link from "next/link";
import { navigationConfig } from "@/components/navigation/navigation.config";
import styles from "./SiteFooter.module.css";

function FooterDestination({ item }: { item: { id: string; label: string; href: string | null; available: boolean; status?: string } }) {
  if (!item.available || !item.href) {
    return <span aria-disabled="true" title={item.status ?? "Chưa khả dụng"}>{item.label}<small>{item.status ?? "Chưa khả dụng"}</small></span>;
  }
  return <Link href={item.href}>{item.label}</Link>;
}

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}><strong>DAI VIET</strong><span>NEXT-GEN SURVIVAL PORTAL</span><p>Một cộng đồng The Isle Evrima do người Việt xây dựng và giữ lửa.</p></div>
        <div className={styles.column}><strong>KHÁM PHÁ</strong>{navigationConfig.menus.flatMap((menu) => menu.items).map((item) => <FooterDestination key={item.id} item={item} />)}</div>
        <div className={styles.column}><strong>ĐỒNG HÀNH</strong>{navigationConfig.destinations.map((item) => <FooterDestination key={item.id} item={item} />)}<FooterDestination item={navigationConfig.launcher} /></div>
        <div className={styles.column}><strong>DỮ LIỆU CÔNG KHAI</strong><Link href="/may-chu">Máy chủ</Link><Link href="/nguoi-choi">Người chơi online</Link></div>
        <div className={styles.legal}><span>© 2026 DAI VIET</span><span>Dữ liệu công khai, chỉ đọc.</span><span className={styles.heart}><Heart aria-hidden="true" size={13} /> Cộng đồng Đại Việt</span></div>
      </div>
    </footer>
  );
}

export default SiteFooter;
