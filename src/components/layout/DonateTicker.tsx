"use client";

import { Heart, Pause, Play } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./DonateTicker.module.css";

const neutralMessage = "Cảm ơn những người đang giữ lửa cho cộng đồng DAI VIET";
const tickerRoutes = new Set(["/"]);

export function DonateTicker({ enabled = true }: { enabled?: boolean }) {
  const [paused, setPaused] = useState(false);
  const pathname = usePathname();
  if (!enabled || !tickerRoutes.has(pathname ?? "")) return null;

  return (
    <aside className={styles.ticker} aria-label="Thông điệp cộng đồng">
      <div className={styles.inner}>
        <span className={styles.label}><Heart aria-hidden="true" size={13} fill="currentColor" /> CỘNG ĐỒNG</span>
        <div className={styles.viewport}>
          <div className={styles.track} data-paused={paused}>
            <span>{neutralMessage}</span>
            <span aria-hidden="true">{neutralMessage}</span>
          </div>
        </div>
        <button
          type="button"
          className={styles.pause}
          aria-label={paused ? "Tiếp tục chuyển động thông điệp" : "Tạm dừng thông điệp"}
          aria-pressed={paused}
          onClick={() => setPaused((current) => !current)}
        >
          {paused ? <Play aria-hidden="true" size={13} /> : <Pause aria-hidden="true" size={13} />}
        </button>
      </div>
    </aside>
  );
}

export default DonateTicker;
