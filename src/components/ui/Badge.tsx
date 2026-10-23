import type { ReactNode } from "react";
import styles from "./Badge.module.css";

export function Badge({
  children,
  variant = "neutral",
  className,
}: {
  children: ReactNode;
  variant?: "neutral" | "online" | "warning" | "unavailable";
  className?: string;
}) {
  return <span className={[styles.badge, styles[variant], className].filter(Boolean).join(" ")}>{children}</span>;
}
