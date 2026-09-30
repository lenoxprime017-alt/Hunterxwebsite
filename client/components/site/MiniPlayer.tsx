import { AnimatePresence, motion } from "framer-motion";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import { ARTIST, LATEST_RELEASE } from "./data";
import { Equalizer } from "./primitives";
import { PlayButton, ProgressBar, VolumeControl } from "./PlayerControls";

/** Reproductor flotante que aparece cuando el hero ya no está en pantalla. */
export function MiniPlayer({ visible }: { visible: boolean }) {
  const { isPlaying, currentTime, duration } = useAudioPlayer();
  const progress = duration ? Math.min(1, currentTime / duration) : 0;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          className="fixed inset-x-3 bottom-3 z-40 mx-auto max-w-xl sm:bottom-5"
        >
          <div className="glass relative flex items-center gap-3 overflow-hidden rounded-2xl p-2.5 pr-4 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.7)]">
            {/* Progreso en celular: línea fina animada solo con transform */}
            <span
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-gradient-to-r from-amber-300 to-primary transition-transform duration-300 ease-linear sm:hidden"
              style={{ transform: `scaleX(${progress})` }}
            />
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl">
              <img
                src={LATEST_RELEASE.cover}
                alt=""
                className={isPlaying ? "h-full w-full object-cover animate-breathe" : "h-full w-full object-cover"}
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-semibold text-foreground">
                  {LATEST_RELEASE.title}
                </p>
                <Equalizer active={isPlaying} bars={3} className="h-3" />
              </div>
              <p className="truncate text-xs text-muted-foreground">{ARTIST.name}</p>
              <ProgressBar className="-ml-3 hidden sm:flex" />
            </div>
            <VolumeControl className="hidden md:flex" />
            <PlayButton className="h-11 w-11" iconClassName="h-5 w-5" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
