import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { X, Volume2 } from "lucide-react";
import BackButton from "@/components/BackButton";
import { SettingsDrawer } from "@/components/SettingsDrawer";

const communicationData = {
  pessoas: {
    name: "Pessoas",
    items: [
      { id: "eu", name: "Eu", image: "👤" },
      { id: "voce", name: "Você", image: "🫵" },
      { id: "mamae", name: "Mãe", image: "👩", searchTerm: "mãe" },
      { id: "papai", name: "Pai", image: "👨", searchTerm: "pai" },
      { id: "familia", name: "Família", image: "👨‍👩‍👧‍👦" },
      { id: "amigo", name: "Amigo", image: "👫" },
      { id: "professor", name: "Professor", image: "👨‍🏫" },
      { id: "medico", name: "Médico", image: "👨‍⚕️", symbolIndex: 1 },
    ],
  },
  acoes: {
    name: "Ações",
    items: [
      { id: "quero", name: "Quero", image: "✅", positive: true },
      { id: "nao-quero", name: "Não Quero", image: "❌", positive: false },
      { id: "gosto", name: "Gosto", image: "❤️", positive: true, searchTerm: "gosto disso" },
      { id: "nao-gosto", name: "Não Gosto", image: "💔", positive: false, searchTerm: "não gosto disso" },
      { id: "fazer", name: "Fazer", image: "✨" },
      { id: "brincar", name: "Brincar", image: "🎮" },
      { id: "comer", name: "Comer", image: "🍴" },
      { id: "beber", name: "Beber", image: "🥤" },
      { id: "dormir", name: "Dormir", image: "😴" },
      { id: "ir", name: "Ir", image: "🚶" },
      { id: "ajuda", name: "Ajuda", image: "🆘" },
      { id: "ver", name: "Ver", image: "👀" },
    ],
  },
  objetos: {
    name: "Objetos",
    items: [
      { id: "brinquedo", name: "Brinquedo", image: "🧸" },
      { id: "livro", name: "Livro", image: "📚" },
      { id: "bola", name: "Bola", image: "⚽" },
      { id: "tablet", name: "Tablet", image: "📱" },
      { id: "tv", name: "TV", image: "📺" },
      { id: "musica", name: "Música", image: "🎵" },
      { id: "video", name: "Celular", image: "🎬", searchTerm: "telemóvel" },
      { id: "roupa", name: "Roupa", image: "👕" },
    ],
  },
  alimentos: {
    name: "Alimentos",
    items: [
      { id: "agua", name: "Água", image: "💧", symbolIndex: 1 },
      { id: "leite", name: "Leite", image: "🥛" },
      { id: "pao", name: "Pão", image: "🍞" },
      { id: "fruta", name: "Fruta", image: "🍎" },
      { id: "biscoito", name: "Biscoito", image: "🍪", searchTerm: "salgadinhos" },
      { id: "suco", name: "Suco", image: "🧃", searchTerm: "Sumo" },
      { id: "comida", name: "Comida", image: "🍽️" },
      { id: "doce", name: "Doce", image: "🍬", searchTerm: "smarties" },
    ],
  },
  lugares: {
    name: "Lugares",
    items: [
      { id: "casa", name: "Casa", image: "🏠", type: "casa" },
      { id: "quarto", name: "Quarto", image: "🛏️", type: "casa", symbolIndex: 5 },
      { id: "banheiro", name: "Banheiro", image: "🚽", type: "casa", searchTerm: "casa de banho", symbolIndex: 1 },
      { id: "cozinha", name: "Cozinha", image: "🍳", type: "casa" },
      { id: "escola", name: "Escola", image: "🏫", type: "cidade", symbolIndex: 1 },
      { id: "parque", name: "Parque", image: "🏞️", type: "cidade", searchTerm: "parque infantil" },
      { id: "hospital", name: "Hospital", image: "🏥", type: "cidade", symbolIndex: 7 },
      { id: "loja", name: "Loja", image: "🏪", type: "cidade" },
    ],
  },
};

interface WordWithSymbol {
  id: string;
  name: string;
  image: string;
  imageUrl?: string;
  searchTerm?: string;
  symbolIndex?: number;
}

