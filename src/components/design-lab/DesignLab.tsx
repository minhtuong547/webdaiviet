import Image from "next/image";
import { ArrowDownRight, Compass, Feather, MapPinned } from "lucide-react";
import { PrehistoricMark } from "@/components/brand/PrehistoricMark";
import styles from "./DesignLab.module.css";

export type DesignDirection = "lost-world" | "survival-archive" | "the-island";

type DesignLabProps = {
  direction: DesignDirection;
};

const directions = {
  "lost-world": {
    label: "Direction A",
    name: "The Lost World",
    statement: "Một thế giới tiền sử, trước khi bất kỳ bản đồ nào được mở ra.",
  },
  "survival-archive": {
    label: "Direction B",
    name: "Survival Archive",
    statement: "Dấu vết của một hòn đảo được lưu lại như nhật ký viễn chinh.",
  },
  "the-island": {
    label: "Direction C",
    name: "The Island",
    statement:
      "Một cổng cộng đồng được tạo nên từ rừng, tín hiệu và những cái tên thật.",
  },
} as const;

function LostWorld() {
  return (
    <>
      <section className={styles.lostHero}>
        <Image
          src="/art/dai-viet-forest-hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
        />
        <div className={styles.lostVeil} aria-hidden="true" />
        <PrehistoricMark className={styles.lostMark} />
        <div className={styles.lostCopy}>
          <p>DAI VIET / DIRECTION A</p>
          <h1>The Lost World</h1>
          <strong>Rừng già không im lặng.</strong>
          <span>
            Một hướng điện ảnh: khủng long là tâm điểm, giao diện chỉ là tiếng
            thì thầm ở phía sau.
          </span>
        </div>
        <div className={styles.lostHorizon} aria-hidden="true">
          <span>01</span>
          <i />
          <span>THE ISLE EVRIMA / VIETNAM</span>
        </div>
      </section>
      <section className={styles.lostTrail}>
        <p className={styles.labEyebrow}>A WORLD FIRST</p>
        <h2>Đi theo dấu vết, không đi theo dashboard.</h2>
        <ol>
          <li>
            <span>01</span>
            <strong>Ánh sáng</strong>
            <p>Rừng và sương mở ra trước khi có bất kỳ tiện ích nào.</p>
          </li>
          <li>
            <span>02</span>
            <strong>Vết chân</strong>
            <p>Nhịp kể chuyện dẫn người chơi vào một hành trình sinh tồn.</p>
          </li>
          <li>
            <span>03</span>
            <strong>Tín hiệu</strong>
            <p>Dữ liệu trực tiếp chỉ xuất hiện khi có lý do để nhìn thấy nó.</p>
          </li>
        </ol>
      </section>
    </>
  );
}

function SurvivalArchive() {
  return (
    <>
      <section className={styles.archiveHero}>
        <div className={styles.archiveMasthead}>
          <span>FIELD RECORD / 01</span>
          <span>DAI VIET ISLAND ARCHIVE</span>
        </div>
        <PrehistoricMark className={styles.archiveMark} />
        <div className={styles.archiveCopy}>
          <p>DAI VIET / DIRECTION B</p>
          <h1>
            Survival
            <br />
            Archive
          </h1>
          <span>Một bản ghi về những gì còn lại sau tiếng gọi từ rừng.</span>
        </div>
        <div className={styles.archiveStamp} aria-hidden="true">
          <Compass size={30} />
          <span>ARCHIVE</span>
          <i>DV</i>
        </div>
      </section>
      <section className={styles.archiveNotes}>
        <div>
          <p className={styles.labEyebrow}>FIELD NOTES</p>
          <h2>Ghi chép để sống sót.</h2>
        </div>
        <ol>
          <li>
            <span>TRAIL / 01</span>
            <strong>Khí hậu của một vùng đất có chủ.</strong>
            <p>
              Material, khoảng thở và ghi chú thay cho thẻ tính năng lặp lại.
            </p>
          </li>
          <li>
            <span>TRAIL / 02</span>
            <strong>Những loài được nhìn thấy.</strong>
            <p>Hệ sinh thái được kể qua dấu vết, không qua trang quản trị.</p>
          </li>
          <li>
            <span>TRAIL / 03</span>
            <strong>Điều chưa mở ra.</strong>
            <p>Những công cụ sắp tới chỉ là dòng ghi chú cuối trang.</p>
          </li>
        </ol>
      </section>
    </>
  );
}

function TheIsland() {
  return (
    <>
      <section className={styles.islandHero}>
        <Image
          src="/art/dai-viet-forest-hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
        />
        <div className={styles.islandShade} aria-hidden="true" />
        <div className={styles.islandTitle}>
          <p>DAI VIET / DIRECTION C</p>
          <h1>
            THE
            <br />
            <em>ISLAND</em>
          </h1>
          <span>
            Không phải một bảng điều khiển.
            <br />
            Một nơi để cùng sống sót.
          </span>
        </div>
        <PrehistoricMark
          className={styles.islandMark}
          title="Dấu hiệu tiền sử DAI VIET"
        />
        <div className={styles.islandRoute}>
          <MapPinned aria-hidden="true" size={17} />
          <span>THE ISLE EVRIMA / VIETNAM</span>
          <ArrowDownRight aria-hidden="true" size={17} />
        </div>
      </section>
      <section className={styles.islandSignals}>
        <div className={styles.signalIntro}>
          <p className={styles.labEyebrow}>A LIVING FIELD</p>
          <h2>Một hòn đảo chỉ thật khi có người đang ở đó.</h2>
        </div>
        <div className={styles.signalWriting}>
          <span>NHỮNG TÍN HIỆU ĐƯỢC GIỮ LẠI</span>
          <p>
            Tên, loài và trạng thái online có thể trở thành nhịp sống của trang,
            thay vì một bảng dữ liệu bị đóng khung.
          </p>
          <Feather aria-hidden="true" size={28} />
        </div>
      </section>
    </>
  );
}

export function DesignLab({ direction }: DesignLabProps) {
  const current = directions[direction];
  return (
    <main
      className={[styles.page, styles[direction]].join(" ")}
      data-design-lab={direction}
    >
      <header className={styles.labHeader}>
        <span>{current.label}</span>
        <strong>DAI VIET / {current.name}</strong>
        <p>{current.statement}</p>
      </header>
      {direction === "lost-world" ? <LostWorld /> : null}
      {direction === "survival-archive" ? <SurvivalArchive /> : null}
      {direction === "the-island" ? <TheIsland /> : null}
    </main>
  );
}
