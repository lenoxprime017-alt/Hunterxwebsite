import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { useLayoutEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { YOUTUBE_VIDEOS } from "./data";

/** Nombres de las canciones (se toman de los videos de YouTube). */
const SONGS = YOUTUBE_VIDEOS.map((video) => video.title);

/**
 * Cuántas veces se repite la lista dentro de cada mitad de la franja, para
 * que cubra pantallas anchas de PC aunque haya pocas canciones.
 */
const REPEAT = Math.max(2, Math.ceil(8 / Math.max(1, SONGS.length)));

/** Velocidad base del texto (px por segundo). */
const BASE_SPEED = 70;

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
            <span className="font-display whitespace-nowrap px-6 text-5xl uppercase leading-none tracking-tight sm:px-10 sm:text-7xl lg:text-8xl">
              {song}
            </span>
            <Spark
              className={cn(
                "h-7 w-7 shrink-0 sm:h-11 sm:w-11",
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
 * Franja con los nombres de las canciones como una pincelada (degradado
 * amarillo-naranja y bordes de brocha seca: .brush-stroke en global.css).
 *
 * Movimiento (todo con transform, sin re-renders de React):
 * - Se «pinta» de izquierda a derecha al entrar en pantalla.
 * - El texto avanza solo y acelera con el scroll; cambia de sentido según
 *   se suba o se baje.
 * - La pincelada gira y crece levemente mientras cruza la pantalla.
 */
export function Marquee() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const halfWidth = useRef(0);

  // --- Texto que reacciona a la velocidad del scroll ---
  const x = useMotionValue(0);
  const direction = useRef(-1);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(velocity, { damping: 50, stiffness: 400 });
  const speedFactor = useTransform(smoothVelocity, [-2000, 0, 2000], [-5, 0, 5], {
    clamp: false,
  });

  useLayoutEffect(() => {
    const measure = () => {
      const first = trackRef.current?.firstElementChild as HTMLElement | null;
      halfWidth.current = first?.offsetWidth ?? 0;
    };
    measure();
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => window.removeEventListener("resize", measure);
  }, []);

  useAnimationFrame((_, delta) => {
    const w = halfWidth.current;
    if (!w) return;
    const factor = speedFactor.get();
    // Al bajar, el texto va hacia la izquierda; al subir, hacia la derecha
    if (factor < -0.05) direction.current = 1;
    else if (factor > 0.05) direction.current = -1;
    const move = direction.current * BASE_SPEED * (delta / 1000) * (1 + Math.abs(factor));
    let next = x.get() + move;
    // Bucle infinito sin saltos: se mantiene entre -w y 0
    if (next <= -w) next += w;
    else if (next > 0) next -= w;
    x.set(next);
  });

  // --- Giro y escala mientras la franja cruza la pantalla ---
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const rotate = useTransform(scrollYProgress, [0, 1], [-5, 2]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.94, 1.04, 0.98]);

  if (!SONGS.length) return null;

  return (
    <div
      ref={sectionRef}
      className="relative overflow-hidden py-10 sm:py-16"
      role="marquee"
      aria-label={`Canciones: ${SONGS.join(", ")}`}
    >
      {/* La detección de «entró en pantalla» va en el contenedor: el hijo empieza
          recortado por completo y el navegador no lo consideraría visible. */}
      <motion.div
        style={{ rotate, scale }}
        className="brush-stroke-shadow mx-[-8%]"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-15% 0px" }}
      >
        {/* Se pinta de izquierda a derecha al aparecer */}
        <motion.div
          variants={{
            hidden: { clipPath: "inset(0 100% 0 0)" },
            show: {
              clipPath: "inset(0 0% 0 0)",
              transition: { duration: 1.1, ease: [0.65, 0, 0.35, 1] },
            },
          }}
        >
          <div className="brush-stroke flex items-center">
            <motion.div ref={trackRef} style={{ x }} className="flex w-max will-change-transform">
              <Track />
              <Track hidden />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
