// Contenido del sitio. Los textos, links, videos y publicaciones se editan
// desde el panel /admin (Decap CMS), que guarda los archivos de
// client/content/*.json. Este módulo los lee y VALIDA antes de usarlos:
// cualquier valor inválido o peligroso se descarta en lugar de mostrarse.

import artistJson from "@/content/artist.json";
import heroJson from "@/content/hero.json";
import instagramJson from "@/content/instagram.json";
import platformsJson from "@/content/platforms.json";
import videosJson from "@/content/videos.json";

// ---------- Validadores ----------

const str = (v: unknown, fallback = "") =>
  typeof v === "string" ? v.trim() : fallback;

/** Solo acepta enlaces https:// (evita `javascript:`, `data:`, etc.). */
function safeUrl(v: unknown, fallback = ""): string {
  const s = str(v);
  try {
    const url = new URL(s);
    return url.protocol === "https:" ? url.href : fallback;
  } catch {
    return fallback;
  }
}

/** Rutas de archivos propios del sitio (/uploads/..., /InmensoAmor.jpg). */
function safeAsset(v: unknown, fallback = ""): string {
  const s = str(v);
  return /^\/(?!\/)[\w\-./%]+$/.test(s) && !s.includes("..") ? s : fallback;
}

const safeColor = (v: unknown, fallback = "#fbbf24") =>
  /^#[0-9a-f]{3,8}$/i.test(str(v)) ? str(v) : fallback;

/** Extrae el ID de un link de YouTube (watch, youtu.be, shorts, embed o ID). */
export function parseYouTubeId(v: unknown): string | null {
  const s = str(v);
  if (/^[\w-]{11}$/.test(s)) return s;
  const m = s.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([\w-]{11})/,
  );
  return m ? m[1] : null;
}

/** Extrae el código de un link de Instagram (/p/, /reel/, /tv/ o el código). */
export function parseInstagramCode(v: unknown): string | null {
  const s = str(v);
  if (/^[\w-]{5,40}$/.test(s)) return s;
  const m = s.match(/instagram\.com\/(?:[\w.]+\/)?(?:p|reel|reels|tv)\/([\w-]{5,40})/);
  return m ? m[1] : null;
}

// ---------- Artista ----------

export const SITE_URL = safeUrl(artistJson.siteUrl, "https://linktreehunterx.netlify.app/");

export const ARTIST = {
  name: str(artistJson.name, "HUNTERX"),
  tagline: str(artistJson.tagline),
  bio: str(artistJson.bio),
  footerText: str(artistJson.footerText),
  instagramHandle: "@" + str(artistJson.instagramHandle).replace(/^@/, ""),
  instagramUrl: safeUrl(artistJson.instagramUrl, "https://www.instagram.com/"),
  youtubeUrl: safeUrl(artistJson.youtubeUrl, "https://www.youtube.com/"),
  spotifyUrl: safeUrl(artistJson.spotifyUrl, "https://open.spotify.com/"),
};

export const SHARE_TEXT = str(artistJson.shareText);

// ---------- Hero ----------

export type HeroMode = "audio" | "video";

export const LATEST_RELEASE = {
  /** "audio": canción con portada · "video": video en el hero */
  mode: (heroJson.mode === "video" ? "video" : "audio") as HeroMode,
  badge: str(heroJson.badge, "Nuevo sencillo"),
  title: str(heroJson.title),
  producer: str(heroJson.producer),
  cover: safeAsset(heroJson.cover, "/InmensoAmor.jpg"),
  audio: safeAsset(heroJson.audio),
  video: safeAsset(heroJson.video),
  youtubeUrl: safeUrl(heroJson.youtubeUrl, ARTIST.youtubeUrl),
  /** Duración (en segundos) del fragmento que suena en bucle en la página */
  previewSeconds: Math.max(10, Math.min(600, Number(heroJson.previewSeconds) || 59)),
};

// ---------- Plataformas ----------

export interface Platform {
  name: string;
  description: string;
  url: string;
  icon: string;
  /** Color de marca (hex) usado para el brillo al pasar el cursor */
  color: string;
}

export const PLATFORMS: Platform[] = (platformsJson.platforms ?? [])
  .map((p) => ({
    name: str(p.name),
    description: str(p.description),
    url: safeUrl(p.url),
    icon: safeAsset(p.icon),
    color: safeColor(p.color),
  }))
  .filter((p) => p.name && p.url);

// ---------- YouTube ----------

export interface YouTubeVideo {
  /** ID del video (youtube.com/watch?v=<id>) */
  id: string;
  title: string;
  /** Artistas que aparecen en el tema */
  artists: string;
  /** Tipo de publicación: Video Oficial, Audio Oficial, Visualizer... */
  kind: string;
}

/** Videos de YouTube. El primero es el video destacado. */
export const YOUTUBE_VIDEOS: YouTubeVideo[] = (videosJson.videos ?? [])
  .map((v) => ({
    id: parseYouTubeId(v.url) ?? "",
    title: str(v.title),
    artists: str(v.artists, ARTIST.name),
    kind: str(v.kind, "Video Oficial"),
  }))
  .filter((v) => v.id && v.title);

// ---------- Instagram ----------

export interface InstagramOverride {
  image?: string;
  username?: string;
  type?: string;
}

interface InstagramEntry {
  url?: string;
  image?: string;
  username?: string;
  type?: string;
}

const instagramEntries = ((instagramJson.posts ?? []) as InstagramEntry[])
  .map((p) => ({ code: parseInstagramCode(p.url), p }))
  .filter((e): e is { code: string; p: InstagramEntry } => !!e.code);

/** Códigos de las publicaciones de Instagram, en orden. */
export const INSTAGRAM_POSTS: string[] = instagramEntries.map((e) => e.code);

/** Datos opcionales puestos a mano en el panel (imagen, usuario, tipo). */
export const INSTAGRAM_OVERRIDES = new Map<string, InstagramOverride>(
  instagramEntries.map(({ code, p }) => [
    code,
    {
      image: safeAsset(p.image) || undefined,
      username: str(p.username).replace(/^@/, "") || undefined,
      type: ["reel", "carousel", "photo"].includes(str(p.type)) ? str(p.type) : undefined,
    },
  ]),
);
