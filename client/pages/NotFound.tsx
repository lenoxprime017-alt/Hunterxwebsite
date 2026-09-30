import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <div className="glow-orb left-1/2 top-1/2 h-[40vmax] w-[40vmax] -translate-x-1/2 -translate-y-1/2 opacity-30" />
      <div className="text-center">
        <h1 className="font-display text-[10rem] leading-none text-gold sm:text-[14rem]">
          404
        </h1>
        <p className="mb-8 mt-2 text-lg text-muted-foreground">
          Esta página no existe o fue movida.
        </p>
        <a href="/" className="btn-primary">
          <ArrowLeft className="h-5 w-5" />
          Volver al inicio
        </a>
      </div>
    </div>
  );
};

export default NotFound;
