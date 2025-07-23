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
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold mb-4 sm:mb-6 lg:mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent leading-tight tracking-tight">
                HUNTERX
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl text-muted-foreground mb-8 sm:mb-10 lg:mb-12 max-w-3xl leading-relaxed px-4">
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
            <h2 className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
              Últimos Videos
            </h2>
            <p className="text-muted-foreground text-lg sm:text-xl lg:text-2xl max-w-4xl mx-auto px-4 sm:px-0 leading-relaxed">
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
            <div className="inline-flex items-center gap-3 sm:gap-4 mb-8">
              <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl">
                <Instagram className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 bg-clip-text text-transparent tracking-tight">
                Instagram
              </h2>
            </div>
            <p className="text-muted-foreground text-xl sm:text-2xl lg:text-3xl max-w-4xl mx-auto mb-8 sm:mb-12 px-4 sm:px-0 leading-relaxed">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 max-w-8xl mx-auto">
            {/* Instagram Post 1 */}
            <div className="group relative">
              <div className="absolute -inset-3 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500" />
              <Card className="relative overflow-hidden rounded-2xl border border-border/20 bg-background/95 backdrop-blur-sm group-hover:border-primary/30 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-2xl">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden bg-background">
                    <iframe
                      src="https://www.instagram.com/p/DL5CtHzt0Zd/embed/captioned/?cr=1&v=14&wp=540&rd=https%3A%2F%2Fbuilder.io&rp=%2F#%7B%22ci%22%3A0%2C%22os%22%3A780%7D"
                      width="100%"
                      height="640"
                      frameBorder="0"
                      scrolling="no"
                      allowTransparency
                      className="w-full transition-transform duration-300 group-hover:scale-[1.01]"
                      loading="lazy"
                      style={{
                        filter: "brightness(1.1) contrast(1.05)",
                        aspectRatio: "1/1"
                      }}
                    />
                    <style jsx>{`
                      iframe {
                        border-radius: 16px;
                      }
                      iframe::-webkit-scrollbar {
                        display: none;
                      }
                    `}</style>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Instagram Post 2 */}
            <div className="group relative">
              <div className="absolute -inset-3 bg-gradient-to-r from-purple-500 via-orange-500 to-pink-500 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500" />
              <Card className="relative overflow-hidden rounded-2xl border border-border/20 bg-background/95 backdrop-blur-sm group-hover:border-secondary/30 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-2xl">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden bg-background">
                    <iframe
                      src="https://www.instagram.com/p/DL5yywlOrvk/embed/captioned/?cr=1&v=14&wp=540&rd=https%3A%2F%2Fbuilder.io&rp=%2F#%7B%22ci%22%3A0%2C%22os%22%3A780%7D"
                      width="100%"
                      height="640"
                      frameBorder="0"
                      scrolling="no"
                      allowTransparency
                      className="w-full transition-transform duration-300 group-hover:scale-[1.01]"
                      loading="lazy"
                      style={{
                        filter: "brightness(1.1) contrast(1.05)",
                        aspectRatio: "1/1"
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Instagram Post 3 */}
            <div className="group relative">
              <div className="absolute -inset-3 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500" />
              <Card className="relative overflow-hidden rounded-2xl border border-border/20 bg-background/95 backdrop-blur-sm group-hover:border-accent/30 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-2xl">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden bg-background">
                    <iframe
                      src="https://www.instagram.com/p/DCzzvj0vzTv/embed/captioned/?cr=1&v=14&wp=540&rd=https%3A%2F%2Fbuilder.io&rp=%2F#%7B%22ci%22%3A0%2C%22os%22%3A780%7D"
                      width="100%"
                      height="640"
                      frameBorder="0"
                      scrolling="no"
                      allowTransparency
                      className="w-full transition-transform duration-300 group-hover:scale-[1.01]"
                      loading="lazy"
                      style={{
                        filter: "brightness(1.1) contrast(1.05)",
                        aspectRatio: "1/1"
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Instagram Post 4 */}
            <div className="group relative">
              <div className="absolute -inset-3 bg-gradient-to-r from-pink-500 via-orange-500 to-purple-500 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500" />
              <Card className="relative overflow-hidden rounded-2xl border border-border/20 bg-background/95 backdrop-blur-sm group-hover:border-primary/30 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-2xl">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden bg-background">
                    <iframe
                      src="https://www.instagram.com/p/DMNv9T8tjAC/embed/captioned/?cr=1&v=14&wp=540&rd=https%3A%2F%2Fbuilder.io&rp=%2F#%7B%22ci%22%3A0%2C%22os%22%3A780%7D"
                      width="100%"
                      height="640"
                      frameBorder="0"
                      scrolling="no"
                      allowTransparency
                      className="w-full transition-transform duration-300 group-hover:scale-[1.01]"
                      loading="lazy"
                      style={{
                        filter: "brightness(1.1) contrast(1.05)",
                        aspectRatio: "1/1"
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Instagram Post 5 */}
            <div className="group relative">
              <div className="absolute -inset-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500" />
              <Card className="relative overflow-hidden rounded-2xl border border-border/20 bg-background/95 backdrop-blur-sm group-hover:border-secondary/30 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-2xl">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden bg-background">
                    <iframe
                      src="https://www.instagram.com/p/DMGnYA-PnYD/embed/captioned/?cr=1&v=14&wp=540&rd=https%3A%2F%2Fbuilder.io&rp=%2F#%7B%22ci%22%3A0%2C%22os%22%3A780%7D"
                      width="100%"
                      height="640"
                      frameBorder="0"
                      scrolling="no"
                      allowTransparency
                      className="w-full transition-transform duration-300 group-hover:scale-[1.01]"
                      loading="lazy"
                      style={{
                        filter: "brightness(1.1) contrast(1.05)",
                        aspectRatio: "1/1"
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Instagram Post 6 */}
            <div className="group relative">
              <div className="absolute -inset-3 bg-gradient-to-r from-orange-500 via-purple-500 to-pink-500 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500" />
              <Card className="relative overflow-hidden rounded-2xl border border-border/20 bg-background/95 backdrop-blur-sm group-hover:border-accent/30 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-2xl">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden bg-background">
                    <iframe
                      src="https://www.instagram.com/p/DMBdwi4OLaR/embed/captioned/?cr=1&v=14&wp=540&rd=https%3A%2F%2Fbuilder.io&rp=%2F#%7B%22ci%22%3A0%2C%22os%22%3A780%7D"
                      width="100%"
                      height="640"
                      frameBorder="0"
                      scrolling="no"
                      allowTransparency
                      className="w-full transition-transform duration-300 group-hover:scale-[1.01]"
                      loading="lazy"
                      style={{
                        filter: "brightness(1.1) contrast(1.05)",
                        aspectRatio: "1/1"
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
            <h2 className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-bold mb-6 sm:mb-8 tracking-tight">
              Conecta Conmigo
            </h2>
            <p className="text-muted-foreground text-xl sm:text-2xl lg:text-3xl max-w-4xl mx-auto px-4 sm:px-0 leading-relaxed">
              Sígueme en todas las plataformas y mantente al día con mi música
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
            <Button
              variant="outline"
              size="lg"
              className="w-full justify-start h-20 sm:h-24 group hover:bg-green-600 hover:text-white transition-all duration-300 border-2 hover:border-green-600 hover:shadow-xl"
              onClick={() => alert('Busca "HUNTERX" en Spotify')}
            >
              <Music2 className="mr-6 h-8 w-8 sm:h-10 sm:w-10 text-green-500 group-hover:text-current transition-colors" />
              <div className="flex-1 text-left">
                <div className="font-bold text-lg sm:text-xl lg:text-2xl">Spotify</div>
                <div className="text-base sm:text-lg opacity-70">
                  Escucha mi música completa
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full justify-start h-20 sm:h-24 group hover:bg-gray-600 hover:text-white transition-all duration-300 border-2 hover:border-gray-600 hover:shadow-xl"
              onClick={() => alert('Busca "HUNTERX" en Apple Music')}
            >
              <Headphones className="mr-6 h-8 w-8 sm:h-10 sm:w-10 text-gray-500 group-hover:text-current transition-colors" />
              <div className="flex-1 text-left">
                <div className="font-bold text-lg sm:text-xl lg:text-2xl">Apple Music</div>
                <div className="text-base sm:text-lg opacity-70">
                  Disponible en Apple Music
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full justify-start h-20 sm:h-24 group hover:bg-red-600 hover:text-white transition-all duration-300 border-2 hover:border-red-600 hover:shadow-xl"
              onClick={() =>
                window.open("https://www.youtube.com/@EHUNTERX", "_blank")
              }
            >
              <Youtube className="mr-6 h-8 w-8 sm:h-10 sm:w-10 text-red-500 group-hover:text-current transition-colors" />
              <div className="flex-1 text-left">
                <div className="font-bold text-lg sm:text-xl lg:text-2xl">YouTube - @EHUNTERX</div>
                <div className="text-base sm:text-lg opacity-70">
                  Videos y contenido exclusivo
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full justify-start h-20 sm:h-24 group hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white transition-all duration-300 border-2 hover:border-pink-500 hover:shadow-xl"
              onClick={() =>
                window.open(
                  "https://www.instagram.com/hunterxoficial/",
                  "_blank",
                )
              }
            >
              <Instagram className="mr-6 h-8 w-8 sm:h-10 sm:w-10 text-pink-500 group-hover:text-current transition-colors" />
              <div className="flex-1 text-left">
                <div className="font-bold text-lg sm:text-xl lg:text-2xl">Instagram - @hunterxoficial</div>
                <div className="text-base sm:text-lg opacity-70">
                  Detrás de cámaras y más
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full justify-start h-20 sm:h-24 group hover:bg-primary hover:text-primary-foreground transition-all duration-300 border-2 hover:border-primary hover:shadow-xl"
            >
              <Share2 className="mr-6 h-8 w-8 sm:h-10 sm:w-10 group-hover:text-current transition-colors" />
              <div className="flex-1 text-left">
                <div className="font-bold text-lg sm:text-xl lg:text-2xl">Compartir</div>
                <div className="text-base sm:text-lg opacity-70">
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
