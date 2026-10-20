import { AlertCircle } from "lucide-react";
import styles from "./PublicCommunityPage.module.css";

export function PublicPageLoading({ title }: { title: string }) {
  return (
    <main className={styles.page} aria-busy="true">
      <section className={styles.hero}>
        <div className={styles.container}>
          <p className={styles.eyebrow}>ĐẠI VIỆT · DỮ LIỆU CÔNG KHAI</p>
          <h1 className={styles.heading}>{title}</h1>
          <p className={styles.lead}>Đang tải dữ liệu đã được xác minh từ máy chủ.</p>
        </div>
      </section>
      <section className={styles.content}>
        <div className={styles.container}><div className={styles.loadingGrid}><div className={styles.skeleton} /><div className={styles.skeleton} /><div className={styles.skeleton} /></div></div>
      </section>
    </main>
  );
}

export function PublicPageError({ title, reset }: { title: string; reset: () => void }) {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <p className={styles.eyebrow}>ĐẠI VIỆT · DỮ LIỆU CÔNG KHAI</p>
          <h1 className={styles.heading}>{title}</h1>
        </div>
      </section>
      <section className={styles.content}>
        <div className={styles.container}>
          <div className={styles.empty} role="alert">
            <AlertCircle aria-hidden="true" size={24} />
            <strong>Trang chưa thể tải hoàn chỉnh.</strong>
            <p>Không có dữ liệu thay thế được hiển thị. Hãy thử lại khi kết nối đến nguồn dữ liệu sẵn sàng.</p>
            <button type="button" className={styles.retry} onClick={reset}>Thử lại</button>
          </div>
        </div>
      </section>
    </main>
  );
}
