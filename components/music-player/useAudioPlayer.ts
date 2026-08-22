"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Track } from "./tracks";

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export function useAudioPlayer(playlist: readonly Track[]) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const resumeAfterLoad = useRef(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [error, setError] = useState<string | null>(null);

  const moveTrack = useCallback(
    (direction: 1 | -1, forceResume?: boolean) => {
      const audio = audioRef.current;
      resumeAfterLoad.current = forceResume ?? Boolean(audio && !audio.paused);
      setError(null);
      setCurrentTime(0);
      setDuration(0);
      setTrackIndex((index) => (index + direction + playlist.length) % playlist.length);
    },
    [playlist.length],
  );

  const next = useCallback(() => moveTrack(1), [moveTrack]);
  const previous = useCallback(() => moveTrack(-1), [moveTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTime = () => setCurrentTime(audio.currentTime);
    const onMetadata = () => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
      if (resumeAfterLoad.current) {
        resumeAfterLoad.current = false;
        void audio.play().catch(() => setError("PLAYBACK BLOCKED"));
      }
    };
    const onEnded = () => moveTrack(1, true);
    const onError = () => {
      setIsPlaying(false);
      setError("TRACK UNAVAILABLE");
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMetadata);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMetadata);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
  }, [moveTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = playlist[trackIndex].src;
    audio.load();
  }, [playlist, trackIndex]);

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    setError(null);
    try {
      await audio.play();
    } catch {
      setError("PLAYBACK BLOCKED");
    }
  }, []);

  const pause = useCallback(() => audioRef.current?.pause(), []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) void play();
    else pause();
  }, [pause, play]);

  const seek = useCallback((ratio: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration)) return;
    audio.currentTime = clamp(ratio) * audio.duration;
    setCurrentTime(audio.currentTime);
  }, []);

  const setVolume = useCallback((nextVolume: number) => {
    const value = clamp(nextVolume);
    setVolumeState(value);
    if (audioRef.current) audioRef.current.volume = value;
  }, []);

  return {
    audioRef,
    track: playlist[trackIndex],
    trackIndex,
    isPlaying,
    currentTime,
    duration,
    volume,
    error,
    play,
    pause,
    togglePlay,
    next,
    previous,
    seek,
    setVolume,
  };
}
