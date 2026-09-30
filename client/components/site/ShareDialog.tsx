import { Check, Copy, Send } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ARTIST, LATEST_RELEASE, SHARE_TEXT, SITE_URL } from "./data";

const SOCIALS = [
  {
    name: "WhatsApp",
    color: "#25D366",
    href: (url: string, text: string) => `https://wa.me/?text=${text}%20${url}`,
  },
  {
    name: "X / Twitter",
    color: "#e5e5e5",
    href: (url: string, text: string) =>
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
  },
  {
    name: "Facebook",
    color: "#1877F2",
    href: (url: string) => `https://www.facebook.com/sharer/sharer.php?u=${url}`,
  },
  {
    name: "Telegram",
    color: "#26A5E4",
    href: (url: string, text: string) =>
      `https://t.me/share/url?url=${url}&text=${text}`,
  },
];

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback para navegadores sin API de portapapeles
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textArea);
    return ok;
  }
}

/**
 * Usa el menú nativo de compartir si existe (móviles); si no, o si falla,
 * devuelve false para que se abra el diálogo.
 */
export async function tryNativeShare() {
  const isTouch = window.matchMedia("(pointer: coarse)").matches;
  if (!isTouch || typeof navigator.share !== "function") return false;
  try {
    await navigator.share({
      title: `${ARTIST.name} - ${ARTIST.tagline}`,
      text: SHARE_TEXT,
      url: SITE_URL,
    });
    return true;
  } catch (error) {
    // El usuario canceló: no abrir el diálogo
    return error instanceof DOMException && error.name === "AbortError";
  }
}

export function ShareDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  const url = encodeURIComponent(SITE_URL);
  const text = encodeURIComponent(SHARE_TEXT);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100vw-2rem)] overflow-hidden rounded-3xl border-white/10 bg-card/95 p-0 backdrop-blur-xl sm:max-w-md">
        <div className="relative h-32 overflow-hidden">
          <img
            src={LATEST_RELEASE.cover}
            alt=""
            className="h-full w-full scale-125 object-cover opacity-60 blur-2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card" />
          <img
            src={LATEST_RELEASE.cover}
            alt=""
            className="absolute bottom-0 left-1/2 h-20 w-20 -translate-x-1/2 translate-y-1/3 rounded-xl shadow-2xl ring-1 ring-white/20"
          />
        </div>

        <div className="px-6 pb-6 pt-8 text-center">
          <DialogTitle className="font-display text-3xl uppercase tracking-tight">
            Compartir <span className="text-gold">{ARTIST.name}</span>
          </DialogTitle>
          <DialogDescription className="mt-1 text-sm text-muted-foreground">
            Comparte mi música con tus amigos y familiares
          </DialogDescription>

          <div className="mt-6 flex items-center gap-2 rounded-xl border border-white/10 bg-background/60 p-1.5 pl-4">
            <span className="min-w-0 flex-1 truncate text-left text-sm text-muted-foreground">
              {SITE_URL.replace(/^https?:\/\//, "").replace(/\/$/, "")}
            </span>
            <button
              type="button"
              onClick={async () => setCopied(await copyText(SITE_URL))}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
                copied
                  ? "bg-emerald-500 text-white"
                  : "bg-primary text-primary-foreground hover:bg-primary/90",
              )}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "¡Copiado!" : "Copiar"}
            </button>
          </div>

          <p className="mb-3 mt-6 text-left text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Compartir en redes
          </p>
          <div className="grid grid-cols-2 gap-2">
            {SOCIALS.map((s) => (
              <a
                key={s.name}
                href={s.href(url, text)}
                target="_blank"
                rel="noopener noreferrer"
                style={{ "--brand": s.color } as React.CSSProperties}
                className="group inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-3 text-sm font-medium text-foreground transition-colors hover:border-[color:var(--brand)] hover:bg-white/5"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: s.color }}
                />
                {s.name}
                <Send className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-60" />
              </a>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
