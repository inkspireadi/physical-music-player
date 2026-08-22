"use client";

import { AnimatePresence, motion } from "framer-motion";
import { type CSSProperties, type RefObject } from "react";
import type { YouTubeTrack } from "./youtubeTracks";
import styles from "./PhysicalMusicPlayer.module.css";

type PlayerDisplayProps = {
  playerHostRef: RefObject<HTMLDivElement | null>;
  track: YouTubeTrack;
  isShowingVideo: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  onSeek: (ratio: number) => void;
  onVolumeChange: (volume: number) => void;
};

function formatTime(value: number) {
  if (!Number.isFinite(value) || value < 0) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function PlayerDisplay({
  playerHostRef,
  track,
  isShowingVideo,
  isPlaying,
  currentTime,
  duration,
  volume,
  onSeek,
  onVolumeChange,
}: PlayerDisplayProps) {
  const progress = duration > 0 ? Math.min(1, currentTime / duration) : 0;
  const previewStyle = {
    backgroundImage: `url("https://i.ytimg.com/vi/${track.videoId}/maxresdefault.jpg")`,
  } as CSSProperties;
  const scrubberStyle = { "--value": `${progress * 100}%` } as CSSProperties;
  const volumeStyle = { "--value": `${volume * 100}%` } as CSSProperties;

  return (
    <div className={styles.display}>
      <div className={styles.videoViewport} aria-label={`${track.title} by ${track.artist}`}>
        <div ref={playerHostRef} />
      </div>
      <AnimatePresence mode="wait" initial={false}>
        {!isShowingVideo && (
          <motion.div
            key={track.videoId}
            className={styles.cleanPreview}
            style={previewStyle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>
      <div className={styles.playbackStatus} data-playing={isPlaying}>
        <span className={styles.playbackStatusDot} />
        {isPlaying ? "PLAYING" : "PAUSED"}
      </div>
      <div className={styles.screenControls}>
        <span className={styles.elapsedTime}>{formatTime(currentTime)}</span>
        <input
          className={`${styles.screenSlider} ${styles.screenScrubber}`}
          style={scrubberStyle}
          type="range"
          min="0"
          max="1000"
          step="1"
          value={Math.round(progress * 1000)}
          onInput={(event) => onSeek(Number(event.currentTarget.value) / 1000)}
          aria-label="Video position"
          aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
        />
        <span className={styles.durationTime}>{formatTime(duration)}</span>
        <svg className={styles.volumeIcon} viewBox="0 0 20 20" aria-hidden="true">
          <path d="M3 8v4h3l4 3V5L6 8H3Z" />
          <path d="M13 7.2c1.45 1.45 1.45 4.15 0 5.6M15.2 5c2.7 2.7 2.7 7.3 0 10" fill="none" />
        </svg>
        <input
          className={`${styles.screenSlider} ${styles.volumeSlider}`}
          style={volumeStyle}
          type="range"
          min="0"
          max="100"
          step="1"
          value={Math.round(volume * 100)}
          onInput={(event) => onVolumeChange(Number(event.currentTarget.value) / 100)}
          aria-label="Volume"
          aria-valuetext={`${Math.round(volume * 100)} percent`}
        />
      </div>
    </div>
  );
}
