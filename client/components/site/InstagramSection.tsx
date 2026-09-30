import { motion, useInView, type PanInfo } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Image as ImageIcon,
  Instagram,
  Layers,
  Play,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { haptic, useIsMobileLayout } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { ARTIST, INSTAGRAM_POSTS } from "./data";
import generatedPosts from "./instagram.generated.json";
import { Reveal, SectionHeading } from "./primitives";

/** Tiempo que se muestra cada publicación antes de pasar a la siguiente. */
const AUTOPLAY_MS = 4500;
const TOTAL = INSTAGRAM_POSTS.length;

interface PostMeta {
  code: string;
  image: string;
  username: string;
  type: "reel" | "carousel" | "photo" | string;
}

/** Imágenes descargadas con `npm run instagram` (scripts/instagram-thumbs.mjs). */
const POST_META = new Map(
  (generatedPosts as PostMeta[]).map((post) => [post.code, post]),
);

const TYPE_BADGE = {
  reel: { label: "Reel", icon: Play },
  carousel: { label: "Carrusel", icon: Layers },
  photo: { label: "Foto", icon: ImageIcon },
} as const;

/**
 * Tarjeta de publicación con proporción fija 4:5: todas quedan del mismo
 * tamaño y recortadas igual, sin la parte blanca de los iframes de Instagram.
 */
function InstagramPost({ code, eager }: { code: string; eager?: boolean }) {
  const meta = POST_META.get(code);
  const [loaded, setLoaded] = useState(false);
  const username = meta?.username || ARTIST.instagramHandle.replace("@", "");
  const isOwn = `@${username}` === ARTIST.instagramHandle;
  const badge =
    TYPE_BADGE[(meta?.type ?? "photo") as keyof typeof TYPE_BADGE] ??
    TYPE_BADGE.photo;
  const BadgeIcon = badge.icon;

  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-card ring-1 ring-white/10">
      {meta ? (
        <img
          src={meta.image}
          alt={`Publicación de Instagram de @${username}`}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          draggable={false}
          onLoad={() => setLoaded(true)}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
            loaded ? "opacity-100" : "opacity-0",
          )}
        />
      ) : (
        // Publicación nueva sin imagen descargada todavía (falta `npm run instagram`)
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-pink-500/30 via-purple-500/20 to-amber-400/30">
          <Instagram className="h-12 w-12 text-white/80" />
          <span className="text-sm font-semibold text-white/80">
            Ver publicación
          </span>
        </div>
      )}
      {meta && !loaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-b from-white/[0.06] to-white/[0.02]" />
      )}

      {/* Encabezado: usuario */}
      <div className="absolute inset-x-0 top-0 flex items-center gap-2.5 bg-gradient-to-b from-black/70 via-black/30 to-transparent p-3.5 pb-10">
        <span className="rounded-full bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 p-[2px]">
          {isOwn ? (
            <img
              src="/apple-touch-icon.png?v=2"
              alt=""
              className="h-8 w-8 rounded-full border-2 border-black object-cover"
            />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-black bg-neutral-800 text-xs font-bold uppercase text-white">
              {username.charAt(0)}
            </span>
          )}
        </span>
        <span className="min-w-0 flex-1 truncate text-sm font-semibold text-white drop-shadow">
          {username}
        </span>
        <Instagram className="h-5 w-5 shrink-0 text-white/90" />
      </div>

      {/* Icono central para reels */}
      {meta?.type === "reel" && (
        <span className="pointer-events-none absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm">
          <Play className="h-6 w-6 translate-x-[2px] fill-current" />
        </span>
      )}

      {/* Pie: tipo de publicación */}
      <div className="absolute inset-x-0 bottom-0 flex items-end bg-gradient-to-t from-black/70 via-black/25 to-transparent p-3.5 pt-12">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur">
          <BadgeIcon
            className={cn("h-3.5 w-3.5", badge.icon === Play && "fill-current")}
          />
          {badge.label}
        </span>
      </div>
    </div>
  );
}

/** Distancia más corta entre dos posiciones de un carrusel circular. */
function wrapOffset(index: number, active: number) {
  let d = index - active;
  if (d > TOTAL / 2) d -= TOTAL;
  if (d < -TOTAL / 2) d += TOTAL;
  return d;
}

