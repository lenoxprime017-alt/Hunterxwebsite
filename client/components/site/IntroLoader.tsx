import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ARTIST } from "./data";
import { EASE_OUT } from "./primitives";

const MIN_DURATION = 1100;
const MAX_DURATION = 2600;

/**
 * Espera a que carguen las imágenes críticas (con un mínimo para que la
 * animación se aprecie y un máximo para no bloquear en redes lentas).
 */
export function useCriticalAssets(sources: string[]) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const start = performance.now();

    const loads = sources.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = img.onerror = () => resolve();
          img.src = src;
        }),
    );

    const finish = () => {
      if (cancelled) return;
      const elapsed = performance.now() - start;
      setTimeout(
        () => !cancelled && setReady(true),
        Math.max(0, MIN_DURATION - elapsed),
      );
    };

    Promise.all(loads).then(finish);
    const fallback = setTimeout(() => !cancelled && setReady(true), MAX_DURATION);

    return () => {
      cancelled = true;
      clearTimeout(fallback);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ready;
}

export function IntroLoader() {
  const letters = ARTIST.name.split("");

  return (
    <motion.div
      key="intro"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
      initial={{ clipPath: "inset(0 0 0% 0)" }}
      exit={{ clipPath: "inset(0 0 100% 0)" }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
      aria-live="polite"
      aria-label="Cargando"
    >
      <div className="glow-orb left-1/2 top-1/2 h-[40vmax] w-[40vmax] -translate-x-1/2 -translate-y-1/2 opacity-40" />
      <h1 className="font-display relative flex overflow-hidden text-7xl uppercase tracking-tight text-foreground sm:text-9xl">
        {letters.map((letter, i) => (
          <motion.span
            key={i}
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 + i * 0.06, ease: EASE_OUT }}
            className={i === letters.length - 1 ? "text-gold" : undefined}
          >
            {letter}
          </motion.span>
        ))}
      </h1>
      <motion.div
        className="relative mt-6 h-px w-40 overflow-hidden bg-foreground/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <span className="loader-line absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-primary to-transparent" />
      </motion.div>
      <motion.p
        className="relative mt-5 text-xs uppercase tracking-[0.4em] text-muted-foreground"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        {ARTIST.tagline}
      </motion.p>
    </motion.div>
  );
}
