import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { haptic, useIsMobileLayout } from "@/hooks/use-media-query";
import { ArrowUpRight, Share2 } from "lucide-react";
import { PLATFORMS, type Platform } from "./data";
import { EASE_OUT, SectionHeading } from "./primitives";

const cardClass =
  "platform-card tap-press group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 text-left transition-[transform,border-color,background-color] duration-300 hover:-translate-y-1 hover:border-[color:var(--brand)] sm:p-5";

function trackSpotlight(e: React.PointerEvent<HTMLElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
}

function PlatformCard({ platform }: { platform: Platform }) {
  return (
    <a
      href={platform.url}
      target="_blank"
      rel="noopener noreferrer"
      onPointerMove={trackSpotlight}
      onClick={() => haptic()}
      style={{ "--brand": platform.color } as React.CSSProperties}
      className={cardClass}
    >
      <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] p-2 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
        <img
          src={platform.icon}
          alt=""
          loading="lazy"
          className="h-full w-full object-contain"
        />
      </span>
      <span className="relative min-w-0 flex-1">
        <span className="block font-semibold text-foreground">
          {platform.name}
        </span>
        <span className="block truncate text-sm text-muted-foreground">
          {platform.description}
        </span>
      </span>
      <ArrowUpRight className="relative h-5 w-5 shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
    </a>
  );
}

const list = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const listItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
};

/**
 * Celular: la tarjeta entra deslizándose desde un lado, ligada al scroll
 * (si subes, vuelve a salir). Solo transform/opacity.
 */
function ScrollSlideItem({
  index,
  className,
  children,
}: {
  index: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 72%"],
  });
  const fromLeft = index % 2 === 0;
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    [fromLeft ? "-65%" : "65%", "0%"],
  );
  const rotate = useTransform(scrollYProgress, [0, 1], [fromLeft ? -8 : 8, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.85, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);

  return (
    <motion.li
      ref={ref}
      className={className}
      style={{ x, rotate, scale, opacity }}
    >
      {children}
    </motion.li>
  );
}

export function PlatformsSection({ onShare }: { onShare: () => void }) {
  const isMobile = useIsMobileLayout();
  return (
    <section id="plataformas" className="relative scroll-mt-20 py-24 sm:py-32">
      <div className="container px-4 sm:px-6">
        <SectionHeading
          eyebrow="Escucha donde quieras"
          title={
            <>
              Conecta <span className="text-gold">conmigo</span>
            </>
          }
          description="Sígueme en todas las plataformas y mantente al día con mi música."
        />

        {(() => {
          const shareButton = (
            <button
              type="button"
              onClick={onShare}
              onPointerMove={trackSpotlight}
              style={
                { "--brand": "hsl(var(--primary))" } as React.CSSProperties
              }
              className={`${cardClass} w-full justify-center border-primary/30 bg-primary/10`}
            >
              <Share2 className="relative h-5 w-5 text-primary transition-transform duration-300 group-hover:-rotate-12" />
              <span className="relative font-semibold text-foreground">
                Comparte mi música con otros
              </span>
            </button>
          );

          if (isMobile) {
            return (
              <ul className="mx-auto grid max-w-4xl grid-cols-1 gap-3">
                {PLATFORMS.map((platform, i) => (
                  <ScrollSlideItem
                    key={platform.name}
                    index={i}
                    className="min-w-0"
                  >
                    <PlatformCard platform={platform} />
                  </ScrollSlideItem>
                ))}
                <ScrollSlideItem index={PLATFORMS.length}>
                  {shareButton}
                </ScrollSlideItem>
              </ul>
            );
          }

          return (
            <motion.ul
              variants={list}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              className="mx-auto grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4"
            >
              {PLATFORMS.map((platform) => (
                <motion.li
                  key={platform.name}
                  variants={listItem}
                  className="min-w-0"
                >
                  <PlatformCard platform={platform} />
                </motion.li>
              ))}
              <motion.li variants={listItem} className="sm:col-span-2">
                {shareButton}
              </motion.li>
            </motion.ul>
          );
        })()}
      </div>
    </section>
  );
}
