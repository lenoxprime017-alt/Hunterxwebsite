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

/** Estrella de cuatro puntas afilada, estilo grafiti. */
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

function Track({
  variant,
  hidden,
}: {
  variant: "gold" | "paper";
  hidden?: boolean;
}) {
  const gold = variant === "gold";
  return (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {Array.from({ length: REPEAT }).flatMap((_, r) =>
        SONGS.map((song, i) => (
          <span key={`${r}-${song}`} className="flex items-center">
            <span
              className={cn(
                "font-display whitespace-nowrap uppercase leading-none tracking-tight",
                gold
                  ? "brush-text px-5 text-4xl sm:px-8 sm:text-6xl lg:text-7xl"
                  : "brush-text--outline px-5 text-3xl sm:px-8 sm:text-5xl",
              )}
            >
              {song}
            </span>
            <Spark
              className={cn(
                "shrink-0",
                gold
                  ? "h-6 w-6 text-[#0b0b10] sm:h-10 sm:w-10"
                  : "h-5 w-5 text-[#c8930a] sm:h-7 sm:w-7",
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
 * Franjas con los nombres de las canciones, estilo pintura: bordes de brocha,
 * chorreones y salpicaduras (ver .brush-band en global.css). La dorada va al
 * frente; detrás cruza una blanca con letras en contorno que se mueve al revés.
 */
export function Marquee() {
  const isMobile = useIsMobileLayout();

  // En celular la franja dorada se inclina según la velocidad del scroll,
  // como si tuviera inercia. Solo usa transform: no afecta el rendimiento.
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { stiffness: 300, damping: 50 });
  const skewX = useTransform(smooth, [-2500, 0, 2500], [10, 0, -10], {
    clamp: true,
  });

  if (!SONGS.length) return null;

  return (
    <div
      className="relative overflow-hidden py-20 sm:py-28"
      role="marquee"
      aria-label={`Canciones: ${SONGS.join(", ")}`}
    >
      {/* Franja blanca cruzada, detrás */}
      <div
        aria-hidden
        className="brush-band brush-band--paper absolute left-[-20%] w-[140%] top-1/2 -translate-y-1/2 rotate-[5deg] py-3 sm:rotate-[4deg] sm:py-4"
      >
        <div className="marquee-track marquee-track--reverse flex w-max">
          <Track variant="paper" />
          <Track variant="paper" hidden />
        </div>
      </div>

      {/* Franja dorada principal */}
      <motion.div style={isMobile ? { skewX } : undefined} className="relative">
        <div className="brush-band brush-band--gold mx-[-8%] -rotate-3 py-4 sm:-rotate-2 sm:py-5">
          <div className="marquee-track flex w-max">
            <Track variant="gold" />
            <Track variant="gold" hidden />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
