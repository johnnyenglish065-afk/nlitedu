"use client";
import { motion } from "framer-motion";
import styles from "./RunningBanner.module.css";

const announcements = [
  "🚀 4-Week & 6-Week Internship Registration Open – Limited Slots!",
  "🎓 Get Certified in Python, AutoCAD, Java, Android – Apply Now!",
  "🏆 Top 5 Test Performers Will Receive Surprise Gifts!",
  "📢 NLIT Internships Now Count for Academic Credits – Ask Your College!",
];

const RunningBanner = () => {
  return (
    <div className={styles.bannerWrapper}>
      <div className={styles.svgWrapper}>
        <SVGDecorations />
      </div>

      <motion.div
        className={styles.marquee}
        animate={{ x: ["100%", "-100%"] }}
        transition={{
          duration: 50,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div className={styles.text}>
          {announcements.map((text, index) => (
            <span key={index} className={styles.item}>
              {text} &nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default RunningBanner;

const SVGDecorations = () => (
  <>
    <svg
      className={styles.svg1}
      width="100"
      height="100"
      viewBox="0 0 100 100"
      fill="none"
    >
      <circle cx="50" cy="50" r="45" stroke="#6D28D9" strokeWidth="5" />
    </svg>

    <svg
      className={styles.svg2}
      width="60"
      height="60"
      viewBox="0 0 60 60"
      fill="none"
    >
      <rect width="60" height="60" rx="15" fill="#3730A3" opacity="0.3" />
    </svg>

    <svg
      className={styles.svg3}
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
    >
      <polygon points="40,0 80,80 0,80" fill="#4F46E5" opacity="0.15" />
    </svg>
  </>
);
