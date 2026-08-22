"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { ReactNode } from "react";
import styles from "./PhysicalMusicPlayer.module.css";

type PlayerButtonProps = {
  label: string;
  onPress: () => void;
  children: ReactNode;
  position: "left" | "center" | "right";
};

export function PlayerButton({ label, onPress, children, position }: PlayerButtonProps) {
  return (
    <motion.button
      type="button"
      className={`${styles.controlButton} ${styles[position]}`}
      aria-label={label}
      onClick={onPress}
      whileTap={{ y: 3, scale: 0.985 }}
      transition={{ duration: 0.12, ease: "easeOut" }}
    >
      <span className={styles.icon}>{children}</span>
    </motion.button>
  );
}

export function PreviousIcon() {
  return <Image className={styles.iconAsset} src="/icons/previous.svg" alt="" width={26} height={32} />;
}

export function NextIcon() {
  return <Image className={styles.iconAsset} src="/icons/next.svg" alt="" width={26} height={32} />;
}

export function PlayIcon() {
  return (
    <svg className={styles.playIcon} viewBox="0 0 26 28" aria-hidden="true">
      <path d="M0 10.8v6.4c0 6.08 0 9.12 1.82 10.35 1.83 1.23 4.32-.14 9.31-2.85L17 21.5C23 18.22 26 16.59 26 14S23 9.78 17 6.5l-5.87-3.2C6.14.59 3.65-.77 1.82.46 0 1.68 0 4.72 0 10.8Z" />
    </svg>
  );
}

export function PauseIcon() {
  return (
    <svg className={styles.pauseIcon} viewBox="0 0 26 32" aria-hidden="true">
      <rect x="0" y="1" width="9" height="30" rx="3" />
      <rect x="17" y="1" width="9" height="30" rx="3" />
    </svg>
  );
}
