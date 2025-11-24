import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calculator, Check, X } from "lucide-react";
import { useApprenticeStars } from "@/hooks/useApprenticeStars";
import StarsDisplay from "@/components/StarsDisplay";
import { useToast } from "@/hooks/use-toast";
import BackButton from "@/components/BackButton";
import { SettingsDrawer } from "@/components/SettingsDrawer";

interface Equation {
  num1: number;
  num2: number;
  operation: "+" | "-";
  answer: number;
}

const generateEquation = (): Equation => {
  const operation = Math.random() > 0.5 ? "+" : "-";
  let num1: number;
  let num2: number;

  if (operation === "+") {
    num1 = Math.floor(Math.random() * 20) + 1;
    num2 = Math.floor(Math.random() * 20) + 1;
    return { num1, num2, operation, answer: num1 + num2 };
  } else {
    num1 = Math.floor(Math.random() * 20) + 10;
    num2 = Math.floor(Math.random() * num1) + 1;
    return { num1, num2, operation, answer: num1 - num2 };
  }
};

const Equations = () => {
  const [equation, setEquation] = useState<Equation>(generateEquation());
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState<{ show: boolean; correct: boolean; answer?: number }>({
    show: false,
    correct: false,
  });
  const [starsEarned, setStarsEarned] = useState(0);
  const { stars, addStars, refreshStars, loading } = useApprenticeStars();
  const { toast } = useToast();

  const totalQuestions = 10;

  useEffect(() => {
    refreshStars();
  }, []);

  useEffect(() => {
    if (questionsAnswered >= totalQuestions) {
      setShowResult(true);
    }
  }, [questionsAnswered]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userAnswer.trim()) return;

    const isCorrect = parseInt(userAnswer) === equation.answer;

    if (isCorrect) {
      setScore(score + 1);
      setFeedback({ show: true, correct: true });
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
    } else {
      setFeedback({ show: true, correct: false, answer: equation.answer });
    }

    setQuestionsAnswered(questionsAnswered + 1);
    setUserAnswer("");
  };

  const handleNext = () => {
    setFeedback({ show: false, correct: false });
    if (questionsAnswered < totalQuestions) {
      setEquation(generateEquation());
    }
  };

  const handleRestart = () => {
    setScore(0);
    setQuestionsAnswered(0);
    setShowResult(false);
    setUserAnswer("");
    setFeedback({ show: false, correct: false });
    setEquation(generateEquation());
    setStarsEarned(0);
  };

  if (showResult) {
    const percentage = Math.round((score / totalQuestions) * 100);
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background p-4 md:p-8 flex items-center justify-center">
        <Card className="max-w-2xl w-full border-2 shadow-colored animate-bounce-in bg-card/80 backdrop-blur-sm">
          <CardContent className="p-12 flex flex-col items-center text-center gap-6">
            <div className="text-8xl animate-float">✨</div>
            <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">Parabéns!</h1>
            <div className="text-6xl font-bold text-foreground">
              {score} / {totalQuestions}
            </div>
            <p className="text-2xl text-muted-foreground">Você acertou {percentage}% das equações!</p>
            <div className="flex items-center gap-3 text-3xl font-bold text-primary">
              <span>✨</span>
              <span>+{starsEarned} estrelas!</span>
            </div>
            <div className="flex gap-4 mt-4">
              <Button size="lg" className="rounded-full" onClick={handleRestart}>
                Jogar Novamente
              </Button>
              <Link to="/activities">
                <Button size="lg" variant="outline" className="rounded-full">
                  Voltar
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 animate-bounce-in">
          <div className="flex justify-between items-center mb-6">
            <BackButton to="/activities" />
            {!loading && <StarsDisplay stars={stars} />}
          </div>
          <div className="flex items-center justify-between">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Equações
            </h1>
            <div className="text-xl text-muted-foreground">
              {questionsAnswered} / {totalQuestions}
            </div>
          </div>
        </header>

        <Card className="border-2 shadow-colored animate-bounce-in bg-card/80 backdrop-blur-sm">
          <CardContent className="p-12">
            <div className="flex items-center justify-center gap-4 mb-8">
              <Calculator className="w-16 h-16 text-primary" />
            </div>

            {!feedback.show ? (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="text-center">
                  <div className="text-6xl md:text-8xl font-bold text-foreground mb-8">
                    {equation.num1} {equation.operation} {equation.num2} = ?
                  </div>
                  <Input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Digite sua resposta"
                    className="text-4xl text-center h-20 font-bold"
                    autoFocus
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-16 text-2xl rounded-2xl"
                  disabled={!userAnswer.trim()}
                >
                  Confirmar
                </Button>
              </form>
            ) : (
              <div className="space-y-8">
                <div
                  className={`text-center p-8 rounded-3xl ${
                    feedback.correct ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
                  }`}
                >
                  {feedback.correct ? (
                    <div className="space-y-4">
                      <Check className="w-24 h-24 mx-auto" />
                      <p className="text-4xl font-bold">Muito bem! +10✨</p>
                      <p className="text-2xl">
                        {equation.num1} {equation.operation} {equation.num2} = {equation.answer}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <X className="w-24 h-24 mx-auto" />
                      <p className="text-4xl font-bold">Ops!</p>
                      <p className="text-2xl">A resposta correta é: {feedback.answer}</p>
                    </div>
                  )}
                </div>
                <Button size="lg" className="w-full h-16 text-2xl rounded-2xl" onClick={handleNext}>
                  {questionsAnswered < totalQuestions ? "Próxima Equação" : "Ver Resultado"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <SettingsDrawer />
    </div>
  );
};

export default Equations;
