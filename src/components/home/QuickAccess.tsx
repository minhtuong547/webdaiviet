import { LockKeyhole } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { navigationConfig } from "@/components/navigation/navigation.config";
import styles from "./PortalHome.module.css";

const quickAccess = [
  ...navigationConfig.menus.flatMap((menu) => menu.items),
  ...navigationConfig.destinations,
  navigationConfig.launcher,
];

export function QuickAccess() {
  return (
    <section className={styles.quickSection} data-panel="quick-access" aria-labelledby="quick-title">
      <div className={styles.sectionHeading}><div><p className={styles.overline}>PORTAL SHORTCUTS</p><h2 id="quick-title">Lối vào nhanh</h2></div><span>Tiện ích sẽ mở theo từng mốc xác minh.</span></div>
      <div className={styles.quickGrid}>
        {quickAccess.map((item) => { const Icon = item.icon ?? LockKeyhole; return <Card key={item.id} className={styles.quickCard} variant="quiet" aria-disabled="true"><span className={styles.quickIcon}><Icon aria-hidden="true" size={17} /></span><div><strong>{item.label}</strong><small>{item.available ? "Mở không gian" : item.status ?? "Sắp ra mắt"}</small></div><LockKeyhole aria-hidden="true" size={14} /></Card>; })}
      </div>
    </section>
  );
}
