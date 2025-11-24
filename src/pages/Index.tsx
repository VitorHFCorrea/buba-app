import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, ArrowRight, MessageCircle, BookOpen, BookA, Brain, Calculator, Gamepad2, ChevronDown } from "lucide-react";

const features = [
  {
    icon: MessageCircle,
    title: "Comunicação",
    description: "Aprenda a se expressar com pictogramas ARASAAC e desenvolva suas habilidades de comunicação",
    color: "bg-gradient-primary",
  },
  {
    icon: BookA,
    title: "Dicionário Visual",
    description: "Explore letras, números, cores, formas e muito mais com recursos visuais interativos",
    color: "bg-gradient-success",
  },
  {
    icon: BookOpen,
    title: "Tarefas",
    description: "Organize seu dia e suas atividades de forma simples e visual",
    color: "bg-gradient-secondary",
  },
  {
    icon: Brain,
    title: "Jogo da Memória",
    description: "Exercite sua memória com jogos divertidos e educativos",
    color: "bg-gradient-accent",
  },
  {
    icon: Calculator,
    title: "Equações",
    description: "Pratique matemática de forma interativa e divertida",
    color: "bg-gradient-primary",
  },
  {
    icon: Gamepad2,
    title: "Quizzes",
    description: "Teste seus conhecimentos com quizzes personalizados",
    color: "bg-gradient-success",
  },
];

const Index = () => {
  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10"
      data-theme="light"
      data-color-palette="vibrant"
      data-animations="true"
    >
      {/* Hero Section */}
      <section className="relative flex items-center justify-center p-4 min-h-screen">
        <div className="text-center max-w-4xl mx-auto animate-bounce-in">
          <h1 className="text-8xl md:text-9xl font-cherry mb-24 bg-gradient-primary bg-clip-text text-transparent">
            Buba
          </h1>

          <p className="text-lg md:text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Uma plataforma completa para desenvolver as habilidades dos nossos pequenos de forma divertida e acessível!
          </p>

          <Link to="/login">
            <Button
              size="lg"
              className="text-xl px-8 py-6 rounded-full shadow-colored hover:shadow-xl hover:scale-105 transition-all bg-gradient-primary border-0"
            >
              Começar Aventura
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </Link>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center animate-bounce">
          <ChevronDown className="w-8 h-8 text-primary/50" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-bounce-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-secondary bg-clip-text text-transparent">
              Recursos da Plataforma
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ferramentas educativas desenvolvidas para tornar o aprendizado mais acessível e envolvente!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="border-2 hover:border-primary transition-all duration-300 bg-card/80 backdrop-blur-sm hover:shadow-colored hover:scale-105 animate-bounce-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                    <div
                      className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center shadow-soft`}
                    >
                      <Icon className="w-8 h-8 text-white" strokeWidth={2.5} />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center animate-bounce-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-accent bg-clip-text text-transparent">
            Pronto para Começar?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Junte-se a nós e descubra uma nova forma de aprender e se comunicar!
          </p>
          <Link to="/login">
            <Button
              size="lg"
              className="text-xl px-8 py-6 rounded-full shadow-colored hover:shadow-xl hover:scale-105 transition-all bg-gradient-primary border-0"
            >
              Entrar Agora
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
