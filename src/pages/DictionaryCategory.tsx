import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import BackButton from "@/components/BackButton";
import { SettingsDrawer } from "@/components/SettingsDrawer";

const activityData: Record<
  string,
  { name: string; items: Array<{ id: string; name: string; image: string; symbolIndex?: number; searchTerm?: string }> }
> = {
  letters: {
    name: "Letras",
    items: [
      { id: "a", name: "Abelha", image: "🐝" },
      { id: "b", name: "Bola", image: "⚽" },
      { id: "c", name: "Casa", image: "🏠" },
      { id: "d", name: "Dado", image: "🎲" },
      { id: "e", name: "Elefante", image: "🐘" },
      { id: "f", name: "Flor", image: "🌸" },
      { id: "g", name: "Gato", image: "🐈" },
      { id: "h", name: "Helicóptero", image: "🚁" },
      { id: "i", name: "Igreja", image: "⛪" },
      { id: "j", name: "Janela", image: "🪟" },
      { id: "k", name: "Kiwi", image: "🥝" },
      { id: "l", name: "Lápis", image: "✏️" },
      { id: "m", name: "Maçã", image: "🍎" },
      { id: "n", name: "Navio", image: "🚢" },
      { id: "o", name: "Ovelha", image: "🐑" },
      { id: "p", name: "Peixe", image: "🐟" },
      { id: "q", name: "Queijo", image: "🧀" },
      { id: "r", name: "Rato", image: "🐀" },
      { id: "s", name: "Sol", image: "☀️" },
      { id: "t", name: "Tigre", image: "🐅" },
      { id: "u", name: "Uva", image: "🍇" },
      { id: "v", name: "Vaca", image: "🐄" },
      { id: "w", name: "Web", image: "🌐" },
      { id: "x", name: "Xadrez", image: "☕" },
      { id: "y", name: "Yoga", image: "🧘‍♀️", searchTerm: "ioga" },
      { id: "z", name: "Zebra", image: "🦓" },
    ],
  },
  numbers: {
    name: "Números",
    items: [
      { id: "1", name: "Um", image: "1️⃣" },
      { id: "2", name: "Dois", image: "2️⃣" },
      { id: "3", name: "Três", image: "3️⃣" },
      { id: "4", name: "Quatro", image: "4️⃣" },
      { id: "5", name: "Cinco", image: "5️⃣" },
      { id: "6", name: "Seis", image: "6️⃣" },
      { id: "7", name: "Sete", image: "7️⃣" },
      { id: "8", name: "Oito", image: "8️⃣" },
      { id: "9", name: "Nove", image: "9️⃣" },
      { id: "10", name: "Dez", image: "🔟", symbolIndex: 1 },
      { id: "11", name: "Onze", image: "🔢" },
      { id: "12", name: "Doze", image: "🔢" },
      { id: "13", name: "Treze", image: "🔢" },
      { id: "14", name: "Catorze", image: "🔢" },
      { id: "15", name: "Quinze", image: "🔢" },
      { id: "16", name: "Dezesseis", image: "🔢", searchTerm: "16" },
      { id: "17", name: "Dezessete", image: "🔢", searchTerm: "17" },
      { id: "18", name: "Dezoito", image: "🔢" },
      { id: "19", name: "Dezenove", image: "🔢", searchTerm: "19" },
      { id: "20", name: "Vinte", image: "🔢" },
      { id: "30", name: "Trinta", image: "🔢" },
      { id: "40", name: "Quarenta", image: "🔢" },
      { id: "50", name: "Cinquenta", image: "🔢" },
      { id: "60", name: "Sessenta", image: "🔢" },
      { id: "70", name: "Setenta", image: "🔢" },
      { id: "80", name: "Oitenta", image: "🔢" },
      { id: "90", name: "Noventa", image: "🔢" },
      { id: "100", name: "Cem", image: "💯" },
    ],
  },
  animals: {
    name: "Animais",
    items: [
      { id: "dog", name: "Cachorro", image: "🐕", searchTerm: "cão" },
      { id: "cat", name: "Gato", image: "🐈" },
      { id: "bird", name: "Pássaro", image: "🐦" },
      { id: "fish", name: "Peixe", image: "🐠" },
      { id: "rabbit", name: "Coelho", image: "🐰" },
      { id: "lion", name: "Leão", image: "🦁" },
      { id: "cow", name: "Vaca", image: "🐄" },
      { id: "horse", name: "Cavalo", image: "🐎" },
      { id: "frog", name: "Sapo", image: "🐸" },
      { id: "chicken", name: "Galinha", image: "🐔" },
      { id: "duck", name: "Pato", image: "🦆" },
      { id: "bear", name: "Urso", image: "🐻" },
    ],
  },
  objects: {
    name: "Objetos",
    items: [
      { id: "ball", name: "Bola", image: "⚽" },
      { id: "book", name: "Livro", image: "📚" },
      { id: "pencil", name: "Lápis", image: "✏️" },
      { id: "apple", name: "Maçã", image: "🍎" },
      { id: "cup", name: "Copo", image: "🥤" },
      { id: "car", name: "Carro", image: "🚗" },
      { id: "chair", name: "Cadeira", image: "🪑" },
      { id: "phone", name: "Telefone", image: "📱" },
      { id: "key", name: "Chave", image: "🔑" },
      { id: "bed", name: "Cama", image: "🛏️" },
      { id: "bag", name: "Mochila", image: "👜", symbolIndex: 1 },
      { id: "clock", name: "Relógio", image: "⏰" },
    ],
  },
  colors: {
    name: "Cores",
    items: [
      { id: "red", name: "Vermelho", image: "🔴" },
      { id: "blue", name: "Azul", image: "🔵" },
      { id: "yellow", name: "Amarelo", image: "🟡" },
      { id: "green", name: "Verde", image: "🟢" },
      { id: "purple", name: "Roxo", image: "🟣" },
      { id: "orange", name: "Laranja", image: "🟠" },
      { id: "pink", name: "Rosa", image: "🩷", searchTerm: "cor de rosa" },
      { id: "brown", name: "Marrom", image: "🟤", searchTerm: "cor café" },
      { id: "black", name: "Preto", image: "⚫" },
      { id: "white", name: "Branco", image: "⚪" },
      { id: "gray", name: "Cinza", image: "⚫", searchTerm: "cinzento" },
    ],
  },
  shapes: {
    name: "Formas",
    items: [
      { id: "circle", name: "Círculo", image: "⭕" },
      { id: "triangle", name: "Triângulo", image: "🔺", symbolIndex: 1 },
      { id: "square", name: "Quadrado", image: "🟦" },
      { id: "rectangle", name: "Retângulo", image: "▭" },
      { id: "pentagon", name: "Pentágono", image: "⬠" },
      { id: "hexagon", name: "Hexágono", image: "⬡" },
      { id: "star", name: "Estrela", image: "⭐", symbolIndex: 1 },
      { id: "heart", name: "Coração", image: "❤️" },
      { id: "diamond", name: "Losango", image: "💎" },
      { id: "oval", name: "Oval", image: "🥚" },
      { id: "cube", name: "Cubo", image: "🧊", symbolIndex: 2 },
      { id: "prism", name: "Prisma", image: "📦" },
      { id: "sphere", name: "Esfera", image: "⚽" },
      { id: "pyramid", name: "Pirâmide", image: "🔺", symbolIndex: 1 },
      { id: "cone", name: "Cone", image: "🍦", symbolIndex: 3 },
      { id: "cylinder", name: "Cilindro", image: "🥫" },
      { id: "spiral", name: "Espiral", image: "🌀" },
      { id: "horizontal", name: "Horizontal", image: "↔️" },
      { id: "vertical", name: "Vertical", image: "↕️" },
    ],
  },
};

