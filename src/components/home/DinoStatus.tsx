import { LockKeyhole, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import styles from "./PortalHome.module.css";

export const dinoMetricLabels = [
  "Sinh trưởng",
  "Sức khỏe",
  "Đói",
  "Khát",
  "Thể lực",
] as const;

export type DinoMetricValues = Partial<
  Record<(typeof dinoMetricLabels)[number], number | null>
>;

export function DinoStatus({ metrics = {} }: { metrics?: DinoMetricValues }) {
  return (
    <Card className={styles.dinoCard} data-panel="dino-status">
      <div className={styles.panelHeader}><div><p className={styles.overline}>PLAYER SPACE</p><h2>Trạng thái khủng long</h2></div><Sparkles aria-hidden="true" size={19} /></div>
      <div className={styles.gatedCopy}><LockKeyhole aria-hidden="true" size={20} /><div><strong>Chỉ số được bảo vệ theo tài khoản</strong><p>Chỉ hiện trường dữ liệu được IslePilot cấp quyền và xác minh; mục chưa có dữ liệu sẽ giữ trạng thái trống.</p></div></div>
      <div className={styles.metricStack}>
        {dinoMetricLabels.map((metric) => (
          <ProgressBar key={metric} label={metric} value={metrics[metric]} />
        ))}
      </div>
    </Card>
  );
}
