import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, MessageCircle, BookA, Music, Video, ListTodo } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import { useApprenticeStars } from "@/hooks/useApprenticeStars";
import { SettingsDrawer } from "@/components/SettingsDrawer";

const features = [
  {
    id: "communication",
    name: "Comunicação",
    icon: MessageCircle,
    color: "bg-gradient-primary",
    description: "Aprenda a se expressar",
    path: "/communication",
  },
  {
    id: "activities",
    name: "Atividades",
    icon: ListTodo,
    color: "bg-gradient-accent",
    description: "Quizzes e jogos",
    path: "/activities",
  },
  {
    id: "tasks",
    name: "Tarefas",
    icon: BookOpen,
    color: "bg-gradient-secondary",
    description: "Organize seu dia",
    path: "/tasks",
  },
  {
    id: "dictionary",
    name: "Dicionário",
    icon: BookA,
    color: "bg-gradient-success",
    description: "Explore palavras",
    path: "/dictionary",
  },
];

const Home = () => {
  const { animationsEnabled } = useSettings();
  const { session } = useApprenticeStars();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12 animate-bounce-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Olá, {session?.name || 'Aprendiz'}! O que vamos fazer?
          </h1>
          <p className="text-xl text-muted-foreground">Escolha uma das atividades abaixo para começar</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Link key={feature.id} to={feature.path} className="group" style={{ animationDelay: `${index * 0.1}s` }}>
                <Card className={`h-full border-2 hover:border-primary transition-all duration-300 bg-card/80 backdrop-blur-sm ${
                  animationsEnabled ? 'hover:shadow-colored hover:scale-105 animate-bounce-in' : ''
                }`}>
                  <CardContent className="p-8 flex flex-col items-center text-center gap-4">
                    <div
                      className={`w-24 h-24 rounded-3xl ${feature.color} flex items-center justify-center shadow-soft ${
                        animationsEnabled ? 'group-hover:animate-float' : ''
                      }`}
                    >
                      <Icon className="w-12 h-12 text-white" strokeWidth={2.5} />
                    </div>
                    <h2 className="text-3xl font-bold text-foreground">{feature.name}</h2>
                    <p className="text-muted-foreground text-lg">{feature.description}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
      <SettingsDrawer />
    </div>
  );
};

export default Home;