/**
 * Carrusel 3D automático e infinito (celular y PC). La publicación activa
 * queda al frente y las de los lados giradas y más pequeñas; al cambiar,
 * todas se desplazan con un resorte suave. Se puede deslizar con el dedo o
 * el mouse, y se pausa al pasar el cursor, al arrastrar o fuera de pantalla.
 */
function InstagramCarousel() {
  const isMobile = useIsMobileLayout();
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { margin: "-15% 0px" });
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const draggedRef = useRef(false);
  const prevActiveRef = useRef(active);

  const paused = hovered || dragging || !inView || !pageVisible;

  const go = useCallback((dir: number) => {
    setActive((a) => (a + dir + TOTAL) % TOTAL);
  }, []);

  useEffect(() => {
    prevActiveRef.current = active;
  }, [active]);

  useEffect(() => {
    const onVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // Autoplay: se reinicia cada vez que cambia la publicación activa, así
  // tocar una flecha o deslizar le da el tiempo completo a la nueva.
  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => go(1), AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [active, paused, go]);

  const onPanEnd = (_: unknown, info: PanInfo) => {
    setDragging(false);
    const swipe = info.offset.x + info.velocity.x * 0.2;
    if (Math.abs(swipe) > 60) {
      go(swipe < 0 ? 1 : -1);
      haptic(6);
    }
    // Ignora el "click" que llega justo después de soltar
    setTimeout(() => (draggedRef.current = false), 50);
  };

  const spacing = isMobile ? 62 : 78; // % del ancho de la tarjeta
  const visibleRange = isMobile ? 1 : 2;

  return (
    <div
      ref={rootRef}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      aria-roledescription="carrusel"
      aria-label="Publicaciones de Instagram"
    >
      <motion.div
        className="relative mx-auto h-[min(calc(97.5vw+40px),465px)] cursor-grab select-none active:cursor-grabbing"
        style={{
          touchAction: "pan-y",
          perspective: isMobile ? 1000 : 1400,
          transformStyle: "preserve-3d",
        }}
        onPanStart={() => {
          draggedRef.current = true;
          setDragging(true);
        }}
        onPanEnd={onPanEnd}
      >
        {INSTAGRAM_POSTS.map((code, i) => {
          const d = wrapOffset(i, active);
          const prevD = wrapOffset(i, prevActiveRef.current);
          const abs = Math.abs(d);
          const visible = abs <= visibleRange;
          const isActive = d === 0;
          // Una tarjeta que da la vuelta por detrás (de un extremo al otro)
          // se reubica sin animación para que no cruce la pantalla.
          const wrapped =
            prevD * d < 0 && Math.abs(prevD - d) > visibleRange + 1;
          const changed = prevD !== d;
          const leaving = changed && prevD === 0; // la que sale del centro
          const entering = changed && d === 0; // la que llega al centro

          const rotate = isMobile ? -38 : -32;
          const finalRotate = d * rotate;
          const finalScale = isActive ? 1 : 1 - abs * (isMobile ? 0.12 : 0.1);
          const finalZ = -abs * (isMobile ? 150 : 190);

          return (
            <motion.div
              key={code}
              className="absolute left-1/2 top-5 -ml-[min(39vw,170px)] w-[78vw] max-w-[340px]"
              style={{ zIndex: 20 - abs, willChange: "transform, opacity" }}
              initial={false}
              animate={{
                x: `${d * spacing}%`,
                z: finalZ,
                // La que sale gira de más (como una puerta) antes de acomodarse;
                // la que entra da un pequeño salto al frente.
                rotateY: leaving
                  ? [0, finalRotate * 1.9, finalRotate]
                  : entering
                    ? [prevD * rotate, prevD * rotate * -0.25, 0]
                    : finalRotate,
                scale: entering ? [finalScale * 0.9, 1.06, 1] : finalScale,
                y: entering ? [0, -18, 0] : 0,
                opacity: visible ? (isActive ? 1 : abs === 1 ? 0.75 : 0.4) : 0,
                visibility: visible ? "visible" : undefined,
                transitionEnd: visible ? undefined : { visibility: "hidden" },
              }}
              transition={
                wrapped
                  ? { duration: 0 }
                  : {
                      duration: 0.9,
                      ease: [0.22, 1, 0.36, 1],
                      opacity: { duration: 0.45 },
                    }
              }
              aria-hidden={!isActive}
            >
              {/* Brillo detrás de la publicación activa. En celular es un
                  borde degradado sin desenfoque: mucho más barato de dibujar. */}
              <motion.div
                aria-hidden
                className={cn(
                  "absolute bg-gradient-to-br from-pink-500 via-purple-500 to-amber-400",
                  isMobile
                    ? "-inset-[3px] rounded-[19px]"
                    : "-inset-3 rounded-[28px] blur-2xl",
                )}
                initial={false}
                animate={{ opacity: isActive ? (isMobile ? 1 : 0.35) : 0 }}
                transition={{ duration: 0.6 }}
              />
              <div className="relative">
                <InstagramPost code={code} eager={abs <= 1} />
                {/* Sombra de las laterales (más barata que un filtro) */}
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-black/70 via-black/40 to-black/70"
                  initial={false}
                  animate={{ opacity: isActive ? 0 : Math.min(1, abs * 0.55) }}
                  transition={{ duration: 0.6 }}
                />
                {/* Capa encima del iframe: permite deslizar sobre la
                    publicación. La activa abre el post; las otras la centran. */}
                <button
                  type="button"
                  tabIndex={visible ? 0 : -1}
                  aria-label={
                    isActive
                      ? "Abrir publicación en Instagram"
                      : `Ver publicación ${i + 1}`
                  }
                  onClick={() => {
                    if (draggedRef.current) return;
                    if (isActive) {
                      window.open(
                        `https://www.instagram.com/p/${code}/`,
                        "_blank",
                        "noopener,noreferrer",
                      );
                    } else {
                      setActive(i);
                      haptic(6);
                    }
                  }}
                  className="group absolute inset-0 rounded-2xl"
                >
                  {isActive && (
                    <span className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-semibold text-white opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100 [@media(hover:none)]:opacity-100">
                      <ExternalLink className="h-3.5 w-3.5" />
                      Ver en Instagram
                    </span>
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Controles */}
      <div className="mt-6 flex items-center justify-center gap-5">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Publicación anterior"
          className="tap-press flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-foreground transition-colors hover:border-pink-400/60 hover:bg-white/10"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          {INSTAGRAM_POSTS.map((code, i) => (
            <button
              key={code}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Ir a la publicación ${i + 1}`}
              aria-current={i === active}
              className="flex h-6 items-center"
            >
              <span
                className={cn(
                  "relative block h-1.5 overflow-hidden rounded-full bg-white/20 transition-all duration-500 ease-out",
                  i === active ? "w-10" : "w-1.5 hover:bg-white/40",
                )}
              >
                {/* El punto activo se va llenando mientras corre el tiempo */}
                {i === active && !paused && (
                  <span
                    key={active}
                    className="ig-progress absolute inset-0 origin-left rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-amber-400"
                    style={{ animationDuration: `${AUTOPLAY_MS}ms` }}
                  />
                )}
                {i === active && paused && (
                  <span className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-amber-400 opacity-60" />
                )}
              </span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Publicación siguiente"
          className="tap-press flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-foreground transition-colors hover:border-pink-400/60 hover:bg-white/10"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

export function InstagramSection() {
  return (
    <section
      id="instagram"
      className="relative scroll-mt-20 overflow-hidden py-24 sm:py-32"
    >
      <div
        aria-hidden
        className="glow-orb glow-orb--pink -right-40 top-40 h-96 w-96 opacity-25"
      />
      <div className="container px-4 sm:px-6">
        <SectionHeading
          eyebrow={ARTIST.instagramHandle}
          title={
            <>
              En <span className="text-instagram">Instagram</span>
            </>
          }
          description="Sígueme para contenido exclusivo, detrás de cámaras y las últimas noticias."
        />

        <Reveal mobile={{ scale: 0.9 }}>
          <InstagramCarousel />
        </Reveal>

        <Reveal
          className="mt-12 flex justify-center sm:mt-16"
          mobile={{ scale: 0.8 }}
        >
          <a
            href={ARTIST.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="tap-press group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-amber-500 px-8 py-4 text-lg font-semibold text-white shadow-[0_20px_50px_-15px_rgba(236,72,153,0.6)] transition-transform duration-300 hover:-translate-y-1"
          >
            <Instagram className="h-6 w-6 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
            Seguir a {ARTIST.instagramHandle}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
