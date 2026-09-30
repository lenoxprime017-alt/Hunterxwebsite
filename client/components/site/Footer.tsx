import { ArrowUp, Instagram, Youtube } from "lucide-react";
import { ARTIST } from "./data";
import { Reveal } from "./primitives";

const SOCIALS = [
  { label: "Instagram", href: ARTIST.instagramUrl, icon: Instagram },
  { label: "YouTube", href: ARTIST.youtubeUrl, icon: Youtube },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-white/5 pb-28 pt-20 sm:pb-32">
      <div className="container px-4 sm:px-6">
        <Reveal className="text-center" mobile={{ scale: 0.85 }}>
          <p className="font-display select-none text-[24vw] uppercase leading-[0.8] tracking-tight text-transparent [-webkit-text-stroke:1px_hsl(var(--foreground)/0.15)] sm:text-[16rem]">
            {ARTIST.name}
          </p>
        </Reveal>

        <div className="mt-10 flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="max-w-sm text-sm text-muted-foreground">
            {ARTIST.footerText}
          </p>

          <div className="flex items-center gap-3">
            {SOCIALS.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:text-primary"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
            <a
              href="#top"
              aria-label="Volver arriba"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform duration-300 hover:-translate-y-1"
            >
              <ArrowUp className="h-5 w-5" />
            </a>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-muted-foreground/70">
          © {year} {ARTIST.name}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
