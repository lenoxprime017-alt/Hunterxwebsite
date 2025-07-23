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
            {/* Main Featured Video */}
            <Card className="md:col-span-2 overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
              <CardContent className="p-0">
                <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-secondary/20">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-primary/90 backdrop-blur-sm rounded-full p-6 group-hover:scale-110 transition-transform cursor-pointer">
                      <Play className="w-12 h-12 text-primary-foreground fill-current" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <h3 className="text-xl font-bold text-white mb-2">Nuevo Single: "Fe Inquebrantable"</h3>
                    <p className="text-gray-200">El himno que está moviendo corazones en toda Latinoamérica</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Secondary Videos */}
            <Card className="overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
              <CardContent className="p-0">
                <div className="relative aspect-video bg-gradient-to-br from-secondary/20 to-accent/20">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-secondary/90 backdrop-blur-sm rounded-full p-4 group-hover:scale-110 transition-transform cursor-pointer">
                      <Play className="w-8 h-8 text-secondary-foreground fill-current" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <h4 className="text-lg font-bold text-white mb-1">Testimonio</h4>
                    <p className="text-gray-200 text-sm">Mi historia de transformación</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
              <CardContent className="p-0">
                <div className="relative aspect-video bg-gradient-to-br from-accent/20 to-primary/20">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-accent/90 backdrop-blur-sm rounded-full p-4 group-hover:scale-110 transition-transform cursor-pointer">
                      <Play className="w-8 h-8 text-accent-foreground fill-current" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <h4 className="text-lg font-bold text-white mb-1">Live Session</h4>
                    <p className="text-gray-200 text-sm">Acústico desde el estudio</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-16 lg:py-24 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
              Proyectos
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Cada proyecto es una oportunidad de llevar luz a través de la música
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="group hover:scale-[1.02] transition-all duration-300 overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-square bg-gradient-to-br from-primary to-secondary relative">
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">Álbum: Renacimiento</h3>
                    <p className="text-gray-200">12 tracks de pura inspiración</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:scale-[1.02] transition-all duration-300 overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-square bg-gradient-to-br from-secondary to-accent relative">
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">EP: Esperanza</h3>
                    <p className="text-gray-200">5 canciones de fe y esperanza</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:scale-[1.02] transition-all duration-300 overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-square bg-gradient-to-br from-accent to-primary relative">
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">Colaboraciones</h3>
                    <p className="text-gray-200">Uniendo voces por Cristo</p>
                  </div>
                </div>
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
            <Button variant="outline" size="lg" className="w-full justify-start h-16 group hover:bg-primary hover:text-primary-foreground">
              <Music2 className="mr-4 h-6 w-6 text-green-500 group-hover:text-current" />
              <div className="flex-1 text-left">
                <div className="font-semibold">Spotify</div>
                <div className="text-sm opacity-70">Escucha mi música completa</div>
              </div>
            </Button>

            <Button variant="outline" size="lg" className="w-full justify-start h-16 group hover:bg-primary hover:text-primary-foreground">
              <Headphones className="mr-4 h-6 w-6 text-gray-500 group-hover:text-current" />
              <div className="flex-1 text-left">
                <div className="font-semibold">Apple Music</div>
                <div className="text-sm opacity-70">Disponible en Apple Music</div>
              </div>
            </Button>

            <Button variant="outline" size="lg" className="w-full justify-start h-16 group hover:bg-red-600 hover:text-white">
              <Youtube className="mr-4 h-6 w-6 text-red-500 group-hover:text-current" />
              <div className="flex-1 text-left">
                <div className="font-semibold">YouTube</div>
                <div className="text-sm opacity-70">Videos y contenido exclusivo</div>
              </div>
            </Button>

            <Button variant="outline" size="lg" className="w-full justify-start h-16 group hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white">
              <Instagram className="mr-4 h-6 w-6 text-pink-500 group-hover:text-current" />
              <div className="flex-1 text-left">
                <div className="font-semibold">Instagram</div>
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
