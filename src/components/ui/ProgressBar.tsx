import type { CSSProperties } from "react";
import styles from "./ProgressBar.module.css";

export function ProgressBar({
  label,
  value,
  max = 100,
}: {
  label: string;
  value: number | null | undefined;
  max?: number;
}) {
  const valid =
    typeof value === "number" &&
    Number.isFinite(value) &&
    Number.isFinite(max) &&
    max > 0;
  const safeValue = valid ? Math.min(max, Math.max(0, value)) : 0;
  const progressStyle = {
    "--progress-width": `${valid ? (safeValue / max) * 100 : 0}%`,
  } as CSSProperties;
  return (
    <div className={styles.row} data-available={valid}>
      <div className={styles.label}>
        <span>{label}</span>
        <small>{valid ? `${Math.round((safeValue / max) * 100)}%` : "Chưa có dữ liệu"}</small>
      </div>
      <div
        className={styles.track}
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={valid ? safeValue : undefined}
        aria-valuetext={valid ? undefined : "Chưa có dữ liệu"}
      >
        <span className={styles.fill} style={progressStyle} />
      </div>
    </div>
  );
}
