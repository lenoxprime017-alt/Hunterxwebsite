import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// Dialog imports removed - using custom modal instead
import {
  Play,
  Music,
  Heart,
  Share2,
  Instagram,
  Youtube,
  Music2,
  Headphones,
  Copy,
  Check,
  X,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";

export default function Index() {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Debug logging for modal state
  useEffect(() => {
    console.log("Modal state changed:", isShareModalOpen);
  }, [isShareModalOpen]);

  // Cerrar modal con tecla ESC y bloquear scroll
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isShareModalOpen) {
        setIsShareModalOpen(false);
      }
    };

    if (isShareModalOpen) {
      // Bloquear scroll del body cuando el modal está abierto
      document.body.style.overflow = 'hidden';
      document.addEventListener("keydown", handleEscKey);
    } else {
      // Restaurar scroll cuando el modal se cierra
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
      // Asegurar que el scroll se restaure al limpiar
      document.body.style.overflow = 'unset';
    };
  }, [isShareModalOpen]);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [visibleIframes, setVisibleIframes] = useState<Set<string>>(new Set());
  const [showVideo, setShowVideo] = useState(false);

  // Detectar móvil al cargar la página
  useEffect(() => {
    const checkMobile = () => {
      const mobile =
        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        ) || window.innerWidth <= 768;
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleVideoLoad = useCallback(() => {
    setVideoLoaded(true);
  }, []);

  // Precargar video inmediatamente y mostrar cuando cargue
  useEffect(() => {
    // Precargar el video inmediatamente al montar el componente
    const video = document.createElement('video');
    video.src = "https://cdn.builder.io/o/assets%2Fe5efb23401dd4b95852e27b8d0f225c2%2Fd7b18dfa4be248398d8497372bca2951?alt=media&token=221edc24-6aaf-43e9-a04e-41dcfa15d339&apiKey=e5efb23401dd4b95852e27b8d0f225c2";
    video.preload = 'auto';
    video.muted = true;

    const duration = 2200; // 2.2 segundos total
    const intervals = 22;
    const increment = 100 / intervals;

    const timer = setInterval(() => {
      setLoadingProgress((prev) => {
        const next = prev + increment;

        // Cuando llegue a 80%, mostrar el video (antes que termine la carga)
        if (next >= 80 && !showVideo) {
          setShowVideo(true);
        }

        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => setPageLoaded(true), 300);
          return 100;
        }
        return next;
      });
    }, duration / intervals);

    return () => {
      clearInterval(timer);
      video.remove(); // Limpiar el video precargado
    };
  }, [showVideo]);

  // Reproducir automáticamente el video cuando se muestre
  useEffect(() => {
    if (showVideo) {
      // Buscar el video y garantizar que se reproduzca
      setTimeout(() => {
        const video = document.querySelector('video');
        if (video) {
          video.play().catch(console.warn);
        }
      }, 100);
    }
  }, [showVideo]);

  // Cargar todos los iframes inmediatamente
  useEffect(() => {
    // Cargar todos los iframes desde el inicio
    setVisibleIframes(
      new Set([
        "main-video",
        "video-2",
        "video-3",
        "video-4",
        "instagram-1",
        "instagram-2",
        "instagram-3",
        "instagram-4",
        "instagram-5",
        "instagram-6",
      ]),
    );
  }, []);

  const handleMobileShare = async () => {
    const shareData = {
      title: "HUNTERX - Música Urbana Cristiana",
      text: "Descubre la música urbana con propósito de HUNTERX. Llevando esperanza y fe a las calles.",
      url: "https://linktreehunterx.netlify.app/",
    };

    try {
      await navigator.share(shareData);

      // Prevenir efectos de blur/filtros después de compartir
      const preventBlur = () => {
        document.body.style.filter = "none";
        document.body.style.webkitFilter = "none";
        document.documentElement.style.filter = "none";
        document.documentElement.style.webkitFilter = "none";
      };

      preventBlur();
      setTimeout(preventBlur, 100);
      setTimeout(preventBlur, 500);

      const handleVisibilityChange = () => {
        if (!document.hidden) {
          preventBlur();
        }
      };

      const handleFocus = () => {
        preventBlur();
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);
      window.addEventListener("focus", handleFocus);

      setTimeout(() => {
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange,
        );
        window.removeEventListener("focus", handleFocus);
      }, 5000);
    } catch (error) {
      if (error.name !== "AbortError") {
        console.log("Error al compartir:", error);
      }
      // Si falla, abrir modal
      setIsShareModalOpen(true);
    }
  };

  const copyToClipboard = async () => {
    const urlToCopy = "https://linktreehunterx.netlify.app/";
    try {
      await navigator.clipboard.writeText(urlToCopy);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      // Fallback para navegadores más antiguos
      const textArea = document.createElement("textarea");
      textArea.value = urlToCopy;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const shareToSocial = (platform: string) => {
    const url = encodeURIComponent("https://linktreehunterx.netlify.app/");
    const text = encodeURIComponent(
      "¡Descubre la música urbana con propósito de HUNTERX! 🎵✨",
    );

    let shareUrl = "";

    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${text} ${url}`;
        break;
      case "telegram":
        shareUrl = `https://t.me/share/url?url=${url}&text=${text}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  // Pantalla de carga inicial
  if (!pageLoaded) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-accent/10 flex items-center justify-center z-50 min-h-screen">
        <div className="text-center px-4 max-w-md mx-auto">
          <div className="mb-12">
            <h1 className="text-5xl sm:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent tracking-tight">
              HUNTERX
            </h1>
            <p className="text-muted-foreground text-xl">
              Cargando experiencia musical...
            </p>
          </div>
          <div className="w-full max-w-xs mx-auto">
            <div className="h-3 bg-muted rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 ease-out rounded-full"
                style={{ width: `${Math.min(loadingProgress, 100)}%` }}
              />
            </div>
            <p className="text-base text-muted-foreground font-medium">
              {Math.round(Math.min(loadingProgress, 100))}%
            </p>
          </div>
          <div className="mt-8 text-sm text-muted-foreground">
            {loadingProgress < 30 && "Preparando contenido..."}
            {loadingProgress >= 30 &&
              loadingProgress < 60 &&
              "Cargando videos..."}
            {loadingProgress >= 60 &&
              loadingProgress < 90 &&
              "Optimizando experiencia..."}
            {loadingProgress >= 90 && "¡Casi listo!"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10"
      translate="no"
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden h-screen">
        {showVideo && (
          <video
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-100"
            src="https://cdn.builder.io/o/assets%2Fe5efb23401dd4b95852e27b8d0f225c2%2Fd7b18dfa4be248398d8497372bca2951?alt=media&token=221edc24-6aaf-43e9-a04e-41dcfa15d339&apiKey=e5efb23401dd4b95852e27b8d0f225c2"
            autoPlay
            loop
            muted={true}
            playsInline
            preload="auto"
            onCanPlay={(e) => {
              // Asegurar que el video se reproduzca inmediatamente cuando esté listo
              e.currentTarget.play();
            }}
            onLoadStart={() => {
              // Pre-cargar el video en segundo plano
              console.log('Video empezando a cargar');
            }}
          />
        )}
        {!showVideo && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
            <div className="animate-pulse text-primary text-lg font-medium">
              Preparando video...
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
              <Badge
                variant="secondary"
                className="mb-4 sm:mb-6 text-xs sm:text-sm font-semibold px-3 py-1"
              >
                Música Urbana Cristiana
              </Badge>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 lg:mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent leading-tight tracking-tight">
                HUNTERX
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground mb-8 sm:mb-10 lg:mb-12 max-w-3xl leading-relaxed px-4">
                Música urbana con propósito. Llevando esperanza y fe a las
                calles a través de letras que transforman vidas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto max-w-md sm:max-w-none">
                <Button
                  size="lg"
                  className="group w-full sm:w-auto h-14 sm:h-16 text-base sm:text-lg lg:text-xl px-8 sm:px-10"
                  onClick={() =>
                    window.open(
                      "https://www.youtube.com/watch?v=4kHW5ZkYHIQ",
                      "_blank",
                    )
                  }
                >
                  <Play className="mr-3 h-5 w-5 sm:h-6 sm:w-6 group-hover:scale-110 transition-transform" />
                  Escuchar Ahora
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto h-14 sm:h-16 text-base sm:text-lg lg:text-xl px-8 sm:px-10"
                  onClick={() =>
                    window.open(
                      "https://www.instagram.com/hunterxoficial/",
                      "_blank",
                    )
                  }
                >
                  <Heart className="mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                  Seguir
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Video Section */}
      <section className="py-16 sm:py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
              Últimos Videos
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg lg:text-xl max-w-4xl mx-auto px-4 sm:px-0 leading-relaxed">
              Descubre la música que está impactando vidas y llevando esperanza
            </p>
          </div>

          <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
            {/* Main Featured Video - Latest Song */}
            <Card className="overflow-hidden group hover:scale-[1.01] transition-all duration-500 shadow-2xl hover:shadow-3xl">
              <CardContent className="p-0">
                <div
                  className="relative aspect-video"
                  data-iframe-id="main-video"
                >
                  {visibleIframes.has("main-video") ? (
                    <iframe
                      className="w-full h-full rounded-lg"
                      src="https://www.youtube.com/embed/4kHW5ZkYHIQ?rel=0&showinfo=0&modestbranding=1&iv_load_policy=3&fs=1&cc_load_policy=0&disablekb=0&autohide=1&enablejsapi=1"
                      title="HUNTERX - Última Canción"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      loading="eager"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Play className="w-16 h-16 text-primary mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          Video de YouTube cargando...
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Secondary Videos Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
              <Card className="overflow-hidden group hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl">
                <CardContent className="p-0">
                  <div className="relative aspect-video">
                    <iframe
                      className="w-full h-full rounded-lg"
                      src="https://www.youtube.com/embed/JTwL53RpQls?rel=0&showinfo=0&modestbranding=1&iv_load_policy=3&fs=1&cc_load_policy=0&disablekb=0&autohide=1&enablejsapi=1"
                      title="HUNTERX - Video 2"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      loading="eager"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden group hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl">
                <CardContent className="p-0">
                  <div className="relative aspect-video">
                    <iframe
                      className="w-full h-full rounded-lg"
                      src="https://www.youtube.com/embed/BzivzcIRpOM?rel=0&showinfo=0&modestbranding=1&iv_load_policy=3&fs=1&cc_load_policy=0&disablekb=0&autohide=1&enablejsapi=1"
                      title="HUNTERX - Video 3"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      loading="eager"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden group hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl md:col-span-2 xl:col-span-1">
                <CardContent className="p-0">
                  <div className="relative aspect-video">
                    <iframe
                      className="w-full h-full rounded-lg"
                      src="https://www.youtube.com/embed/tsPldB4iXpE?rel=0&showinfo=0&modestbranding=1&iv_load_policy=3&fs=1&cc_load_policy=0&disablekb=0&autohide=1&enablejsapi=1"
                      title="HUNTERX - Video 4"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      loading="eager"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Posts Section */}
      <section className="py-20 sm:py-24 lg:py-32 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card/50" />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-secondary/5" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16 sm:mb-20 lg:mb-24">
            <div className="inline-flex items-center gap-2 sm:gap-3 mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <Instagram className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h2
                className="text-3xl sm:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 bg-clip-text text-transparent leading-tight"
                style={{ paddingBottom: "0.2em" }}
              >
                Instagram
              </h2>
            </div>
            <p className="text-muted-foreground text-lg sm:text-xl max-w-3xl mx-auto mb-6 sm:mb-8 px-4 sm:px-0">
              Sígueme para contenido exclusivo, detrás de cámaras y las últimas
              noticias
            </p>
            <Button
              size="lg"
              className="group bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 hover:from-pink-600 hover:via-purple-600 hover:to-orange-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 h-14 sm:h-16 px-8 sm:px-12 text-lg sm:text-xl"
              onClick={() =>
                window.open(
                  "https://www.instagram.com/hunterxoficial/",
                  "_blank",
                )
              }
            >
              <Instagram className="mr-4 h-6 w-6 sm:h-7 sm:w-7 group-hover:scale-110 transition-transform" />
              @hunterxoficial
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
            {/* Instagram Post 1 */}
            <div className="group relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500" />
              <Card className="relative overflow-hidden rounded-2xl border border-border/20 bg-background/95 backdrop-blur-sm group-hover:border-primary/30 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-2xl">
                <CardContent className="p-0">
                  <div
                    className="relative overflow-hidden bg-background rounded-xl instagram-container"
                    style={{ height: "500px" }}
                  >
                    <iframe
                      src="https://www.instagram.com/p/DL5CtHzt0Zd/embed/?utm_source=ig_embed&ig_rid=null"
                      width="100%"
                      height="500"
                      frameBorder="0"
                      scrolling="no"
                      allowtransparency="true"
                      className="w-full h-full rounded-xl transition-transform duration-300 group-hover:scale-[1.01] instagram-embed"
                      loading="eager"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Instagram Post 2 */}
            <div className="group relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 via-orange-500 to-pink-500 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500" />
              <Card className="relative overflow-hidden rounded-2xl border border-border/20 bg-background/95 backdrop-blur-sm group-hover:border-secondary/30 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-2xl">
                <CardContent className="p-0">
                  <div
                    className="relative overflow-hidden bg-background rounded-xl instagram-container"
                    style={{ height: "500px" }}
                  >
                    <iframe
                      src="https://www.instagram.com/p/DL5yywlOrvk/embed/?utm_source=ig_embed&ig_rid=null"
                      width="100%"
                      height="500"
                      frameBorder="0"
                      scrolling="no"
                      allowtransparency="true"
                      className="w-full h-full rounded-xl transition-transform duration-300 group-hover:scale-[1.01] instagram-embed"
                      loading="eager"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Instagram Post 3 */}
            <div className="group relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500" />
              <Card className="relative overflow-hidden rounded-2xl border border-border/20 bg-background/95 backdrop-blur-sm group-hover:border-accent/30 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-2xl">
                <CardContent className="p-0">
                  <div
                    className="relative overflow-hidden bg-background rounded-xl instagram-container"
                    style={{ height: "500px" }}
                  >
                    <iframe
                      src="https://www.instagram.com/p/DCzzvj0vzTv/embed/?utm_source=ig_embed&ig_rid=null"
                      width="100%"
                      height="500"
                      frameBorder="0"
                      scrolling="no"
                      allowtransparency="true"
                      className="w-full h-full rounded-xl transition-transform duration-300 group-hover:scale-[1.01] instagram-embed"
                      loading="eager"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Instagram Post 4 */}
            <div className="group relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-pink-500 via-orange-500 to-purple-500 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500" />
              <Card className="relative overflow-hidden rounded-2xl border border-border/20 bg-background/95 backdrop-blur-sm group-hover:border-primary/30 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-2xl">
                <CardContent className="p-0">
                  <div
                    className="relative overflow-hidden bg-background rounded-xl instagram-container"
                    style={{ height: "500px" }}
                  >
                    <iframe
                      src="https://www.instagram.com/p/DMNv9T8tjAC/embed/?utm_source=ig_embed&ig_rid=null"
                      width="100%"
                      height="500"
                      frameBorder="0"
                      scrolling="no"
                      allowtransparency="true"
                      className="w-full h-full rounded-xl transition-transform duration-300 group-hover:scale-[1.01] instagram-embed"
                      loading="eager"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Instagram Post 5 */}
            <div className="group relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500" />
              <Card className="relative overflow-hidden rounded-2xl border border-border/20 bg-background/95 backdrop-blur-sm group-hover:border-secondary/30 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-2xl">
                <CardContent className="p-0">
                  <div
                    className="relative overflow-hidden bg-background rounded-xl instagram-container"
                    style={{ height: "500px" }}
                  >
                    <iframe
                      src="https://www.instagram.com/p/DMGnYA-PnYD/embed/?utm_source=ig_embed&ig_rid=null"
                      width="100%"
                      height="500"
                      frameBorder="0"
                      scrolling="no"
                      allowtransparency="true"
                      className="w-full h-full rounded-xl transition-transform duration-300 group-hover:scale-[1.01] instagram-embed"
                      loading="eager"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Instagram Post 6 */}
            <div className="group relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-orange-500 via-purple-500 to-pink-500 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500" />
              <Card className="relative overflow-hidden rounded-2xl border border-border/20 bg-background/95 backdrop-blur-sm group-hover:border-accent/30 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-2xl">
                <CardContent className="p-0">
                  <div
                    className="relative overflow-hidden bg-background rounded-xl instagram-container"
                    style={{ height: "500px" }}
                  >
                    <iframe
                      src="https://www.instagram.com/p/DMBdwi4OLaR/embed/?utm_source=ig_embed&ig_rid=null"
                      width="100%"
                      height="500"
                      frameBorder="0"
                      scrolling="no"
                      allowtransparency="true"
                      className="w-full h-full rounded-xl transition-transform duration-300 group-hover:scale-[1.01] instagram-embed"
                      loading="eager"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-20 sm:mt-24">
            <div className="inline-flex items-center gap-4 sm:gap-6 bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-sm border border-border/50 rounded-full px-6 sm:px-10 py-4 sm:py-6 shadow-xl">
              <div className="flex -space-x-2 sm:-space-x-3">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full border-4 border-background shadow-lg"></div>
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 to-orange-500 rounded-full border-4 border-background shadow-lg"></div>
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full border-4 border-background shadow-lg"></div>
              </div>
              <p className="text-muted-foreground text-base sm:text-lg lg:text-xl">
                <span className="text-foreground font-semibold text-lg sm:text-xl lg:text-2xl">
                  Miles de seguidores
                </span>{" "}
                ya forman parte de la comunidad
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Links Section */}
      <section className="py-20 sm:py-24 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 tracking-tight">
              Conecta Conmigo
            </h2>
            <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto px-4 sm:px-0 leading-relaxed">
              Sígueme en todas las plataformas y mantente al día con mi música
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-4">
            <Button
              variant="outline"
              size="lg"
              className="w-full justify-start h-16 group hover:bg-green-600 hover:text-white transition-all duration-300"
              onClick={() =>
                window.open(
                  "https://open.spotify.com/artist/0S8UiJTjzt86hM9wolenDG",
                  "_blank",
                )
              }
            >
              <Music2 className="mr-4 h-6 w-6 text-green-500 group-hover:text-current transition-colors" />
              <div className="flex-1 text-left">
                <div className="font-semibold">Spotify</div>
                <div className="text-sm opacity-70">
                  Escucha mi música completa
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full justify-start h-16 group hover:bg-gray-600 hover:text-white"
              onClick={() =>
                window.open(
                  "https://music.apple.com/do/artist/hunterx/1458292118",
                  "_blank",
                )
              }
            >
              <Headphones className="mr-4 h-6 w-6 text-gray-500 group-hover:text-current" />
              <div className="flex-1 text-left">
                <div className="font-semibold">Apple Music</div>
                <div className="text-sm opacity-70">
                  Disponible en Apple Music
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full justify-start h-16 group hover:bg-red-600 hover:text-white"
              onClick={() =>
                window.open("https://www.youtube.com/@EHUNTERX", "_blank")
              }
            >
              <Youtube className="mr-4 h-6 w-6 text-red-500 group-hover:text-current" />
              <div className="flex-1 text-left">
                <div className="font-semibold">YouTube - @EHUNTERX</div>
                <div className="text-sm opacity-70">
                  Videos y contenido exclusivo
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full justify-start h-16 group hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white"
              onClick={() =>
                window.open(
                  "https://www.instagram.com/hunterxoficial/",
                  "_blank",
                )
              }
            >
              <Instagram className="mr-4 h-6 w-6 text-pink-500 group-hover:text-current" />
              <div className="flex-1 text-left">
                <div className="font-semibold">Instagram - @hunterxoficial</div>
                <div className="text-sm opacity-70">
                  Detrás de cámaras y más
                </div>
              </div>
            </Button>



            <Button
              variant="outline"
              size="lg"
              className="w-full justify-start h-16 group hover:bg-primary hover:text-primary-foreground"
              onClick={() => {
                console.log("Share button clicked!", {
                  isMobile,
                  hasWebShare: "share" in navigator,
                });
                // En móviles con Web Share API, usar función nativa
                if (isMobile && "share" in navigator) {
                  console.log("Using mobile Web Share API");
                  handleMobileShare();
                } else {
                  // En PC, abrir modal
                  console.log("Opening modal on PC");
                  setIsShareModalOpen(true);
                }
              }}
            >
              <Share2 className="mr-4 h-6 w-6 group-hover:text-current" />
              <div className="flex-1 text-left">
                <div className="font-semibold">Compartir</div>
                <div className="text-sm opacity-70">
                  Comparte mi música con otros
                </div>
              </div>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">HUNTERX</h3>
            <p className="text-muted-foreground mb-6">
              Llevando el mensaje de Cristo a través de la música urbana
            </p>
            <p className="text-sm text-muted-foreground">
              © 2024 HUNTERX. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* MODAL DE COMPARTIR FUNCIONAL - SOLO EN DESKTOP */}
      {isShareModalOpen && !isMobile && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            backgroundColor: "rgba(0,0,0,0.80)",
            zIndex: 99999,
            padding: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: `${window.scrollY + window.innerHeight * 0.2}px`,
            paddingBottom: `${window.innerHeight * 0.2}px`,
            alignItems: "flex-start",
          }}
          onClick={(e) => {
            // Cerrar modal si se hace clic en el fondo
            if (e.target === e.currentTarget) {
              setIsShareModalOpen(false);
            }
          }}
        >
          <div
            style={{
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "16px",
              padding: "28px",
              maxWidth: "420px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
              color: "hsl(var(--foreground))",
              position: "relative",
              animation: "modalFadeIn 0.2s ease-out",
            }}
          >
            {/* Header */}
            <div style={{ marginBottom: "20px", textAlign: "center" }}>
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  marginBottom: "8px",
                  background:
                    "linear-gradient(to right, hsl(var(--primary)), hsl(var(--secondary)))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Compartir HUNTERX
              </h2>
              <p
                style={{
                  color: "hsl(var(--muted-foreground))",
                  fontSize: "14px",
                }}
              >
                Comparte mi música con tus amigos y familiares
              </p>
            </div>

            {/* Botón Copiar Enlace */}
            <div style={{ marginBottom: "20px" }}>
              <button
                onClick={copyToClipboard}
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: copySuccess
                    ? "#22c55e"
                    : "hsl(var(--primary))",
                  color: copySuccess
                    ? "white"
                    : "hsl(var(--primary-foreground))",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                {copySuccess ? (
                  <>
                    <Check className="h-4 w-4" />
                    ¡Enlace copiado!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copiar enlace
                  </>
                )}
              </button>
            </div>

            {/* Redes Sociales */}
            <div style={{ marginBottom: "20px" }}>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "12px",
                  color: "hsl(var(--foreground))",
                }}
              >
                Compartir en redes sociales
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px",
                }}
              >
                <button
                  onClick={() => shareToSocial("twitter")}
                  style={{
                    padding: "10px",
                    backgroundColor: "transparent",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                    fontSize: "12px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    color: "hsl(var(--foreground))",
                  }}
                >
                  <X className="w-3 h-3" />
                  Twitter
                </button>
                <button
                  onClick={() => shareToSocial("facebook")}
                  style={{
                    padding: "10px",
                    backgroundColor: "transparent",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                    fontSize: "12px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    color: "hsl(var(--foreground))",
                  }}
                >
                  Facebook
                </button>
                <button
                  onClick={() => shareToSocial("whatsapp")}
                  style={{
                    padding: "10px",
                    backgroundColor: "transparent",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                    fontSize: "12px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    color: "hsl(var(--foreground))",
                  }}
                >
                  WhatsApp
                </button>
                <button
                  onClick={() => shareToSocial("telegram")}
                  style={{
                    padding: "10px",
                    backgroundColor: "transparent",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                    fontSize: "12px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    color: "hsl(var(--foreground))",
                  }}
                >
                  Telegram
                </button>
              </div>
            </div>

            {/* Botón Cerrar */}
            <button
              onClick={() => setIsShareModalOpen(false)}
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "transparent",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
                fontSize: "14px",
                cursor: "pointer",
                color: "hsl(var(--muted-foreground))",
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
