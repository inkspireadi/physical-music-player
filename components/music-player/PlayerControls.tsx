"use client";

import {
  NextIcon,
  PauseIcon,
  PlayIcon,
  PlayerButton,
  PreviousIcon,
} from "./PlayerButton";
import styles from "./PhysicalMusicPlayer.module.css";

type PlayerControlsProps = {
  isPlaying: boolean;
  onPrevious: () => void;
  onToggle: () => void;
  onNext: () => void;
};

export function PlayerControls({ isPlaying, onPrevious, onToggle, onNext }: PlayerControlsProps) {
  return (
    <div className={styles.controls} role="group" aria-label="Playback controls">
      <PlayerButton label="Previous track" onPress={onPrevious} position="left">
        <PreviousIcon />
      </PlayerButton>
      <PlayerButton label={isPlaying ? "Pause" : "Play"} onPress={onToggle} position="center">
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </PlayerButton>
      <PlayerButton label="Next track" onPress={onNext} position="right">
        <NextIcon />
      </PlayerButton>
    </div>
  );
}
