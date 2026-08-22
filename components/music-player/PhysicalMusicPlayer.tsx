"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import Script from "next/script";
import { useEffect, useRef, useState, type PointerEvent, type WheelEvent } from "react";
import { PlayerControls } from "./PlayerControls";
import { PlayerDisplay } from "./PlayerDisplay";
import { SpeakerGrille } from "./SpeakerGrille";
import styles from "./PhysicalMusicPlayer.module.css";
import { useYouTubePlayer } from "./useYouTubePlayer";
import { youtubeTracks } from "./youtubeTracks";

export function PhysicalMusicPlayer() {
  const [youtubeApiReady, setYoutubeApiReady] = useState(false);
  const [youtubeApiError, setYoutubeApiError] = useState(false);
  const {
    playerHostRef,
    track,
    isShowingVideo,
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlay,
    next,
    previous,
    seek,
    setVolume,
  } = useYouTubePlayer(youtubeTracks, youtubeApiReady, youtubeApiError);
  const reducedMotion = useReducedMotion();
  const deviceRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const rotateXValue = useMotionValue(0);
  const rotateYValue = useMotionValue(0);
  const rotateX = useSpring(rotateXValue, { stiffness: 160, damping: 24, mass: 0.6 });
  const rotateY = useSpring(rotateYValue, { stiffness: 160, damping: 24, mass: 0.6 });

  useEffect(() => () => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.matches("input, textarea, select, [contenteditable='true']")) return;

      if (event.code === "Space") {
        event.preventDefault();
        togglePlay();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        next();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        previous();
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        const value = Math.min(1, volume + 0.05);
        setVolume(value);
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        const value = Math.max(0, volume - 0.05);
        setVolume(value);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [next, previous, setVolume, togglePlay, volume]);

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || event.pointerType === "touch") return;
    const node = deviceRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    rotateYValue.set((x - 0.5) * 6);
    rotateXValue.set((y - 0.5) * -5);

    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      node.style.setProperty("--mx", `${x * 100}%`);
      node.style.setProperty("--my", `${y * 100}%`);
    });
  };

  const onPointerLeave = () => {
    rotateXValue.set(0);
    rotateYValue.set(0);
    deviceRef.current?.style.setProperty("--mx", "50%");
    deviceRef.current?.style.setProperty("--my", "18%");
  };

  const onVolumeWheel = (event: WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const value = Math.min(1, Math.max(0, volume + (event.deltaY < 0 ? 0.05 : -0.05)));
    setVolume(value);
  };

  return (
    <>
      <Script
        src="https://www.youtube.com/iframe_api"
        strategy="afterInteractive"
        onReady={() => setYoutubeApiReady(true)}
        onError={() => setYoutubeApiError(true)}
      />
      <section className={styles.stage} aria-label="Physical music player with a curated YouTube playlist">
      <motion.div
        ref={deviceRef}
        className={styles.device}
        style={{ rotateX, rotateY, transformPerspective: 1000 }}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        <div className={styles.hardware}>
          <PlayerDisplay
            playerHostRef={playerHostRef}
            track={track}
            isShowingVideo={isShowingVideo}
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            volume={volume}
            onSeek={seek}
            onVolumeChange={setVolume}
          />
          <SpeakerGrille
            isPlaying={isPlaying}
            onVolumeWheel={onVolumeWheel}
          />
          <PlayerControls
            isPlaying={isPlaying}
            onPrevious={previous}
            onToggle={togglePlay}
            onNext={next}
          />
        </div>
      </motion.div>
      </section>
    </>
  );
}
