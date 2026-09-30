import { motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import { Share2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ARTIST } from "./data";
import { EASE_OUT } from "./primitives";

const NAV_LINKS = [
  { href: "#videos", label: "Videos" },
  { href: "#instagram", label: "Instagram" },
  { href: "#plataformas", label: "Plataformas" },
];

export function Navbar({ onShare }: { onShare: () => void }) {
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 40));

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.3, ease: EASE_OUT }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
        scrolled
          ? "border-b border-white/5 bg-background/70 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <nav className="container flex h-16 items-center justify-between gap-4 px-4 sm:h-20 sm:px-6">
        <a
          href="#top"
          className="font-display text-2xl uppercase tracking-tight text-foreground sm:text-3xl"
          aria-label={`${ARTIST.name}, ir al inicio`}
        >
          HUNTER<span className="text-gold">X</span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="nav-link">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={onShare}
          className="tap-press group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-foreground backdrop-blur transition-colors hover:border-primary/60 hover:bg-primary hover:text-primary-foreground"
        >
          <Share2 className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-12" />
          <span>Compartir</span>
        </button>
      </nav>

      <motion.div
        className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-gradient-to-r from-primary via-amber-300 to-primary"
        style={{ scaleX: progress }}
      />
    </motion.header>
  );
}
