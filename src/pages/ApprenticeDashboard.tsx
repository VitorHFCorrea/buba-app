import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut } from "lucide-react";
import BackButton from "@/components/BackButton";
import { SettingsDrawer } from "@/components/SettingsDrawer";

interface ApprenticeSession {
  apprentice_id: string;
  name: string;
  tutor_id: string;
  logged_in_at: string;
}

const ApprenticeDashboard = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<ApprenticeSession | null>(null);

  useEffect(() => {
    const sessionData = localStorage.getItem('apprentice_session');
    
    if (!sessionData) {
      navigate('/apprentice-login');
      return;
    }

    const parsedSession = JSON.parse(sessionData) as ApprenticeSession;
    setSession(parsedSession);

    // logout automático após 30 minutos inativo
    const timeout = setTimeout(() => {
      handleLogout();
    }, 30 * 60 * 1000);

    return () => clearTimeout(timeout);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('apprentice_session');
    navigate('/apprentice-login');
  };

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex justify-between items-center gap-2">
          <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
            <BackButton to="/home" />
            <h1 className="text-base sm:text-xl md:text-2xl font-bold truncate">Olá, {session.name}! 👋</h1>
          </div>
          <Button variant="outline" onClick={handleLogout} size="sm" className="shrink-0">
            <LogOut className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
            <span className="hidden sm:inline">Sair</span>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/dictionary')}>
            <CardHeader>
              <CardTitle>📚 Dicionário</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Aprenda palavras novas com símbolos</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/activities')}>
            <CardHeader>
              <CardTitle>🎨 Atividades</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Jogos e atividades divertidas</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/communication')}>
            <CardHeader>
              <CardTitle>💬 Comunicação</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Comunique-se usando símbolos</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/tasks')}>
            <CardHeader>
              <CardTitle>✅ Tarefas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Suas tarefas do dia</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/memory')}>
            <CardHeader>
              <CardTitle>🎮 Jogo da Memória</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Teste sua memória</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/quizzes')}>
            <CardHeader>
              <CardTitle>❓ Quiz</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Responda perguntas divertidas</p>
            </CardContent>
          </Card>
        </div>
      </main>
      <SettingsDrawer />
    </div>
  );
};

export default ApprenticeDashboard;