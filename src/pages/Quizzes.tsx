import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useApprenticeStars } from "@/hooks/useApprenticeStars";
import StarsDisplay from "@/components/StarsDisplay";
import { useToast } from "@/hooks/use-toast";
import BackButton from "@/components/BackButton";
import { SettingsDrawer } from "@/components/SettingsDrawer";

type QuizType = "names" | "letters" | "quantities" | null;

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  image?: string;
}

const questionsData: Record<Exclude<QuizType, null>, Question[]> = {
  names: [
    {
      question: "Que animal é este? 🐶",
      options: ["Gato", "Cachorro", "Pássaro", "Peixe"],
      correctAnswer: "Cachorro",
    },
    {
      question: "Que cor é esta? 🔴",
      options: ["Azul", "Verde", "Vermelho", "Amarelo"],
      correctAnswer: "Vermelho",
    },
    {
      question: "Que forma é esta? ⭐",
      options: ["Círculo", "Quadrado", "Triângulo", "Estrela"],
      correctAnswer: "Estrela",
    },
    {
      question: "Que objeto é este? 🚗",
      options: ["Bicicleta", "Carro", "Avião", "Barco"],
      correctAnswer: "Carro",
    },
    {
      question: "Que animal é este? 🐱",
      options: ["Cachorro", "Coelho", "Gato", "Rato"],
      correctAnswer: "Gato",
    },
    {
      question: "Que cor é esta? 🔵",
      options: ["Azul", "Verde", "Vermelho", "Rosa"],
      correctAnswer: "Azul",
    },
    {
      question: "Que animal é este? 🐘",
      options: ["Rinoceronte", "Hipopótamo", "Elefante", "Girafa"],
      correctAnswer: "Elefante",
    },
    {
      question: "Que objeto é este? ✈️",
      options: ["Helicóptero", "Avião", "Foguete", "Balão"],
      correctAnswer: "Avião",
    },
    {
      question: "Que fruta é esta? 🍎",
      options: ["Laranja", "Banana", "Maçã", "Uva"],
      correctAnswer: "Maçã",
    },
    {
      question: "Que forma é esta? ⚫",
      options: ["Círculo", "Quadrado", "Triângulo", "Retângulo"],
      correctAnswer: "Círculo",
    },
  ],
  letters: [
    {
      question: "Com que letra começa CACHORRO?",
      options: ["B", "C", "D", "A"],
      correctAnswer: "C",
    },
    {
      question: "Com que letra começa VERMELHO?",
      options: ["V", "B", "A", "M"],
      correctAnswer: "V",
    },
    {
      question: "Com que letra começa QUADRADO?",
      options: ["C", "K", "Q", "P"],
      correctAnswer: "Q",
    },
    {
      question: "Com que letra começa ELEFANTE?",
      options: ["A", "E", "I", "L"],
      correctAnswer: "E",
    },
    {
      question: "Com que letra começa BOLA?",
      options: ["P", "D", "B", "V"],
      correctAnswer: "B",
    },
    {
      question: "Com que letra começa AVIÃO?",
      options: ["A", "E", "I", "O"],
      correctAnswer: "A",
    },
    {
      question: "Com que letra começa MACACO?",
      options: ["N", "M", "L", "P"],
      correctAnswer: "M",
    },
    {
      question: "Com que letra começa TARTARUGA?",
      options: ["T", "D", "R", "S"],
      correctAnswer: "T",
    },
    {
      question: "Com que letra começa SAPATO?",
      options: ["C", "S", "Z", "X"],
      correctAnswer: "S",
    },
    {
      question: "Com que letra começa JANELA?",
      options: ["G", "J", "Z", "X"],
      correctAnswer: "J",
    },
  ],
  quantities: [
    {
      question: "Quantas estrelas? ⭐⭐⭐",
      options: ["2", "3", "4", "5"],
      correctAnswer: "3",
    },
    {
      question: "Quantos corações? ❤️❤️❤️❤️❤️",
      options: ["3", "4", "5", "6"],
      correctAnswer: "5",
    },
    {
      question: "Quantos círculos? 🔵🔵",
      options: ["1", "2", "3", "4"],
      correctAnswer: "2",
    },
    {
      question: "Quantas flores? 🌸🌸🌸🌸",
      options: ["2", "3", "4", "5"],
      correctAnswer: "4",
    },
    {
      question: "Quantas árvores? 🌲",
      options: ["1", "2", "3", "4"],
      correctAnswer: "1",
    },
    {
      question: "Quantas nuvens? ☁️☁️☁️☁️☁️☁️",
      options: ["5", "6", "7", "8"],
      correctAnswer: "6",
    },
    {
      question: "Quantos sóis? ☀️☀️☀️",
      options: ["2", "3", "4", "5"],
      correctAnswer: "3",
    },
    {
      question: "Quantas luas? 🌙🌙🌙🌙🌙🌙🌙",
      options: ["6", "7", "8", "9"],
      correctAnswer: "7",
    },
    {
      question: "Quantas maçãs? 🍎🍎🍎🍎🍎🍎🍎🍎",
      options: ["7", "8", "9", "10"],
      correctAnswer: "8",
    },
    {
      question: "Quantas borboletas? 🦋🦋🦋🦋🦋🦋🦋🦋🦋",
      options: ["8", "9", "10", "11"],
      correctAnswer: "9",
    },
  ],
};

