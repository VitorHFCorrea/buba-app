import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import BackButton from "@/components/BackButton";
import { SettingsDrawer } from "@/components/SettingsDrawer";

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route");
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="text-center max-w-md">
        <BackButton className="mb-6" />
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Página não encontrada</p>
        <Link to="/" className="text-primary underline hover:text-primary/80">
          Retornar para Início
        </Link>
      </div>
      <SettingsDrawer />
    </div>
  );
};

export default NotFound;
