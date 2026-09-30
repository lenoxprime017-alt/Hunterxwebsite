import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Play } from "lucide-react";
import { useRef, useState } from "react";
import { useIsMobileLayout } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { ARTIST, YOUTUBE_VIDEOS, type YouTubeVideo } from "./data";
import { Reveal, SectionHeading } from "./primitives";

/**
 * Muestra la miniatura del video y solo carga el reproductor de YouTube al
 * hacer clic. Cargar 4 iframes de YouTube de entrada pesaba varios MB.
 */
function YouTubeFacade({
  video,
  featured = false,
}: {
  video: YouTubeVideo;
  featured?: boolean;
}) {
  const { id } = video;
  const fullTitle = `${video.artists} - ${video.title} (${video.kind})`;
  const [active, setActive] = useState(false);
  const [thumb, setThumb] = useState(
    `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
  );

  return (
    <div
      className={cn(
        "group relative aspect-video overflow-hidden rounded-2xl bg-card ring-1 ring-white/10 transition-shadow duration-500 hover:shadow-[0_30px_80px_-20px_hsl(var(--primary)/0.35)]",
        featured && "rounded-3xl",
      )}
    >
      {active ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
          title={fullTitle}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setActive(true)}
          className="tap-press absolute inset-0 h-full w-full"
          aria-label={`Reproducir ${fullTitle}`}
        >
          <img
            src={thumb}
            alt=""
            loading="lazy"
            decoding="async"
            onLoad={(e) => {
              // YouTube devuelve una imagen gris de 120px si no existe maxres
              if (
                e.currentTarget.naturalWidth <= 120 &&
                thumb.includes("maxres")
              ) {
                setThumb(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`);
              }
            }}
            onError={() =>
              setThumb(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`)
            }
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent transition-opacity duration-500 group-hover:opacity-70" />
          <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
            <span className="absolute h-full w-full animate-ping-slow rounded-full bg-primary/40" />
            <span
              className={cn(
                "relative flex items-center justify-center rounded-full bg-primary text-primary-foreground shadow-2xl transition-transform duration-300 group-hover:scale-110",
                featured ? "h-20 w-20 sm:h-24 sm:w-24" : "h-14 w-14",
              )}
            >
              <Play
                className={cn(
                  "translate-x-[2px] fill-current",
                  featured ? "h-8 w-8 sm:h-10 sm:w-10" : "h-6 w-6",
                )}
              />
            </span>
          </span>
          <span
            className={cn(
              "absolute inset-x-0 bottom-0 flex flex-col items-start gap-1 bg-gradient-to-t from-black/80 to-transparent text-left",
              featured ? "p-5 pt-16 sm:p-8 sm:pt-24" : "p-4 pt-12",
            )}
          >
            {featured && (
              <span className="mb-2 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary-foreground">
                Último lanzamiento
              </span>
            )}
            <span
              className={cn(
                "font-display uppercase leading-none tracking-tight text-white",
                featured ? "text-3xl sm:text-5xl" : "text-2xl",
              )}
            >
              {video.title}
            </span>
            <span className="text-xs text-white/70 sm:text-sm">
              {video.artists} · {video.kind}
            </span>
          </span>
        </button>
      )}
    </div>
  );
}

/**
 * Tarjetas apiladas (celular y PC). Cada video se queda fijo arriba mientras
 * el siguiente sube encima; el de atrás se encoge y oscurece. Todo va ligado
 * al scroll (solo transform/opacity, sin re-renders de React).
 */
function StackCard({
  video,
  index,
  total,
  progress,
  isMobile,
}: {
  video: YouTubeVideo;
  index: number;
  total: number;
  progress: MotionValue<number>;
  isMobile: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const depth = total - 1 - index;
  const start = index / total;
  const scale = useTransform(progress, [start, 1], [1, 1 - depth * 0.07]);
  const dim = useTransform(progress, [start, 1], [0, depth * 0.22]);

  // Entrada: la tarjeta se "levanta" en 3D a medida que aparece
  const { scrollYProgress: enter } = useScroll({
    target: cardRef,
    offset: ["start end", "start 45%"],
  });
  const rotateX = useTransform(enter, [0, 1], [28, 0]);
  const y = useTransform(enter, [0, 1], [60, 0]);

  return (
    <div
      ref={cardRef}
      className={cn(
        "sticky flex items-start",
        // La última no necesita espacio extra debajo: evita un hueco vacío
        index === total - 1 ? "pb-2" : "h-[46svh] lg:h-[78svh]",
      )}
      style={{
        top: `calc(${isMobile ? "5.5rem" : "7rem"} + ${index * (isMobile ? 14 : 20)}px)`,
      }}
    >
      <motion.div
        className="relative w-full origin-top will-change-transform"
        style={{ scale, rotateX, y, transformPerspective: 1000 }}
      >
        <YouTubeFacade video={video} featured={index === 0} />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-3xl bg-black"
          style={{ opacity: dim }}
        />
      </motion.div>
    </div>
  );
}

function VideoStack() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobileLayout();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={containerRef} className="relative">
      {YOUTUBE_VIDEOS.map((video, i) => (
        <StackCard
          key={video.id}
          video={video}
          index={i}
          total={YOUTUBE_VIDEOS.length}
          progress={scrollYProgress}
          isMobile={isMobile}
        />
      ))}
    </div>
  );
}

export function VideosSection() {
  return (
    <section id="videos" className="relative scroll-mt-20 py-24 sm:py-32">
      <div className="container px-4 sm:px-6">
        <SectionHeading
          eyebrow="YouTube"
          title={
            <>
              Últimos <span className="text-gold">videos</span>
            </>
          }
          description="Descubre la música que está impactando vidas y llevando esperanza."
        />

        <div className="mx-auto max-w-4xl">
          <VideoStack />

          <Reveal className="mt-10 text-center">
            <a
              href={ARTIST.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
            >
              Ver todo en YouTube →
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
