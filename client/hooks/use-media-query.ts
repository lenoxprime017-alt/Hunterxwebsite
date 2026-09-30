import { useEffect, useState } from "react";

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** Layout de escritorio (hero en dos columnas). */
export const useIsDesktopLayout = () => useMediaQuery("(min-width: 1024px)");

/** Celular / tablet: pantalla chica. Las animaciones extra solo se activan aquí. */
export const useIsMobileLayout = () => useMediaQuery("(max-width: 1023px)");

/** Vibración corta al tocar (solo Android; iOS la ignora). */
export function haptic(ms = 8) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(ms);
    } catch {
      /* algunos navegadores lo bloquean sin interacción previa */
    }
  }
}
