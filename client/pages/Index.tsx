import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Music, Heart, Share2, Instagram, Youtube, Music2, Headphones } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-50" />
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <Badge variant="secondary" className="mb-4 text-sm font-semibold">
                Música Urbana Cristiana
              </Badge>
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                HUNTERX
              </h1>
              <p className="text-xl lg:text-2xl text-muted-foreground mb-8 max-w-lg">
                Música urbana con propósito. Llevando esperanza y fe a las calles través de letras que transforman vidas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="group">
                  <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Escuchar Ahora
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="mr-2 h-5 w-5" />
                  Seguir
                </Button>
              </div>
            </div>
            <div className="flex-1 max-w-md">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary to-secondary rounded-full opacity-30 blur-xl animate-pulse" />
                <div className="relative bg-card border-2 border-primary/30 rounded-full aspect-square flex items-center justify-center">
                  <div className="w-3/4 h-3/4 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                    <Music className="w-16 h-16 text-primary-foreground" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Video Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
              Últimos Videos
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Descubre la música que está impactando vidas y llevando esperanza
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Main Featured Video - Latest Song */}
            <Card className="md:col-span-2 overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
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

            {/* Secondary Videos */}
            <Card className="overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
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

            <Card className="overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
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
          </div>

          {/* Fourth Video - Additional Row */}
          <div className="mt-8 max-w-3xl mx-auto">
            <Card className="overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
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
      </section>

      {/* Instagram Posts Section */}
      <section className="py-16 lg:py-24 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
              Últimas Publicaciones
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Sígueme en Instagram @hunterxoficial para más contenido exclusivo
            </p>
            <Button
              variant="outline"
              className="mt-4 group hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white"
              onClick={() => window.open('https://www.instagram.com/hunterxoficial/', '_blank')}
            >
              <Instagram className="mr-2 h-5 w-5 text-pink-500 group-hover:text-current" />
              Ver en Instagram
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Instagram Post 1 */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <iframe
                  src="https://www.instagram.com/p/DL5CtHzt0Zd/embed/"
                  width="100%"
                  height="500"
                  frameBorder="0"
                  scrolling="no"
                  allowTransparency
                  className="w-full"
                />
              </CardContent>
            </Card>

            {/* Instagram Post 2 */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <iframe
                  src="https://www.instagram.com/p/DL5yywlOrvk/embed/"
                  width="100%"
                  height="500"
                  frameBorder="0"
                  scrolling="no"
                  allowTransparency
                  className="w-full"
                />
              </CardContent>
            </Card>

            {/* Instagram Post 3 */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <iframe
                  src="https://www.instagram.com/p/DCzzvj0vzTv/embed/"
                  width="100%"
                  height="500"
                  frameBorder="0"
                  scrolling="no"
                  allowTransparency
                  className="w-full"
                />
              </CardContent>
            </Card>

            {/* Instagram Post 4 */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <iframe
                  src="https://www.instagram.com/p/DMNv9T8tjAC/embed/"
                  width="100%"
                  height="500"
                  frameBorder="0"
                  scrolling="no"
                  allowTransparency
                  className="w-full"
                />
              </CardContent>
            </Card>

            {/* Instagram Post 5 */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <iframe
                  src="https://www.instagram.com/p/DMGnYA-PnYD/embed/"
                  width="100%"
                  height="500"
                  frameBorder="0"
                  scrolling="no"
                  allowTransparency
                  className="w-full"
                />
              </CardContent>
            </Card>

            {/* Instagram Post 6 */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <iframe
                  src="https://www.instagram.com/p/DMBdwi4OLaR/embed/"
                  width="100%"
                  height="500"
                  frameBorder="0"
                  scrolling="no"
                  allowTransparency
                  className="w-full"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Links Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
              Conecta Conmigo
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Sígueme en todas las plataformas y mantente al día con mi música
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-4">
            <Button
              variant="outline"
              size="lg"
              className="w-full justify-start h-16 group hover:bg-green-600 hover:text-white"
              onClick={() => alert('Busca "HUNTERX" en Spotify')}
            >
              <Music2 className="mr-4 h-6 w-6 text-green-500 group-hover:text-current" />
              <div className="flex-1 text-left">
                <div className="font-semibold">Spotify</div>
                <div className="text-sm opacity-70">Escucha mi música completa</div>
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
                <div className="text-sm opacity-70">Disponible en Apple Music</div>
              </div>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full justify-start h-16 group hover:bg-red-600 hover:text-white"
              onClick={() => window.open('https://www.youtube.com/@EHUNTERX', '_blank')}
            >
              <Youtube className="mr-4 h-6 w-6 text-red-500 group-hover:text-current" />
              <div className="flex-1 text-left">
                <div className="font-semibold">YouTube - @EHUNTERX</div>
                <div className="text-sm opacity-70">Videos y contenido exclusivo</div>
              </div>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full justify-start h-16 group hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white"
              onClick={() => window.open('https://www.instagram.com/hunterxoficial/', '_blank')}
            >
              <Instagram className="mr-4 h-6 w-6 text-pink-500 group-hover:text-current" />
              <div className="flex-1 text-left">
                <div className="font-semibold">Instagram - @hunterxoficial</div>
                <div className="text-sm opacity-70">Detrás de cámaras y más</div>
              </div>
            </Button>

            <Button variant="outline" size="lg" className="w-full justify-start h-16 group hover:bg-primary hover:text-primary-foreground">
              <Share2 className="mr-4 h-6 w-6 group-hover:text-current" />
              <div className="flex-1 text-left">
                <div className="font-semibold">Compartir</div>
                <div className="text-sm opacity-70">Comparte mi música con otros</div>
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
