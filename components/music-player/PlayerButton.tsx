"use client";

import { motion } from "framer-motion";
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
  return (
    <svg className={styles.skipIcon} viewBox="0 0 26 32" aria-hidden="true">
      <path d="M1.53 0C.68 0 0 .69 0 1.55v28.9C0 31.31.68 32 1.53 32s1.53-.69 1.53-1.55V19.07c1.38 1.34 3.69 2.73 6.94 4.67l5.53 3.3c4.69 2.81 7.04 4.21 8.75 2.94C26 28.71 26 25.58 26 19.3v-6.61c0-6.27 0-9.41-1.72-10.68-1.71-1.27-4.06.14-8.75 2.94L10 8.26c-3.25 1.94-5.56 3.33-6.94 4.67V1.55C3.06.69 2.37 0 1.53 0Z" />
    </svg>
  );
}

export function NextIcon() {
  return (
    <svg className={styles.skipIcon} viewBox="0 0 26 32" aria-hidden="true">
      <path d="M24.47 0C25.32 0 26 .69 26 1.55v28.9c0 .86-.68 1.55-1.53 1.55s-1.53-.69-1.53-1.55V19.07c-1.38 1.34-3.69 2.73-6.94 4.67l-5.53 3.3c-4.69 2.81-7.04 4.21-8.75 2.94C0 28.71 0 25.58 0 19.3v-6.61C0 6.42 0 3.29 1.72 2.02 3.43.75 5.78 2.15 10.47 4.96L16 8.26c3.25 1.94 5.56 3.33 6.94 4.67V1.55C22.94.69 23.63 0 24.47 0Z" />
    </svg>
  );
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
