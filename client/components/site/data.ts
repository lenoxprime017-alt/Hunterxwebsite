// Contenido del sitio centralizado: para actualizar links, videos o posts
// solo hay que editar este archivo.

export const SITE_URL = "https://linktreehunterx.netlify.app/";

export const ARTIST = {
  name: "HUNTERX",
  tagline: "Música Urbana Cristiana",
  bio: "Música urbana con propósito. Llevando esperanza y fe a las calles a través de letras que transforman vidas.",
  instagramHandle: "@hunterxoficial",
  instagramUrl: "https://www.instagram.com/hunterxoficial/",
  youtubeUrl: "https://www.youtube.com/@EHUNTERX",
  spotifyUrl: "https://open.spotify.com/artist/0S8UiJTjzt86hM9wolenDG",
};

export const LATEST_RELEASE = {
  title: "Inmenso Amor",
  producer: "Prod. Latrenzha",
  cover: "/InmensoAmor.jpg",
  audio: "/InmensoAmor.mp3",
  youtubeUrl: "https://www.youtube.com/watch?v=2b2HiphJnAw",
  /** Duración (en segundos) del fragmento que suena en bucle en la página */
  previewSeconds: 59,
};

export const SHARE_TEXT =
  "¡Descubre la música urbana con propósito de HUNTERX! 🎵✨";

export interface Platform {
  name: string;
  description: string;
  url: string;
  icon: string;
  /** Color de marca (hex) usado para el brillo al pasar el cursor */
  color: string;
}

export const PLATFORMS: Platform[] = [
  {
    name: "Spotify",
    description: "Escucha mi música completa",
    url: ARTIST.spotifyUrl,
    icon: "/Spotify.png",
    color: "#1DB954",
  },
  {
    name: "Apple Music",
    description: "Disponible en Apple Music",
    url: "https://music.apple.com/do/artist/hunterx/1458292118",
    icon: "/Apple_Music.png",
    color: "#FA243C",
  },
  {
    name: "YouTube Music",
    description: "Disponible en YouTube Music",
    url: "https://music.youtube.com/channel/UC3ravZxAW9yucYtqYndGUNw",
    icon: "/Youtube_Music.png",
    color: "#FF0033",
  },
  {
    name: "Amazon Music",
    description: "Escucha en Amazon Music",
    url: "https://music.amazon.com/artists/B0B1H5S5NN/hunterx",
    icon: "/AmazonMusic.png",
    color: "#25D1DA",
  },
  {
    name: "Tidal",
    description: "Música sin pérdida en Tidal",
    url: "https://tidal.com/artist/32191449",
    icon: "/Tidal.png",
    color: "#E5E5E5",
  },
  {
    name: "Deezer",
    description: "Disponible en Deezer",
    url: "https://www.deezer.com/us/artist/170169807",
    icon: "/Deezer.png",
    color: "#A238FF",
  },
  {
    name: "SoundCloud",
    description: "Descubre mi música en SoundCloud",
    url: "https://soundcloud.com/hunterx-music",
    icon: "/soundcloud.png",
    color: "#FF5500",
  },
  {
    name: "Boomplay",
    description: "Escucha en Boomplay",
    url: "https://www.boomplay.com/artists/108407557",
    icon: "/Boomplay.png",
    color: "#2E6BFF",
  },
  {
    name: "YouTube",
    description: "@EHUNTERX · Videos y contenido exclusivo",
    url: ARTIST.youtubeUrl,
    icon: "/Youtube.png",
    color: "#FF0000",
  },
  {
    name: "Instagram",
    description: "@hunterxoficial · Detrás de cámaras y más",
    url: ARTIST.instagramUrl,
    icon: "/Instagram.png",
    color: "#E1306C",
  },
];

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
export const YOUTUBE_VIDEOS: YouTubeVideo[] = [
  {
    id: "2b2HiphJnAw",
    title: "Inmenso Amor",
    artists: "HUNTERX",
    kind: "Audio Oficial",
  },
  {
    id: "IiPXiinr0lg",
    title: "Cristo Redentor",
    artists: "HUNTERX, Moyh",
    kind: "Video Oficial",
  },
  {
    id: "Q48dAWMFlBY",
    title: "No Me Rindo",
    artists: "HUNTERX",
    kind: "Visualizer",
  },
  {
    id: "4kHW5ZkYHIQ",
    title: "Jerusalén",
    artists: "HUNTERX ft. Julia Javier",
    kind: "Video Oficial",
  },
];

/**
 * Códigos de publicaciones de Instagram (instagram.com/p/<código>).
 * Después de agregar o cambiar uno, ejecuta `npm run instagram` para
 * descargar su imagen (se guarda en public/instagram/).
 */
export const INSTAGRAM_POSTS = [
  "DZNQmHkAevp",
  "DZKqIq2lgxm",
  "DYDeVdiorrD",
  "DXsdi4KiFo7",
  "DXpwgVrFg6h",
  "DW_q5IRjZd2",
];