const Communication = () => {
  const [selectedWords, setSelectedWords] = useState<WordWithSymbol[]>([]);
  const [animatingWord, setAnimatingWord] = useState<string | null>(null);
  const [symbolsData, setSymbolsData] = useState<Record<string, WordWithSymbol[]>>({});
  const [loadingCategories, setLoadingCategories] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState("pessoas");

  useEffect(() => {
    loadSymbolsForCategory(activeTab);
  }, [activeTab]);

  const loadSymbolsForCategory = async (categoryKey: string) => {
    if (symbolsData[categoryKey]) {
      console.log(`✅ Símbolos já carregados para: ${categoryKey}`);
      return;
    }

    console.log(`🔄 Carregando símbolos para: ${categoryKey}`);
    setLoadingCategories((prev) => new Set(prev).add(categoryKey));

    const category = communicationData[categoryKey as keyof typeof communicationData];
    if (!category) {
      console.error(`❌ Categoria não encontrada: ${categoryKey}`);
      return;
    }

    const symbolPromises = category.items.map(async (item): Promise<WordWithSymbol> => {
      try {
        const searchQuery = item.searchTerm || item.name;
        const index = item.symbolIndex || 0;

        console.log(`🔍 Buscando símbolo para: ${item.name} (termo: ${searchQuery}, índice: ${index})`);

        const response = await fetch(
          `https://api.arasaac.org/api/pictograms/pt/search/${encodeURIComponent(searchQuery)}`,
        );

        if (!response.ok) {
          console.error(`❌ Erro ao buscar ${item.name}: HTTP ${response.status}`);
          return { ...item };
        }

        const data = await response.json();
        const imageUrl =
          data && data.length > index
            ? `https://api.arasaac.org/api/pictograms/${data[index]._id}?download=false`
            : undefined;

        console.log(`✅ Símbolo encontrado para ${item.name}:`, imageUrl);

        return {
          ...item,
          imageUrl,
        };
      } catch (err) {
        console.error(`❌ Erro ao carregar símbolo para ${item.name}:`, err);
        return { ...item };
      }
    });

    const results = await Promise.all(symbolPromises);
    console.log(`✅ Total de símbolos carregados para ${categoryKey}:`, results.length);
    setSymbolsData((prev) => ({ ...prev, [categoryKey]: results }));
    setLoadingCategories((prev) => {
      const newSet = new Set(prev);
      newSet.delete(categoryKey);
      return newSet;
    });
  };

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "pt-BR";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleWordClick = (word: WordWithSymbol) => {
    setAnimatingWord(word.id);
    speak(word.name);
    setTimeout(() => {
      setSelectedWords([...selectedWords, word]);
      setAnimatingWord(null);
    }, 400);
  };

  const handleRemoveWord = (index: number) => {
    setSelectedWords(selectedWords.filter((_, i) => i !== index));
  };

  const handleClearAll = () => {
    setSelectedWords([]);
  };

  const handleSpeakPhrase = () => {
    const phrase = selectedWords.map((w) => w.name).join(" ");
    if (phrase) {
      speak(phrase);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 animate-bounce-in">
          <BackButton to="/home" className="mb-6" />
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center bg-gradient-primary bg-clip-text text-transparent">
            Comunicação
          </h1>
          <p className="text-lg text-muted-foreground text-center">Clique nas palavras para montar sua mensagem</p>
        </header>

        {/* Área de frase construída */}
        <Card className="mb-8 border-2 bg-card/80 backdrop-blur-sm animate-bounce-in">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">Minha Mensagem:</h2>
              <div className="flex gap-2">
                {selectedWords.length > 0 && (
                  <>
                    <Button variant="default" size="sm" onClick={handleSpeakPhrase} className="gap-2">
                      <Volume2 className="w-4 h-4" />
                      Ouvir Frase
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearAll}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      Limpar Tudo
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-3 min-h-[100px] p-4 bg-muted/50 rounded-lg">
              {selectedWords.length === 0 ? (
                <p className="text-muted-foreground italic">Selecione palavras abaixo para construir sua mensagem...</p>
              ) : (
                selectedWords.map((word, index) => (
                  <div
                    key={`${word.id}-${index}`}
                    className="flex items-center gap-2 bg-background border-2 border-primary rounded-lg p-3 animate-scale-in"
                  >
                    {word.imageUrl ? (
                      <img src={word.imageUrl} alt={word.name} className="w-8 h-8 object-contain" />
                    ) : (
                      <span className="text-3xl">{word.image}</span>
                    )}
                    <span className="text-lg font-medium">{word.name}</span>
                    <button
                      onClick={() => handleRemoveWord(index)}
                      className="ml-2 hover:bg-destructive/10 rounded-full p-1 transition-colors"
                    >
                      <X className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Categorias com Tabs */}
        <Tabs defaultValue="pessoas" className="w-full animate-bounce-in" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5 h-auto gap-2 bg-muted/50 p-2">
            {Object.entries(communicationData).map(([key, category]) => (
              <TabsTrigger key={key} value={key} className="text-sm md:text-base font-medium py-3">
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(communicationData).map(([key, category]) => {
            const isLoading = loadingCategories.has(key);
            const items: WordWithSymbol[] = symbolsData[key] || category.items.map((item) => ({ ...item }));

            return (
              <TabsContent key={key} value={key} className="mt-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {isLoading
                    ? category.items.map((item) => (
                        <Card key={item.id} className="border-2">
                          <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                            <Skeleton className="w-20 h-20 rounded-md mb-2" />
                            <Skeleton className="h-5 w-24" />
                          </CardContent>
                        </Card>
                      ))
                    : items.map((item) => (
                        <Card
                          key={item.id}
                          className={`cursor-pointer border-2 hover:border-primary transition-all duration-300 hover:shadow-colored hover:scale-105 bg-card/80 backdrop-blur-sm ${
                            animatingWord === item.id ? "animate-word-to-phrase" : ""
                          }`}
                          onClick={() => handleWordClick(item)}
                        >
                          <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                            {item.imageUrl ? (
                              <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-contain mb-2" />
                            ) : (
                              <div className="text-6xl mb-2">{item.image}</div>
                            )}
                            <h3 className="text-lg font-bold text-foreground">{item.name}</h3>
                            {key === "lugares" && "type" in item && (
                              <span className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                                {item.type === "casa" ? "Em Casa" : "Na Cidade"}
                              </span>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
      <SettingsDrawer />
    </div>
  );
};

export default Communication;
