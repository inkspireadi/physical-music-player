"use client";

import { motion } from "framer-motion";
import type { WheelEvent } from "react";
import styles from "./PhysicalMusicPlayer.module.css";

type SpeakerGrilleProps = {
  isPlaying: boolean;
  onVolumeWheel: (event: WheelEvent<HTMLDivElement>) => void;
};

export function SpeakerGrille({ isPlaying, onVolumeWheel }: SpeakerGrilleProps) {
  return (
    <motion.div
      className={styles.grilleWell}
      animate={isPlaying ? { scaleY: [1, 1.003, 1] } : { scaleY: 1 }}
      transition={isPlaying ? { repeat: Infinity, duration: 1.8, ease: "easeInOut" } : { duration: 0.2 }}
      onWheel={onVolumeWheel}
      aria-label="Speaker grille. Scroll to adjust volume"
    >
      <div className={styles.grille} />
    </motion.div>
  );
}
