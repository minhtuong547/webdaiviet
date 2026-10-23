import type { HTMLAttributes, ReactNode } from "react";
import styles from "./Card.module.css";

export function Card({
  children,
  variant = "default",
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  variant?: "default" | "elevated" | "quiet";
}) {
  return (
    <div
      {...props}
      className={[styles.card, styles[variant], className].filter(Boolean).join(" ")}
    >
      {children}
    </div>
  );
}
