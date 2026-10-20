import DaiVietNavbar from "@/components/navigation/DaiVietNavbar";
import styles from "./page.module.css";

export const metadata = {
  title: "Navbar Preview | Đại Việt",
  robots: { index: false, follow: false },
};

export default function NavbarPreviewPage() {
  return (
    <main className={styles.preview}>
      <DaiVietNavbar />
      <section className={styles.canvas}>
        <div className={styles.grid} aria-hidden="true" />
        <div className={styles.content}>
          <p className={styles.eyebrow}>DAI VIET · NAVBAR PREVIEW</p>
          <h1>Điều hướng cho<br /><em>những kẻ sống sót.</em></h1>
          <p className={styles.description}>Trang preview độc lập để kiểm tra trạng thái desktop, dropdown, mobile drawer và các điểm chạm điều hướng.</p>
          <div className={styles.pills}><span>1280px desktop</span><span>390px mobile</span><span>Accessible states</span></div>
        </div>
        <div className={styles.ghostCard}><span /> <span /> <span /></div>
      </section>
    </main>
  );
}
