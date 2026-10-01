import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { useIsMobileLayout } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { YOUTUBE_VIDEOS } from "./data";

/** Nombres de las canciones (se toman de los videos de YouTube). */
const SONGS = YOUTUBE_VIDEOS.map((video) => video.title);

/**
 * Cuántas veces se repite la lista dentro de cada mitad de la franja, para
 * que cubra pantallas anchas de PC aunque haya pocas canciones.
 */
const REPEAT = Math.max(2, Math.ceil(8 / Math.max(1, SONGS.length)));

/** Estrella de cuatro puntas afilada. */
function Spark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden className={className}>
      <path
        d="M24 1 L28.5 19.5 L47 24 L28.5 28.5 L24 47 L19.5 28.5 L1 24 L19.5 19.5 Z"
        fill="currentColor"
      />
    </svg>
  );
}

function Track({ hidden }: { hidden?: boolean }) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {Array.from({ length: REPEAT }).flatMap((_, r) =>
        SONGS.map((song, i) => (
          <span key={`${r}-${song}`} className="flex items-center">
            <span className="font-display whitespace-nowrap px-5 text-4xl uppercase leading-none tracking-tight sm:px-9 sm:text-6xl lg:text-7xl">
              {song}
            </span>
            <Spark
              className={cn(
                "h-6 w-6 shrink-0 sm:h-9 sm:w-9",
                (i + r) % 2 ? "rotate-12" : "-rotate-6",
              )}
            />
          </span>
        )),
      )}
    </div>
  );
}

/**
 * Franja con los nombres de las canciones como una pincelada: degradado
 * amarillo-naranja y bordes de brocha seca en diagonal (máscara SVG en
 * .brush-stroke, global.css). La pincelada queda fija; solo se mueve el texto.
 */
export function Marquee() {
  const isMobile = useIsMobileLayout();

  // En celular la franja se inclina según la velocidad del scroll, como si
  // tuviera inercia. Solo usa transform: no afecta el rendimiento.
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { stiffness: 300, damping: 50 });
  const skewX = useTransform(smooth, [-2500, 0, 2500], [8, 0, -8], {
    clamp: true,
  });

  if (!SONGS.length) return null;

  return (
    <div
      className="relative overflow-hidden py-6 sm:py-10"
      role="marquee"
      aria-label={`Canciones: ${SONGS.join(", ")}`}
    >
      <motion.div
        style={isMobile ? { skewX } : undefined}
        className="brush-stroke-shadow mx-[-6%] -rotate-[1.5deg]"
      >
        <div className="brush-stroke flex items-center">
          <div className="marquee-track flex w-max">
            <Track />
            <Track hidden />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
