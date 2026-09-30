import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { haptic } from "./use-media-query";

interface AudioPlayerState {
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  toggle: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
}

const AudioPlayerContext = createContext<AudioPlayerState | null>(null);

/** Atributo para marcar controles del reproductor: los clics sobre ellos no disparan el autoplay. */
export const AUDIO_CONTROL_ATTR = { "data-audio-control": "" } as const;

interface AudioPlayerProviderProps {
  src: string;
  /** Si se define, la canción vuelve al inicio al llegar a este segundo. */
  loopAt?: number;
  initialVolume?: number;
  children: ReactNode;
}

export function AudioPlayerProvider({
  src,
  loopAt,
  initialVolume = 0.2,
  children,
}: AudioPlayerProviderProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const userControlledRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(initialVolume);
  const [currentTime, setCurrentTime] = useState(0);
  const [trackDuration, setTrackDuration] = useState(0);

  useEffect(() => {
    const audio = new Audio();
    audio.src = src;
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = initialVolume;
    audioRef.current = audio;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => {
      if (loopAt && audio.currentTime >= loopAt) {
        audio.currentTime = 0;
      }
      setCurrentTime(audio.currentTime);
    };
    const onLoadedMetadata = () => setTrackDuration(audio.duration || 0);

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);

    // 1) Intentar autoplay (la mayoría de navegadores lo bloquean sin interacción)
    audio.play().catch(() => {
      /* bloqueado: esperamos la primera interacción */
    });

    // 2) Fallback: iniciar con la primera interacción del usuario, salvo que
    //    haya sido sobre un control del reproductor (evita play+pause inmediato).
    const events = ["click", "touchend", "keydown"] as const;
    const removeInteractionListeners = () =>
      events.forEach((e) => window.removeEventListener(e, onFirstInteraction));
    function onFirstInteraction(event: Event) {
      const target = event.target as Element | null;
      if (target?.closest?.("[data-audio-control]")) return;
      removeInteractionListeners();
      if (!userControlledRef.current && audio.paused) {
        audio.play().catch(() => {});
      }
    }
    events.forEach((e) =>
      window.addEventListener(e, onFirstInteraction, { passive: true }),
    );

    // 3) En móviles, pausar cuando la página pasa a segundo plano
    const isMobile =
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );
    const onVisibilityChange = () => {
      if (isMobile && document.hidden) audio.pause();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      removeInteractionListeners();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      audioRef.current = null;
    };
    // initialVolume solo se usa al crear el elemento
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, loopAt]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    userControlledRef.current = true;
    haptic();
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, []);

  const setVolume = useCallback((value: number) => {
    const clamped = Math.min(1, Math.max(0, value));
    setVolumeState(clamped);
    if (audioRef.current) audioRef.current.volume = clamped;
  }, []);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    setCurrentTime(time);
  }, []);

  const duration =
    loopAt && trackDuration ? Math.min(loopAt, trackDuration) : loopAt ?? trackDuration;

  const value = useMemo(
    () => ({ isPlaying, volume, currentTime, duration, toggle, setVolume, seek }),
    [isPlaying, volume, currentTime, duration, toggle, setVolume, seek],
  );

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) {
    throw new Error("useAudioPlayer debe usarse dentro de <AudioPlayerProvider>");
  }
  return ctx;
}

export function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
