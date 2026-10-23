import { Circle } from "lucide-react";
import styles from "./StatusIndicator.module.css";

export function StatusIndicator({
  status,
  label,
  className,
}: {
  status: "online" | "warning" | "unavailable";
  label?: string;
  className?: string;
}) {
  return (
    <span className={[styles.status, styles[status], className].filter(Boolean).join(" ")}>
      <Circle aria-hidden="true" size={8} fill="currentColor" />
      {label ?? (status === "online" ? "Online" : status === "warning" ? "Đang kiểm tra" : "Chưa khả dụng")}
    </span>
  );
}
