import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Type, Hash, Apple, Dog, Palette, Shapes } from "lucide-react";
import BackButton from "@/components/BackButton";
import { SettingsDrawer } from "@/components/SettingsDrawer";

const categories = [
  {
    id: "letters",
    name: "Letras",
    icon: Type,
    color: "bg-gradient-primary",
    description: "Aprenda o alfabeto",
  },
  {
    id: "numbers",
    name: "Números",
    icon: Hash,
    color: "bg-gradient-secondary",
    description: "Conte e aprenda",
  },
  {
    id: "animals",
    name: "Animais",
    icon: Dog,
    color: "bg-gradient-success",
    description: "Conheça os bichinhos",
  },
  {
    id: "objects",
    name: "Objetos",
    icon: Apple,
    color: "bg-gradient-accent",
    description: "Coisas do dia a dia",
  },
  {
    id: "colors",
    name: "Cores",
    icon: Palette,
    color: "bg-gradient-primary",
    description: "Um mundo colorido",
  },
  {
    id: "shapes",
    name: "Formas",
    icon: Shapes,
    color: "bg-gradient-secondary",
    description: "Círculos e quadrados",
  },
];

const Dictionary = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 animate-bounce-in">
          <BackButton to="/home" className="mb-6" />
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center bg-gradient-primary bg-clip-text text-transparent">
            Vamos Aprender!
          </h1>
          <p className="text-xl text-muted-foreground text-center">
            Escolha uma atividade para começar a aventura
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.id}
                to={`/dictionary/${category.id}`}
                className="group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Card className="h-full border-2 hover:border-primary transition-all duration-300 hover:shadow-colored hover:scale-105 animate-bounce-in bg-card/80 backdrop-blur-sm">
                  <CardContent className="p-8 flex flex-col items-center text-center gap-4">
                    <div
                      className={`w-24 h-24 rounded-3xl ${category.color} flex items-center justify-center shadow-soft group-hover:animate-float`}
                    >
                      <Icon className="w-12 h-12 text-white" strokeWidth={2.5} />
                    </div>
                    <h2 className="text-3xl font-bold text-foreground">
                      {category.name}
                    </h2>
                    <p className="text-muted-foreground text-lg">
                      {category.description}
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

export default Dictionary;
