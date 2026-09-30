import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { ArrowDown, Instagram, Play } from "lucide-react";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import { useIsDesktopLayout, useIsMobileLayout } from "@/hooks/use-media-query";
import { ARTIST, LATEST_RELEASE } from "./data";
import { EASE_OUT, Equalizer } from "./primitives";
import { PlayButton, ProgressBar, VolumeControl } from "./PlayerControls";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE_OUT } },
};

export function Hero({ ready }: { ready: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.15, 1.35]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // En celular el hero va apilado y es más alto que la pantalla: sin el
  // desvanecimiento con scroll, porque ocultaba el texto antes de leerlo.
  const isDesktop = useIsDesktopLayout();

  const letters = ARTIST.name.split("");

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-center overflow-hidden pb-16 pt-28 sm:pt-32"
    >
      {/* Fondo: portada desenfocada + brillos */}
      <motion.div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{ scale: bgScale }}
      >
        <img
          src={LATEST_RELEASE.cover}
          alt=""
          className="h-full w-full object-cover opacity-40 blur-3xl saturate-150"
        />
      </motion.div>

      {/* COMENTADO TEMPORALMENTE - Fondo con video (/hunterx.mp4)
          Para activarlo: descomenta este bloque y comenta el <motion.div> de
          arriba (el de la portada desenfocada). Si el video no debe ir detrás
          del texto sino en lugar de la portada, avísame y lo adapto.
      <motion.div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{ scale: bgScale }}
      >
        <video
          className="h-full w-full object-cover opacity-60"
          src="/hunterx.mp4"
          poster={LATEST_RELEASE.cover}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
      </motion.div>
      */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,transparent_0%,hsl(var(--background)/0.7)_55%,hsl(var(--background))_100%)]"
      />
      <div
        aria-hidden
        className="glow-orb -left-40 top-20 h-96 w-96 animate-drift opacity-50"
      />
      <div
        aria-hidden
        className="glow-orb glow-orb--blue -right-32 bottom-10 h-[28rem] w-[28rem] animate-drift-slow opacity-40"
      />

      <motion.div
        style={isDesktop ? { y: contentY, opacity: fade } : undefined}
        className="container grid items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-10"
      >
        {/* Texto */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={ready ? "show" : "hidden"}
          className="order-2 text-center lg:order-1 lg:text-left"
        >
          <motion.div variants={item}>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Nuevo sencillo
            </span>
          </motion.div>

          <h1
            className="font-display mt-6 flex justify-center overflow-hidden text-[22vw] uppercase leading-[0.85] tracking-tight text-foreground sm:text-[9rem] lg:justify-start xl:text-[11rem]"
            aria-label={ARTIST.name}
          >
            {letters.map((letter, i) => (
              <motion.span
                key={i}
                aria-hidden
                initial={{ y: "105%" }}
                animate={ready ? { y: 0 } : { y: "105%" }}
                transition={
                  isDesktop
                    ? { duration: 1, delay: 0.2 + i * 0.05, ease: EASE_OUT }
                    : {
                        type: "spring",
                        stiffness: 260,
                        damping: 14,
                        delay: 0.2 + i * 0.06,
                      }
                }
                className={cn(
                  "inline-block",
                  i === letters.length - 1 && "text-gold",
                )}
              >
                {letter}
              </motion.span>
            ))}
          </h1>

          <motion.p
            variants={item}
            className="mt-4 text-2xl font-light text-foreground/90 sm:text-3xl"
          >
            <span className="font-script text-4xl text-rose-400 sm:text-5xl">
              {LATEST_RELEASE.title}
            </span>
            <span className="ml-3 align-middle text-xs uppercase tracking-[0.3em] text-muted-foreground">
              {LATEST_RELEASE.producer}
            </span>
          </motion.p>

          <motion.p
            variants={item}
            className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0"
          >
            {ARTIST.bio}
          </motion.p>

          <motion.div
            variants={item}
            className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start"
          >
            <a
              href={LATEST_RELEASE.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary group"
            >
              <Play className="h-5 w-5 fill-current transition-transform duration-300 group-hover:scale-110" />
              Ver en YouTube
            </a>
            <a
              href={ARTIST.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost group"
            >
              <img src="/Spotify.png" alt="" className="h-5 w-5" />
              Escuchar en Spotify
            </a>
            <a
              href={ARTIST.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost group sm:aspect-square sm:px-0"
              aria-label="Seguir en Instagram"
            >
              <Instagram className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              <span className="sm:hidden">Seguir en Instagram</span>
            </a>
          </motion.div>
        </motion.div>

        {/* Portada */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={ready ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ duration: 1.2, delay: 0.25, ease: EASE_OUT }}
          className="order-1 mx-auto w-full max-w-[18rem] sm:max-w-md lg:order-2 lg:max-w-lg"
        >
          <CoverArt />
          <HeroPlayer />
        </motion.div>
      </motion.div>

      <motion.a
        href="#videos"
        aria-label="Bajar a la siguiente sección"
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ delay: 1.4 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-foreground sm:flex"
      >
        Scroll
        <ArrowDown className="h-4 w-4 animate-bounce" />
      </motion.a>
    </section>
  );
}

/** Portada con inclinación 3D al mover el cursor y vinilo que gira al sonar. */
function CoverArt() {
  const { isPlaying } = useAudioPlayer();
  const isMobile = useIsMobileLayout();

  // Celular: al hacer scroll la portada se encoge e inclina, y el vinilo sale
  // de detrás girando con el dedo. Ligado al scroll, solo transform.
  const { scrollY } = useScroll();
  const coverScale = useTransform(scrollY, [0, 420], [1, 0.84]);
  const coverRotate = useTransform(scrollY, [0, 420], [0, -7]);
  const vinylSlide = useTransform(scrollY, [0, 380], ["0%", "30%"]);
  const vinylSpin = useTransform(scrollY, (v) => v * 0.5);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 150, damping: 18 });
  const rotateY = useSpring(ry, { stiffness: 150, damping: 18 });

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ry.set(px * 14);
    rx.set(-py * 14);
  };

  return (
    <motion.div
      style={isMobile ? { scale: coverScale, rotate: coverRotate } : undefined}
    >
      <div
        className={cn(
          "relative [perspective:1200px]",
          !isPlaying && "mobile-float",
        )}
        onPointerMove={handleMove}
        onPointerLeave={() => {
          rx.set(0);
          ry.set(0);
        }}
      >
        {/* Vinilo */}
        <div
          aria-hidden
          className={cn(
            "absolute inset-y-[4%] right-0 aspect-square transition-transform duration-1000 ease-out",
            isPlaying
              ? "translate-x-[22%] sm:translate-x-[30%]"
              : "translate-x-[6%]",
          )}
        >
          <motion.div
            className="h-full w-full"
            style={
              isMobile
                ? { x: isPlaying ? "8%" : vinylSlide, rotate: vinylSpin }
                : undefined
            }
          >
            <div
              className={cn(
                "vinyl h-full w-full rounded-full",
                isPlaying && "animate-spin-slow",
              )}
            >
              <img
                src={LATEST_RELEASE.cover}
                alt=""
                className="absolute left-1/2 top-1/2 h-[34%] w-[34%] -translate-x-1/2 -translate-y-1/2 rounded-full object-cover"
              />
              <span className="absolute left-1/2 top-1/2 h-[4%] w-[4%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-background" />
            </div>
          </motion.div>
        </div>

        <motion.div
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="group relative aspect-square overflow-hidden rounded-2xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] ring-1 ring-white/10"
        >
          <img
            src={LATEST_RELEASE.cover}
            alt={`Portada de ${LATEST_RELEASE.title} de ${ARTIST.name}`}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Destello que cruza la portada una vez al cargar (solo celular) */}
          <div
            aria-hidden
            className="cover-shine pointer-events-none absolute inset-0"
          />
          {/* Reflejo de luz */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/25">
            <PlayButton
              className="h-20 w-20 scale-90 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 focus-visible:scale-100 focus-visible:opacity-100 sm:h-24 sm:w-24"
              iconClassName="h-8 w-8 sm:h-10 sm:w-10"
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function HeroPlayer() {
  const { isPlaying } = useAudioPlayer();
  return (
    <div className="glass relative mt-6 rounded-2xl p-4 sm:mt-8">
      <div className="flex items-center gap-4">
        <PlayButton className="h-12 w-12" iconClassName="h-5 w-5" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate font-semibold text-foreground">
              {LATEST_RELEASE.title}
            </p>
            <Equalizer active={isPlaying} />
          </div>
          <p className="truncate text-xs text-muted-foreground">
            {ARTIST.name} · {isPlaying ? "Sonando ahora" : "Toca para escuchar"}
          </p>
        </div>
        <VolumeControl className="hidden sm:flex" />
      </div>
      <ProgressBar className="mt-3" />
      <VolumeControl className="mt-2 justify-center sm:hidden" />
    </div>
  );
}
