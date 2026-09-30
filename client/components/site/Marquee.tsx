import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { Music2 } from "lucide-react";
import { useIsMobileLayout } from "@/hooks/use-media-query";
import { YOUTUBE_VIDEOS } from "./data";

/** Nombres de las canciones (se toman de los videos en data.ts). */
const SONGS = YOUTUBE_VIDEOS.map((video) => video.title);

/**
 * Cuántas veces se repite la lista dentro de cada mitad de la franja, para
 * que cubra pantallas anchas de PC aunque haya pocas canciones.
 */
const REPEAT = Math.max(2, Math.ceil(8 / SONGS.length));

/** Franja dorada con los nombres de las canciones en movimiento continuo. */
export function Marquee() {
  const isMobile = useIsMobileLayout();

  // En celular la franja se inclina según la velocidad del scroll, como si
  // tuviera inercia. Solo usa transform: no afecta el rendimiento.
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { stiffness: 300, damping: 50 });
  const skewX = useTransform(smooth, [-2500, 0, 2500], [10, 0, -10], {
    clamp: true,
  });

  const half = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {Array.from({ length: REPEAT }).flatMap((_, r) =>
        SONGS.map((song) => (
          <span key={`${r}-${song}`} className="flex items-center">
            <span className="font-display whitespace-nowrap px-6 text-3xl uppercase tracking-tight sm:px-10 sm:text-5xl">
              {song}
            </span>
            <Music2 className="h-5 w-5 opacity-60 sm:h-7 sm:w-7" />
          </span>
        )),
      )}
    </div>
  );

  return (
    <div
      className="relative -rotate-1 overflow-hidden border-y border-primary/20 bg-primary py-4 text-primary-foreground sm:py-5"
      role="marquee"
      aria-label={`Canciones: ${SONGS.join(", ")}`}
    >
      <motion.div style={isMobile ? { skewX } : undefined}>
        <div className="marquee-track flex w-max">
          {half(false)}
          {half(true)}
        </div>
      </motion.div>
    </div>
  );
}
