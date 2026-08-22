"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import type { YouTubeTrack } from "./youtubeTracks";

type YouTubePlayerState = -1 | 0 | 1 | 2 | 3 | 5;

type YouTubePlayer = {
  cuePlaylist: (playlist: string[], index?: number, startSeconds?: number, suggestedQuality?: string) => void;
  destroy: () => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  getPlayerState: () => YouTubePlayerState;
  getPlaylistIndex: () => number;
  nextVideo: () => void;
  pauseVideo: () => void;
  playVideo: () => void;
  previousVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  setLoop: (loopPlaylists: boolean) => void;
  setVolume: (volume: number) => void;
};

type YouTubeEvent = { target: YouTubePlayer };
type YouTubeErrorEvent = YouTubeEvent & { data: number };
type YouTubeStateEvent = YouTubeEvent & { data: YouTubePlayerState };

type YouTubeNamespace = {
  Player: new (
    element: HTMLElement,
    options: {
      height: string;
      width: string;
      playerVars: Record<string, number | string>;
      events: {
        onReady: (event: YouTubeEvent) => void;
        onStateChange: (event: YouTubeStateEvent) => void;
        onError: (event: YouTubeErrorEvent) => void;
      };
    },
  ) => YouTubePlayer;
};

declare global {
  interface Window {
    YT?: YouTubeNamespace;
  }
}

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export function useYouTubePlayer(
  playlist: readonly YouTubeTrack[],
  apiScriptReady: boolean,
  apiScriptError: boolean,
) {
  const playerHostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const volumeRef = useRef(0.8);
  const revealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShowingVideo, setIsShowingVideo] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [error, setError] = useState<string | null>(null);

  const syncPlayer = useCallback((player: YouTubePlayer) => {
    const nextIndex = player.getPlaylistIndex();
    if (nextIndex >= 0 && nextIndex < playlist.length) setTrackIndex(nextIndex);
    setCurrentTime(player.getCurrentTime() || 0);
    setDuration(player.getDuration() || 0);
  }, [playlist.length]);

  useEffect(() => {
    if (!apiScriptReady || playerRef.current || !playerHostRef.current) return;

    let cancelled = false;
    let attempts = 0;
    let pollTimer: ReturnType<typeof setTimeout> | null = null;

    const initialize = () => {
      if (cancelled) return;
      if (!window.YT?.Player) {
        attempts += 1;
        if (attempts > 120) {
          setError("YOUTUBE UNAVAILABLE");
          return;
        }
        pollTimer = setTimeout(initialize, 50);
        return;
      }

      const host = playerHostRef.current;
      if (!host) return;

      playerRef.current = new window.YT.Player(host, {
        height: "100%",
        width: "100%",
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          enablejsapi: 1,
          fs: 0,
          iv_load_policy: 3,
          loop: 1,
          modestbranding: 1,
          origin: window.location.origin,
          playsinline: 1,
          rel: 0,
        },
        events: {
          onReady: ({ target }) => {
            target.cuePlaylist(playlist.map((track) => track.videoId), 0, 0, "large");
            target.setLoop(true);
            target.setVolume(volumeRef.current * 100);
            setIsReady(true);
            setError(null);
            syncPlayer(target);
          },
          onStateChange: ({ data, target }) => {
            const activelyPlaying = data === 1 || data === 3;
            setIsPlaying(activelyPlaying);

            if (revealTimerRef.current) clearTimeout(revealTimerRef.current);
            if (data === 1) {
              setIsShowingVideo(false);
              revealTimerRef.current = setTimeout(() => setIsShowingVideo(true), 3200);
            } else {
              setIsShowingVideo(false);
            }

            if (data === 1 || data === 5) setError(null);
            syncPlayer(target);
          },
          onError: ({ target }) => {
            setError("VIDEO SKIPPED");
            setIsPlaying(false);
            setIsShowingVideo(false);
            window.setTimeout(() => target.nextVideo(), 500);
          },
        },
      });
    };

    initialize();
    return () => {
      cancelled = true;
      if (pollTimer) clearTimeout(pollTimer);
      if (revealTimerRef.current) clearTimeout(revealTimerRef.current);
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [apiScriptReady, playlist, syncPlayer]);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      const player = playerRef.current;
      if (player) syncPlayer(player);
    }, 250);
    return () => window.clearInterval(timer);
  }, [isPlaying, syncPlayer]);

  const togglePlay = useCallback(() => {
    const player = playerRef.current;
    if (!player || !isReady) {
      setError("VIDEOS LOADING");
      return;
    }
    setError(null);
    if (player.getPlayerState() === 1) player.pauseVideo();
    else player.playVideo();
  }, [isReady]);

  const next = useCallback(() => {
    setError(null);
    playerRef.current?.nextVideo();
  }, []);

  const previous = useCallback(() => {
    setError(null);
    playerRef.current?.previousVideo();
  }, []);

  const seek = useCallback((ratio: number) => {
    const player = playerRef.current;
    if (!player) return;
    const nextTime = clamp(ratio) * player.getDuration();
    player.seekTo(nextTime, true);
    setCurrentTime(nextTime);
  }, []);

  const setVolume = useCallback((nextVolume: number) => {
    const value = clamp(nextVolume);
    volumeRef.current = value;
    setVolumeState(value);
    playerRef.current?.setVolume(value * 100);
  }, []);

  return {
    playerHostRef: playerHostRef as RefObject<HTMLDivElement | null>,
    track: playlist[trackIndex],
    trackIndex,
    isReady,
    isPlaying,
    isShowingVideo,
    currentTime,
    duration,
    volume,
    error: apiScriptError ? "YOUTUBE UNAVAILABLE" : error,
    togglePlay,
    next,
    previous,
    seek,
    setVolume,
  };
}
