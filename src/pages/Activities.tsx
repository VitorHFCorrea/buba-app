import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Calculator, Lightbulb } from "lucide-react";
import { useApprenticeStars } from "@/hooks/useApprenticeStars";
import StarsDisplay from "@/components/StarsDisplay";
import BackButton from "@/components/BackButton";
import { SettingsDrawer } from "@/components/SettingsDrawer";

const activities = [
  {
    id: "quizzes",
    name: "Quizzes",
    icon: Brain,
    color: "bg-gradient-accent",
    description: "Teste seus conhecimentos",
    path: "/activities/quizzes",
  },
  {
    id: "equations",
    name: "Equações",
    icon: Calculator,
    color: "bg-gradient-primary",
    description: "Problemas de matemática",
    path: "/activities/equations",
  },
  {
    id: "memory",
    name: "Memória",
    icon: Lightbulb,
    color: "bg-gradient-success",
    description: "Jogo de Simon/Genius",
    path: "/activities/memory",
  },
];

const Activities = () => {
  const { stars, loading } = useApprenticeStars();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 animate-bounce-in">
          <div className="flex justify-between items-center mb-6">
            <BackButton to="/home" />
            {!loading && <StarsDisplay stars={stars} />}
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Atividades
          </h1>
          <p className="text-xl text-muted-foreground">
            Escolha uma atividade para começar a praticar
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <Link
                key={activity.id}
                to={activity.path}
                className="group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Card className="h-full border-2 hover:border-primary transition-all duration-300 hover:shadow-colored hover:scale-105 animate-bounce-in bg-card/80 backdrop-blur-sm">
                  <CardContent className="p-8 flex flex-col items-center text-center gap-4">
                    <div
                      className={`w-24 h-24 rounded-3xl ${activity.color} flex items-center justify-center shadow-soft group-hover:animate-float`}
                    >
                      <Icon className="w-12 h-12 text-white" strokeWidth={2.5} />
                    </div>
                    <h2 className="text-3xl font-bold text-foreground">
                      {activity.name}
                    </h2>
                    <p className="text-muted-foreground text-lg">
                      {activity.description}
                    </p>
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

export default Activities;
