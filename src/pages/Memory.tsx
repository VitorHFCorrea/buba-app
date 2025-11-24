import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";
import { useApprenticeStars } from "@/hooks/useApprenticeStars";
import StarsDisplay from "@/components/StarsDisplay";
import { useToast } from "@/hooks/use-toast";
import BackButton from "@/components/BackButton";
import { SettingsDrawer } from "@/components/SettingsDrawer";

type Color = "red" | "blue" | "green" | "yellow";

const colors: Color[] = ["red", "blue", "green", "yellow"];

const colorMap = {
  red: { bg: "bg-red-500", active: "bg-red-300", label: "Vermelho" },
  blue: { bg: "bg-blue-500", active: "bg-blue-300", label: "Azul" },
  green: { bg: "bg-green-500", active: "bg-green-300", label: "Verde" },
  yellow: { bg: "bg-yellow-500", active: "bg-yellow-300", label: "Amarelo" },
};

// calcula estrelas baseado no nível (dobra a cada 3 níveis)
const calculateStarsForLevel = (level: number): number => {
  const tier = Math.floor((level - 1) / 3);
  return 10 * Math.pow(2, tier);
};

const Memory = () => {
  const [sequence, setSequence] = useState<Color[]>([]);
  const [userSequence, setUserSequence] = useState<Color[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isUserTurn, setIsUserTurn] = useState(false);
  const [activeColor, setActiveColor] = useState<Color | null>(null);
  const [level, setLevel] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [starsEarnedThisGame, setStarsEarnedThisGame] = useState(0);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const { stars, memoryRecord, addStars, updateMemoryRecord, refreshStars, loading } = useApprenticeStars();
  const { toast } = useToast();

  useEffect(() => {
    refreshStars();
  }, []);

  const playSequence = async (seq: Color[]) => {
    setIsPlaying(true);
    setIsUserTurn(false);

    for (let i = 0; i < seq.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setActiveColor(seq[i]);
      await new Promise((resolve) => setTimeout(resolve, 600));
      setActiveColor(null);
    }

    setIsPlaying(false);
    setIsUserTurn(true);
  };

  const startGame = () => {
    const newColor = colors[Math.floor(Math.random() * colors.length)];
    const newSequence = [newColor];
    setSequence(newSequence);
    setUserSequence([]);
    setLevel(0);
    setGameOver(false);
    setStarsEarnedThisGame(0);
    setIsNewRecord(false);
    playSequence(newSequence);
  };

  const nextRound = async () => {
    const newLevel = level + 1;
    setLevel(newLevel);

    // adicionar estrelas baseado no nível
    const starsForLevel = calculateStarsForLevel(newLevel);
    try {
      await addStars(starsForLevel);
      setStarsEarnedThisGame(starsEarnedThisGame + starsForLevel);
    } catch (error) {
      console.error("Error adding stars:", error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar estrelas.",
        variant: "destructive",
      });
    }

    const newColor = colors[Math.floor(Math.random() * colors.length)];
    const newSequence = [...sequence, newColor];
    setSequence(newSequence);
    setUserSequence([]);
    playSequence(newSequence);
  };

  const handleColorClick = (color: Color) => {
    if (!isUserTurn || isPlaying) return;

    const newUserSequence = [...userSequence, color];
    setUserSequence(newUserSequence);

    // destaca cor clicada
    setActiveColor(color);
    setTimeout(() => setActiveColor(null), 300);

    // verifica se está certo
    const currentIndex = newUserSequence.length - 1;
    if (newUserSequence[currentIndex] !== sequence[currentIndex]) {
      // errou = game over
      endGame();
      return;
    }

    // se completou a sequência
    if (newUserSequence.length === sequence.length) {
      setIsUserTurn(false);
      setTimeout(() => {
        nextRound();
      }, 1000);
    }
  };

  const endGame = async () => {
    setGameOver(true);
    setIsUserTurn(false);

    // verificar se é record
    if (level > memoryRecord) {
      try {
        const wasNewRecord = await updateMemoryRecord(level);
        setIsNewRecord(wasNewRecord || false);
      } catch (error) {
        console.error("Error updating memory record:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 animate-bounce-in">
          <div className="flex justify-between items-center mb-6">
            <BackButton to="/activities" />
            <div className="flex items-center gap-4">
              {!loading && <StarsDisplay stars={stars} />}
              {memoryRecord > 0 && (
                <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm px-6 py-3 rounded-full border-2">
                  <span className="text-lg text-muted-foreground">Record:</span>
                  <span className="text-2xl font-bold">Nível {memoryRecord}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <Lightbulb className="w-12 h-12 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Jogo da Memória
            </h1>
          </div>
          <p className="text-xl text-muted-foreground">Memorize e repita a sequência de cores!</p>
        </header>

        {!gameOver && sequence.length === 0 ? (
          <Card className="border-2 shadow-colored animate-bounce-in bg-card/80 backdrop-blur-sm">
            <CardContent className="p-12 flex flex-col items-center text-center gap-6">
              <Lightbulb className="w-32 h-32 text-primary animate-float" />
              <h2 className="text-4xl font-bold text-foreground">Pronto para começar?</h2>
              <p className="text-xl text-muted-foreground max-w-md">
                Observe a sequência de cores e depois repita na mesma ordem. A cada acerto, você ganha estrelas e a
                sequência fica maior!
              </p>
              <p className="text-lg text-muted-foreground">
                🌟 Níveis 1-3: 10 estrelas cada
                <br />
                ⭐ Níveis 4-6: 20 estrelas cada
                <br />✨ Níveis 7-9: 40 estrelas cada...
              </p>
              <Button size="lg" className="mt-4 text-2xl h-16 px-12 rounded-full" onClick={startGame}>
                Iniciar Jogo
              </Button>
            </CardContent>
          </Card>
        ) : gameOver ? (
          <Card className="border-2 shadow-colored animate-bounce-in bg-card/80 backdrop-blur-sm">
            <CardContent className="p-12 flex flex-col items-center text-center gap-6">
              <div className="text-8xl animate-float">✨</div>
              <h2 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                {isNewRecord ? "🎉 NOVO RECORD!" : "Fim de Jogo!"}
              </h2>
              <div className="space-y-4">
                <div className="text-6xl font-bold text-foreground">Nível {level}</div>
                {isNewRecord && (
                  <p className="text-2xl text-success font-bold">Parabéns! Você superou seu record anterior!</p>
                )}
                <div className="flex items-center justify-center gap-3 text-3xl font-bold text-primary">
                  <span>✨</span>
                  <span>+{starsEarnedThisGame} estrelas!</span>
                </div>
              </div>
              <div className="flex gap-4 mt-4">
                <Button size="lg" className="rounded-full text-xl" onClick={startGame}>
                  Jogar Novamente
                </Button>
                <Link to="/activities">
                  <Button size="lg" variant="outline" className="rounded-full text-xl">
                    Voltar
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="bg-card/80 backdrop-blur-sm px-8 py-4 rounded-full border-2">
                  <span className="text-2xl font-bold">Nível {level}</span>
                </div>
              </div>
              {!isUserTurn && !isPlaying && (
                <p className="text-xl text-muted-foreground animate-pulse">Preparando próxima sequência...</p>
              )}
              {isPlaying && <p className="text-xl text-muted-foreground animate-pulse">Observe a sequência...</p>}
              {isUserTurn && (
                <p className="text-xl text-success font-semibold animate-pulse">Sua vez! Repita a sequência</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
              {colors.map((color) => {
                const isActive = activeColor === color;
                const colorStyle = colorMap[color];
                return (
                  <button
                    key={color}
                    className={`aspect-square rounded-3xl transition-all duration-200 ${
                      isActive ? colorStyle.active : colorStyle.bg
                    } ${
                      isUserTurn && !isPlaying
                        ? "hover:scale-105 cursor-pointer shadow-colored"
                        : "cursor-not-allowed opacity-70"
                    } ${isActive ? "scale-110 shadow-2xl" : ""}`}
                    onClick={() => handleColorClick(color)}
                    disabled={!isUserTurn || isPlaying}
                    aria-label={colorStyle.label}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
      <SettingsDrawer />
    </div>
  );
};

export default Memory;