interface ItemWithSymbol {
  id: string;
  name: string;
  image: string;
  imageUrl?: string;
  symbolIndex?: number; // índice do pictograma (0 = primeiro)
  searchTerm?: string; // termo alternativo para busca
}

const DictionaryCategory = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [items, setItems] = useState<ItemWithSymbol[]>([]);
  const [loading, setLoading] = useState(true);
  const activity = id ? activityData[id] : null;

  const speak = (text: string) => {
    // cancela qualquer fala em andamento
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9; // mais devagar 
    utterance.pitch = 1.1; // tom mais alto
    
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (!activity) return;

    async function loadSymbols() {
      console.log("🔍 Iniciando busca de símbolos ARASAAC para categoria:", id);
      setLoading(true);

      const symbolPromises = activity.items.map(async (item) => {
        try {
          const searchQuery = item.searchTerm || item.name;
          console.log(`🔎 Buscando símbolo ARASAAC para: ${item.name} (query: ${searchQuery})`);

          // chamar API ARASAAC diretamente
          const response = await fetch(
            `https://api.arasaac.org/api/pictograms/pt/search/${encodeURIComponent(searchQuery)}`,
          );

          if (!response.ok) {
            console.error(`❌ Erro ao buscar ${item.name}: ${response.status}`);
            return item;
          }

          const data = await response.json();
          console.log(`✅ Resultado ARASAAC para ${item.name}:`, data);

          // use o índice especificado ou 0 por padrão
          const symbolIndex = item.symbolIndex ?? 0;
          const selectedSymbol = data[symbolIndex] || data[0];

          return {
            ...item,
            imageUrl:
              data && data.length > 0
                ? `https://api.arasaac.org/api/pictograms/${selectedSymbol._id}?download=false`
                : undefined,
          };
        } catch (err) {
          console.error(`❌ Erro loading symbol for ${item.name}:`, err);
          return item;
        }
      });

      const results = await Promise.all(symbolPromises);
      console.log("✨ Símbolos ARASAAC carregados:", results);
      setItems(results);
      setLoading(false);
    }

    loadSymbols();
  }, [id]);

  if (!activity) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Categoria não encontrada</h1>
          <Link to="/dictionary">
            <Button size="lg" className="rounded-full">
              Voltar para Dicionário
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 animate-bounce-in">
          <BackButton to="/dictionary" className="mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-center bg-gradient-primary bg-clip-text text-transparent">
            {activity.name}
          </h1>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {loading
            ? activity.items.map((item, index) => (
                <Card key={item.id} className="border-2 border-border">
                  <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                    <Skeleton className="w-20 h-20 rounded-md" />
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="w-12 h-12 rounded-full" />
                  </CardContent>
                </Card>
              ))
            : items.map((item, index) => (
                <Card
                  key={item.id}
                  className={`cursor-pointer border-2 transition-all duration-300 hover:shadow-colored hover:scale-105 animate-bounce-in ${
                    selectedItem === item.id ? "border-primary shadow-colored scale-105" : "border-border"
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => setSelectedItem(item.id)}
                >
                  <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-20 h-20 object-contain animate-float"
                        style={{ animationDelay: `${index * 0.2}s` }}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = "block";
                        }}
                      />
                    ) : null}
                    <div
                      className="text-6xl md:text-7xl animate-float"
                      style={{
                        animationDelay: `${index * 0.2}s`,
                        display: item.imageUrl ? "none" : "block",
                      }}
                    >
                      {item.image}
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-foreground">
                      {id === "letters" ? `${item.id.toUpperCase()} de ${item.name}` : item.name}
                    </h2>
                    <Button
                      size="icon"
                      variant="outline"
                      className="rounded-full w-12 h-12 hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        speak(item.name);
                      }}
                    >
                      <Volume2 className="h-5 w-5" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
        </div>
      </div>
      <SettingsDrawer />
    </div>
  );
};

export default DictionaryCategory;
