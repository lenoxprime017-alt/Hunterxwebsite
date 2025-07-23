import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  const [copySuccess, setCopySuccess] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

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

  const handleMobileShare = async () => {
    const shareData = {
      title: "HUNTERX - Música Urbana Cristiana",
      text: "Descubre la música urbana con propósito de HUNTERX. Llevando esperanza y fe a las calles.",
      url: window.location.href,
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
        document.removeEventListener("visibilitychange", handleVisibilityChange);
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
    const urlToCopy =
      typeof window !== "undefined"
        ? window.location.href
        : "https://hunterx.fly.dev";
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
    const url = encodeURIComponent(window.location.href);
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

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10"
      translate="no"
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden h-screen">
        <video
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            videoLoaded ? "opacity-100" : "opacity-0"
          }`}
          src="https://cdn.builder.io/o/assets%2Fe5efb23401dd4b95852e27b8d0f225c2%2Fd7b18dfa4be248398d8497372bca2951?alt=media&token=221edc24-6aaf-43e9-a04e-41dcfa15d339&apiKey=e5efb23401dd4b95852e27b8d0f225c2"
          autoPlay
          loop
          muted={true}
          playsInline
          preload="auto"
          onLoadStart={handleVideoLoad}
          onLoadedData={handleVideoLoad}
          poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect width='100%25' height='100%25' fill='%23111827'/%3E%3C/svg%3E"
        />
        {!videoLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
            <div className="animate-pulse text-primary text-lg font-medium">
              Cargando...
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
                calles través de letras que transforman vidas.
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
                <div className="relative aspect-video">
                  <iframe
                    className="w-full h-full rounded-lg"
                    src="https://www.youtube.com/embed/4kHW5ZkYHIQ?rel=0&showinfo=0&modestbranding=1&iv_load_policy=3&fs=1&cc_load_policy=0&disablekb=0&autohide=1&enablejsapi=1&origin=https://hunterx.fly.dev"
                    title="HUNTERX - Última Canción"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                    importance="high"
                  />
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
                      src="https://www.youtube.com/embed/JTwL53RpQls?rel=0&showinfo=0&modestbranding=1&iv_load_policy=3&fs=1&cc_load_policy=0&disablekb=0&autohide=1&enablejsapi=1&origin=https://hunterx.fly.dev"
                      title="HUNTERX - Video 2"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden group hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl">
                <CardContent className="p-0">
                  <div className="relative aspect-video">
                    <iframe
                      className="w-full h-full rounded-lg"
                      src="https://www.youtube.com/embed/BzivzcIRpOM?rel=0&showinfo=0&modestbranding=1&iv_load_policy=3&fs=1&cc_load_policy=0&disablekb=0&autohide=1&enablejsapi=1&origin=https://hunterx.fly.dev"
                      title="HUNTERX - Video 3"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden group hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl md:col-span-2 xl:col-span-1">
                <CardContent className="p-0">
                  <div className="relative aspect-video">
                    <iframe
                      className="w-full h-full rounded-lg"
                      src="https://www.youtube.com/embed/tsPldB4iXpE?rel=0&showinfo=0&modestbranding=1&iv_load_policy=3&fs=1&cc_load_policy=0&disablekb=0&autohide=1&enablejsapi=1&origin=https://hunterx.fly.dev"
                      title="HUNTERX - Video 4"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      loading="lazy"
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
                      allowTransparency
                      className="w-full h-full rounded-xl transition-transform duration-300 group-hover:scale-[1.01] instagram-embed"
                      loading="lazy"
                      importance="low"
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
                      allowTransparency
                      className="w-full h-full rounded-xl transition-transform duration-300 group-hover:scale-[1.01] instagram-embed"
                      loading="lazy"
                      importance="low"
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
                      allowTransparency
                      className="w-full h-full rounded-xl transition-transform duration-300 group-hover:scale-[1.01] instagram-embed"
                      loading="lazy"
                      importance="low"
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
                      allowTransparency
                      className="w-full h-full rounded-xl transition-transform duration-300 group-hover:scale-[1.01] instagram-embed"
                      loading="lazy"
                      importance="low"
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
                      allowTransparency
                      className="w-full h-full rounded-xl transition-transform duration-300 group-hover:scale-[1.01] instagram-embed"
                      loading="lazy"
                      importance="low"
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
                      allowTransparency
                      className="w-full h-full rounded-xl transition-transform duration-300 group-hover:scale-[1.01] instagram-embed"
                      loading="lazy"
                      importance="low"
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
                // En móviles con Web Share API, usar función nativa
                if (isMobile && "share" in navigator) {
                  handleMobileShare();
                } else {
                  // En PC, abrir modal
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

            <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
              <DialogContent
                className={`sm:max-w-[460px] max-w-[95vw] border border-border/30 shadow-3xl rounded-2xl ${
                  isMobile
                    ? "bg-background border-border"
                    : "bg-gradient-to-br from-card/95 via-background/95 to-card/95 backdrop-blur-xl"
                }`}
              >
                {/* Efectos de fondo decorativos - solo en desktop */}
                {!isMobile && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-2xl blur-sm opacity-75"></div>
                )}
                <div className="relative">
                  <DialogHeader className="space-y-4 pb-6">
                    <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      Compartir HUNTERX
                    </DialogTitle>
                    <p className="text-center text-muted-foreground text-sm">
                      Comparte mi música con tus amigos y familiares
                    </p>
                  </DialogHeader>

                  <div className="space-y-6">
                    {/* Copiar enlace */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <Copy className="h-4 w-4 text-primary" />
                        Copiar enlace
                      </h3>
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex-1 p-3 bg-muted/50 border border-border/50 rounded-xl text-xs font-mono text-foreground/80 truncate ${
                            !isMobile ? "backdrop-blur-sm" : ""
                          }`}
                        >
                          hunterx.fly.dev
                        </div>
                        <Button
                          size="sm"
                          onClick={copyToClipboard}
                          className={`shrink-0 transition-all duration-300 ${
                            copySuccess
                              ? "bg-green-500 hover:bg-green-600 text-white shadow-lg"
                              : "bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-lg hover:shadow-xl"
                          }`}
                        >
                          {copySuccess ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      {copySuccess && (
                        <p className="text-xs text-green-500 font-medium flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                          <Check className="h-3 w-3" />
                          ¡Enlace copiado al portapapeles!
                        </p>
                      )}
                    </div>

                    {/* Compartir en redes sociales */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <Share2 className="h-4 w-4 text-secondary" />
                        Compartir en redes sociales
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          variant="outline"
                          onClick={() => shareToSocial("twitter")}
                          className={`group flex items-center justify-center gap-2 h-12 bg-card/50 border-border/50 hover:bg-blue-500/10 hover:border-blue-500/50 hover:text-blue-400 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
                            !isMobile ? "backdrop-blur-sm" : ""
                          }`}
                        >
                          <X className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          <span className="font-medium text-sm">Twitter</span>
                        </Button>

                        <Button
                          variant="outline"
                          onClick={() => shareToSocial("facebook")}
                          className={`group flex items-center justify-center gap-2 h-12 bg-card/50 border-border/50 hover:bg-blue-600/10 hover:border-blue-600/50 hover:text-blue-300 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
                            !isMobile ? "backdrop-blur-sm" : ""
                          }`}
                        >
                          <svg
                            className="w-4 h-4 group-hover:scale-110 transition-transform"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                          <span className="font-medium text-sm">Facebook</span>
                        </Button>

                        <Button
                          variant="outline"
                          onClick={() => shareToSocial("whatsapp")}
                          className={`group flex items-center justify-center gap-2 h-12 bg-card/50 border-border/50 hover:bg-green-500/10 hover:border-green-500/50 hover:text-green-400 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
                            !isMobile ? "backdrop-blur-sm" : ""
                          }`}
                        >
                          <svg
                            className="w-4 h-4 group-hover:scale-110 transition-transform"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                          </svg>
                          <span className="font-medium text-sm">WhatsApp</span>
                        </Button>

                        <Button
                          variant="outline"
                          onClick={() => shareToSocial("telegram")}
                          className={`group flex items-center justify-center gap-2 h-12 bg-card/50 border-border/50 hover:bg-blue-400/10 hover:border-blue-400/50 hover:text-blue-400 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
                            !isMobile ? "backdrop-blur-sm" : ""
                          }`}
                        >
                          <svg
                            className="w-4 h-4 group-hover:scale-110 transition-transform"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                          </svg>
                          <span className="font-medium text-sm">Telegram</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
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
    </div>
  );
}
