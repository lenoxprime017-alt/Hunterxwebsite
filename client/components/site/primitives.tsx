import { motion, type HTMLMotionProps, type TargetAndTransition } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useIsMobileLayout } from "@/hooks/use-media-query";

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

interface RevealProps extends HTMLMotionProps<"div"> {
  delay?: number;
  y?: number;
  /**
   * Estado inicial extra solo para celular (p. ej. `{ x: -40 }` o
   * `{ scale: 0.9 }`). En PC se mantiene la animación original.
   */
  mobile?: TargetAndTransition;
}

/** Aparece suavemente cuando entra en pantalla. */
export function Reveal({
  delay = 0,
  y = 32,
  mobile,
  className,
  ...props
}: RevealProps) {
  const isMobile = useIsMobileLayout();
  const extra = isMobile && mobile ? mobile : {};
  const reset = Object.fromEntries(
    Object.keys(extra).map((k) => [k, k === "scale" ? 1 : 0]),
  );

  return (
    <motion.div
      initial={{ opacity: 0, y, ...extra }}
      whileInView={{ opacity: 1, y: 0, ...reset }}
      viewport={{ once: true, margin: isMobile ? "-40px" : "-80px" }}
      transition={
        isMobile && mobile
          ? { type: "spring", stiffness: 110, damping: 18, mass: 0.9, delay }
          : { duration: 0.8, delay, ease: EASE_OUT }
      }
      className={className}
      {...props}
    />
  );
}

/**
 * El contenido sube desde detrás de una máscara (efecto "cortina").
 * Solo en celular; en PC hace el Reveal normal.
 */
function MaskReveal({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) {
  const isMobile = useIsMobileLayout();
  if (!isMobile) return <Reveal delay={delay}>{children}</Reveal>;
  // El "inView" se detecta en el contenedor: el hijo empieza oculto por la
  // máscara y el navegador no lo consideraría visible nunca.
  return (
    <motion.div
      className="overflow-hidden pb-[0.08em]"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
    >
      <motion.div
        variants={{
          hidden: { y: "105%", rotate: 3 },
          show: {
            y: 0,
            rotate: 0,
            transition: { duration: 0.9, delay, ease: EASE_OUT },
          },
        }}
        style={{ transformOrigin: "left bottom" }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("mx-auto mb-12 max-w-3xl text-center sm:mb-16", className)}>
      <Reveal>
        <span className="eyebrow">{eyebrow}</span>
      </Reveal>
      <MaskReveal delay={0.08}>
        <h2 className="font-display mt-4 text-5xl uppercase leading-[0.9] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          {title}
        </h2>
      </MaskReveal>
      {description && (
        <Reveal delay={0.16}>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}

/** Barras de ecualizador animadas (decorativas). */
export function Equalizer({
  active,
  bars = 4,
  className,
}: {
  active: boolean;
  bars?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn("flex h-4 items-end gap-[3px]", className)}
    >
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "eq-bar w-[3px] rounded-full bg-primary",
            active ? "eq-bar--active" : "h-1",
          )}
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  );
}