const quizTypes = [
  {
    id: "names" as const,
    name: "Nomes",
    description: "Identifique objetos, cores, formas e animais",
    icon: "🎯",
    color: "bg-gradient-primary",
  },
  {
    id: "letters" as const,
    name: "Letra Inicial",
    description: "Descubra a primeira letra das palavras",
    icon: "🔤",
    color: "bg-gradient-accent",
  },
  {
    id: "quantities" as const,
    name: "Quantidades",
    description: "Conte os objetos e formas",
    icon: "🔢",
    color: "bg-gradient-success",
  },
];

const Quizzes = () => {
  const [selectedType, setSelectedType] = useState<QuizType>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [starsEarned, setStarsEarned] = useState(0);
  const { stars, addStars, refreshStars, loading } = useApprenticeStars();
  const { toast } = useToast();

  const questions = selectedType ? questionsData[selectedType] : [];

  useEffect(() => {
    refreshStars();
  }, []);

  const handleSelectType = (type: Exclude<QuizType, null>) => {
    setSelectedType(type);
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setStarsEarned(0);
  };

  const handleAnswer = async (answer: string) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answer);
    const isCorrect = answer === questions[currentQuestion].correctAnswer;

    if (isCorrect) {
      setScore(score + 1);
      // +10 estrelas por acerto
      try {
        await addStars(10);
        setStarsEarned(starsEarned + 10);
      } catch (error) {
        console.error("Error adding stars:", error);
        toast({
          title: "Erro",
          description: "Não foi possível adicionar estrelas.",
          variant: "destructive",
        });
      }
    }

    setTimeout(() => {
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setStarsEarned(0);
  };

  const handleBackToTypes = () => {
    setSelectedType(null);
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setStarsEarned(0);
  };

  if (!selectedType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8 animate-bounce-in">
            <div className="flex justify-between items-center mb-6">
              <BackButton to="/activities" />
              {!loading && <StarsDisplay stars={stars} />}
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Quizzes
            </h1>
            <p className="text-xl text-muted-foreground">Escolha um tipo de quiz para começar</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quizTypes.map((type, index) => (
              <Card
                key={type.id}
                className="cursor-pointer border-2 hover:border-primary transition-all duration-300 hover:shadow-colored hover:scale-105 animate-bounce-in bg-card/80 backdrop-blur-sm"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handleSelectType(type.id)}
              >
                <CardContent className="p-8 flex flex-col items-center text-center gap-4">
                  <div
                    className={`w-24 h-24 rounded-3xl ${type.color} flex items-center justify-center shadow-soft text-5xl`}
                  >
                    {type.icon}
                  </div>
                  <h2 className="text-3xl font-bold text-foreground">{type.name}</h2>
                  <p className="text-muted-foreground text-lg">{type.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background p-4 md:p-8 flex items-center justify-center">
        <Card className="max-w-2xl w-full border-2 shadow-colored animate-bounce-in bg-card/80 backdrop-blur-sm">
          <CardContent className="p-12 flex flex-col items-center text-center gap-6">
            <div className="text-8xl animate-float">✨</div>
            <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">Quiz Finalizado!</h1>
            <div className="text-6xl font-bold text-foreground">
              {score} / {questions.length}
            </div>
            <p className="text-2xl text-muted-foreground">Você acertou {percentage}% das perguntas!</p>
            <div className="flex items-center gap-3 text-3xl font-bold text-primary">
              <span>✨</span>
              <span>+{starsEarned} estrelas!</span>
            </div>
            <div className="flex gap-4 mt-4">
              <Button size="lg" className="rounded-full" onClick={handleRestart}>
                Jogar Novamente
              </Button>
              <Button size="lg" variant="outline" className="rounded-full" onClick={handleBackToTypes}>
                Outro Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const isCorrect = selectedAnswer === currentQ.correctAnswer;
  const isWrong = selectedAnswer !== null && !isCorrect;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 animate-bounce-in">
          <div className="flex justify-between items-center mb-6">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full hover:scale-105 transition-transform"
              onClick={handleBackToTypes}
            >
              ← Voltar
            </Button>
            <StarsDisplay stars={stars} />
          </div>
          <div className="flex items-center justify-between">
            <div className="text-xl text-muted-foreground">
              Pergunta {currentQuestion + 1} de {questions.length}
            </div>
          </div>
        </header>

        <Card className="border-2 shadow-colored animate-bounce-in bg-card/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <h2 className="text-4xl font-bold mb-8 text-center text-foreground">{currentQ.question}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQ.options.map((option, index) => {
                const isSelected = selectedAnswer === option;
                const isCorrectOption = option === currentQ.correctAnswer;
                const showCorrect = selectedAnswer !== null && isCorrectOption;
                const showWrong = isSelected && isWrong;

                return (
                  <Button
                    key={index}
                    size="lg"
                    variant={showCorrect ? "default" : showWrong ? "destructive" : "outline"}
                    className={`h-20 text-2xl font-semibold rounded-2xl transition-all ${
                      showCorrect ? "bg-success hover:bg-success" : ""
                    } ${showWrong ? "bg-destructive hover:bg-destructive" : ""}`}
                    onClick={() => handleAnswer(option)}
                    disabled={selectedAnswer !== null}
                  >
                    <span className="flex items-center gap-3">
                      {option}
                      {showCorrect && <Check className="w-6 h-6" />}
                      {showWrong && <X className="w-6 h-6" />}
                    </span>
                  </Button>
                );
              })}
            </div>

            {selectedAnswer !== null && (
              <div
                className={`mt-8 p-6 rounded-2xl text-center text-2xl font-bold ${
                  isCorrect ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
                }`}
              >
                {isCorrect ? "🎉 Muito bem! +10✨" : "😊 Tente novamente!"}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <SettingsDrawer />
    </div>
  );
};

export default Quizzes;
