import { AnimatePresence, MotionConfig, useInView } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { AudioPlayerProvider } from "@/hooks/use-audio-player";
import { LATEST_RELEASE } from "@/components/site/data";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/site/Hero";
import { InstagramSection } from "@/components/site/InstagramSection";
import { IntroLoader, useCriticalAssets } from "@/components/site/IntroLoader";
import { Marquee } from "@/components/site/Marquee";
import { MiniPlayer } from "@/components/site/MiniPlayer";
import { Navbar } from "@/components/site/Navbar";
import { PlatformsSection } from "@/components/site/PlatformsSection";
import { ShareDialog, tryNativeShare } from "@/components/site/ShareDialog";
import { VideosSection } from "@/components/site/VideosSection";

export default function Index() {
  const ready = useCriticalAssets([LATEST_RELEASE.cover]);
  const [shareOpen, setShareOpen] = useState(false);

  const heroSentinelRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroSentinelRef, { initial: true });

  // Evita que el navegador restaure el scroll a mitad de página detrás de la intro
  useEffect(() => {
    if (!ready) window.scrollTo(0, 0);
  }, [ready]);

  const handleShare = useCallback(async () => {
    const shared = await tryNativeShare();
    if (!shared) setShareOpen(true);
  }, []);

  // Las animaciones son parte de la identidad del sitio: se muestran aunque el
  // sistema tenga "reducir movimiento" (Windows lo activa al apagar los
  // "Efectos de animación"). Para respetarlo, cambiar a reducedMotion="user".
  return (
    <MotionConfig reducedMotion="never">
      <AudioPlayerProvider
        src={LATEST_RELEASE.audio}
        loopAt={LATEST_RELEASE.previewSeconds}
      >
        <AnimatePresence>{!ready && <IntroLoader />}</AnimatePresence>

        <div className="noise relative min-h-screen overflow-x-clip" translate="no">
          <Navbar onShare={handleShare} />

          <main>
            <Hero ready={ready} />
            {/* Marca el final del hero: al salir de pantalla aparece el mini reproductor */}
            <div ref={heroSentinelRef} aria-hidden className="h-px" />
            <Marquee />
            <VideosSection />
            <InstagramSection />
            <PlatformsSection onShare={handleShare} />
          </main>

          <Footer />
          <MiniPlayer visible={ready && !heroInView} />
        </div>

        <ShareDialog open={shareOpen} onOpenChange={setShareOpen} />
      </AudioPlayerProvider>
    </MotionConfig>
  );
}
