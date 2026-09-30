import { Pause, Play, Volume1, Volume2, VolumeX } from "lucide-react";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import {
  AUDIO_CONTROL_ATTR,
  formatTime,
  useAudioPlayer,
} from "@/hooks/use-audio-player";

export function PlayButton({
  className,
  iconClassName,
}: {
  className?: string;
  iconClassName?: string;
}) {
  const { isPlaying, toggle } = useAudioPlayer();
  const Icon = isPlaying ? Pause : Play;
  return (
    <button
      type="button"
      {...AUDIO_CONTROL_ATTR}
      onClick={toggle}
      aria-label={isPlaying ? "Pausar canción" : "Reproducir canción"}
      aria-pressed={isPlaying}
      className={cn(
        "relative flex shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_0_30px_-4px_hsl(var(--primary)/0.7)] transition-transform duration-300 hover:scale-105 active:scale-95",
        className,
      )}
    >
      <Icon
        className={cn(
          "fill-current",
          !isPlaying && "translate-x-[1px]",
          iconClassName,
        )}
      />
    </button>
  );
}

export function ProgressBar({ className }: { className?: string }) {
  const { currentTime, duration, seek } = useAudioPlayer();
  const trackRef = useRef<HTMLDivElement>(null);
  const pct = duration ? Math.min(100, (currentTime / duration) * 100) : 0;

  const seekFromPointer = (clientX: number) => {
    const el = trackRef.current;
    if (!el || !duration) return;
    const rect = el.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    seek(ratio * duration);
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="w-9 text-right text-[11px] tabular-nums text-muted-foreground">
        {formatTime(currentTime)}
      </span>
      <div
        ref={trackRef}
        {...AUDIO_CONTROL_ATTR}
        role="slider"
        tabIndex={0}
        aria-label="Progreso de la canción"
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
        aria-valuenow={Math.round(currentTime)}
        aria-valuetext={formatTime(currentTime)}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          seekFromPointer(e.clientX);
        }}
        onPointerMove={(e) => {
          if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            seekFromPointer(e.clientX);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") seek(Math.min(duration, currentTime + 5));
          if (e.key === "ArrowLeft") seek(Math.max(0, currentTime - 5));
        }}
        className="group relative flex h-4 flex-1 cursor-pointer touch-none items-center"
      >
        <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-300 to-primary"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span
          className="absolute h-3 w-3 -translate-x-1/2 rounded-full bg-foreground opacity-0 shadow transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
          style={{ left: `${pct}%` }}
        />
      </div>
      <span className="w-9 text-[11px] tabular-nums text-muted-foreground">
        {formatTime(duration)}
      </span>
    </div>
  );
}

export function VolumeControl({ className }: { className?: string }) {
  const { volume, setVolume } = useAudioPlayer();
  const lastVolume = useRef(volume || 0.2);
  const Icon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div className={cn("flex items-center gap-2", className)} {...AUDIO_CONTROL_ATTR}>
      <button
        type="button"
        {...AUDIO_CONTROL_ATTR}
        onClick={() => {
          if (volume > 0) {
            lastVolume.current = volume;
            setVolume(0);
          } else {
            setVolume(lastVolume.current);
          }
        }}
        aria-label={volume === 0 ? "Activar sonido" : "Silenciar"}
        className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
      >
        <Icon className="h-4 w-4" />
      </button>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={volume}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
        aria-label="Volumen"
        className="volume-slider w-20 sm:w-24"
        style={{ "--value": `${volume * 100}%` } as React.CSSProperties}
      />
    </div>
  );
}
