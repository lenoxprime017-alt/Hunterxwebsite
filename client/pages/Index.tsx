import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Music,
  Heart,
  Share2,
  Instagram,
  Youtube,
  Music2,
  Headphones,
} from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      {/* Hero Section */}
      <section className="relative overflow-hidden h-screen">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="https://cdn.builder.io/o/assets%2Fe5efb23401dd4b95852e27b8d0f225c2%2Fd7b18dfa4be248398d8497372bca2951?alt=media&token=221edc24-6aaf-43e9-a04e-41dcfa15d339&apiKey=e5efb23401dd4b95852e27b8d0f225c2"
          autoPlay
          loop
          muted={true}
          playsInline
          volume={0}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
              <Badge variant="secondary" className="mb-4 sm:mb-6 text-xs sm:text-sm font-semibold px-3 py-1">
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
                >
                  <Play className="mr-3 h-5 w-5 sm:h-6 sm:w-6 group-hover:scale-110 transition-transform" />
                  Escuchar Ahora
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto h-14 sm:h-16 text-base sm:text-lg lg:text-xl px-8 sm:px-10"
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
                    src="https://www.youtube.com/embed/4kHW5ZkYHIQ"
                    title="HUNTERX - Última Canción"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
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
                      src="https://www.youtube.com/embed/JTwL53RpQls"
                      title="HUNTERX - Video 2"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden group hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl">
                <CardContent className="p-0">
                  <div className="relative aspect-video">
                    <iframe
                      className="w-full h-full rounded-lg"
                      src="https://www.youtube.com/embed/BzivzcIRpOM"
                      title="HUNTERX - Video 3"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden group hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl md:col-span-2 xl:col-span-1">
                <CardContent className="p-0">
                  <div className="relative aspect-video">
                    <iframe
                      className="w-full h-full rounded-lg"
                      src="https://www.youtube.com/embed/tsPldB4iXpE"
                      title="HUNTERX - Video 4"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
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
              <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 bg-clip-text text-transparent">
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
                  <div className="relative aspect-square overflow-hidden bg-background rounded-xl">
                    <iframe
                      src="https://www.instagram.com/p/DL5CtHzt0Zd/embed/"
                      width="400"
                      height="480"
                      frameBorder="0"
                      scrolling="no"
                      allowTransparency
                      className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-[1.01]"
                      loading="lazy"
                      style={{
                        transform: "scale(1.1) translateY(-30px)",
                        transformOrigin: "center center"
                      }}
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
                  <div className="relative aspect-square overflow-hidden bg-background rounded-xl">
                    <iframe
                      src="https://www.instagram.com/p/DL5yywlOrvk/embed/"
                      width="400"
                      height="480"
                      frameBorder="0"
                      scrolling="no"
                      allowTransparency
                      className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-[1.01]"
                      loading="lazy"
                      style={{
                        transform: "scale(1.1) translateY(-30px)",
                        transformOrigin: "center center"
                      }}
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
                  <div className="relative aspect-square overflow-hidden bg-background rounded-xl">
                    <iframe
                      src="https://www.instagram.com/p/DCzzvj0vzTv/embed/"
                      width="400"
                      height="480"
                      frameBorder="0"
                      scrolling="no"
                      allowTransparency
                      className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-[1.01]"
                      loading="lazy"
                      style={{
                        transform: "scale(1.1) translateY(-30px)",
                        transformOrigin: "center center"
                      }}
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
                  <div className="relative aspect-square overflow-hidden bg-background rounded-xl">
                    <iframe
                      src="https://www.instagram.com/p/DMNv9T8tjAC/embed/"
                      width="400"
                      height="480"
                      frameBorder="0"
                      scrolling="no"
                      allowTransparency
                      className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-[1.01]"
                      loading="lazy"
                      style={{
                        transform: "scale(1.1) translateY(-30px)",
                        transformOrigin: "center center"
                      }}
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
                  <div className="relative aspect-square overflow-hidden bg-background rounded-xl">
                    <iframe
                      src="https://www.instagram.com/p/DMGnYA-PnYD/embed/"
                      width="400"
                      height="480"
                      frameBorder="0"
                      scrolling="no"
                      allowTransparency
                      className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-[1.01]"
                      loading="lazy"
                      style={{
                        transform: "scale(1.1) translateY(-30px)",
                        transformOrigin: "center center"
                      }}
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
                  <div className="relative aspect-square overflow-hidden bg-background rounded-xl">
                    <iframe
                      src="https://www.instagram.com/p/DMBdwi4OLaR/embed/"
                      width="400"
                      height="480"
                      frameBorder="0"
                      scrolling="no"
                      allowTransparency
                      className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-[1.01]"
                      loading="lazy"
                      style={{
                        transform: "scale(1.1) translateY(-30px)",
                        transformOrigin: "center center"
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-20 sm:mt-24">
            <div className="inline-flex items-center gap-6 bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-sm border border-border/50 rounded-full px-10 py-6 shadow-xl">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full border-3 border-background"></div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-orange-500 rounded-full border-3 border-background"></div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full border-3 border-background"></div>
              </div>
              <p className="text-muted-foreground text-lg sm:text-xl">
                <span className="text-foreground font-semibold text-xl sm:text-2xl">
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
              onClick={() => alert('Busca "HUNTERX" en Spotify')}
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
              onClick={() => alert('Busca "HUNTERX" en Apple Music')}
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
    </div>
  );
}
