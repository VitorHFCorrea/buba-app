import { useState, useRef, useEffect } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Star, Clock } from "lucide-react";
import { format, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import type { ApprenticeSession } from "@/types/apprentice";
import BackButton from "@/components/BackButton";
import { SettingsDrawer } from "@/components/SettingsDrawer";

interface AgendaEvent {
  id: string;
  apprentice_id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  type: "escola" | "familia" | "aniversario" | "consulta" | "amigos";
}

interface RoutineTask {
  id: string;
  apprentice_id: string;
  title: string;
  completed: boolean;
  time: string;
  is_holiday: boolean;
}

const Tasks = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<ApprenticeSession | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState<"agenda" | "rotina">("agenda");
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const agendaRef = useRef<HTMLButtonElement>(null);
  const rotinaRef = useRef<HTMLButtonElement>(null);

  const [agendaEvents, setAgendaEvents] = useState<AgendaEvent[]>([]);
  const [routineTasks, setRoutineTasks] = useState<RoutineTask[]>([]);
  const [loading, setLoading] = useState(true);

  // timeout de segurança para loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 3000); // 3 segundos no máximo

    return () => clearTimeout(timeout);
  }, []);

  // verificar sessão
  useEffect(() => {
    console.log("🔍 Verificando sessão do aprendiz...");
    const sessionData = localStorage.getItem("apprentice_session");

    if (!sessionData) {
      console.warn("⚠️ Nenhuma sessão encontrada no localStorage");
      navigate("/apprentice-login");
      setLoading(false);
      return;
    }

    console.log("📦 Session data from localStorage:", sessionData);

    try {
      const parsedSession = JSON.parse(sessionData);
      console.log("✅ Sessão carregada:", parsedSession);
      console.log("🆔 Apprentice ID:", parsedSession.apprentice_id);
      setSession(parsedSession);
    } catch (error) {
      console.error("❌ Error parsing session:", error);
      navigate("/apprentice-login");
      setLoading(false);
    }
  }, [navigate]);

  // carregar tarefas
  useEffect(() => {
    console.log("🔍 useEffect de carregamento - session:", session);

    if (session?.apprentice_id) {
      console.log("✅ Carregando dados para apprentice_id:", session.apprentice_id);
      loadAgendaEvents();
      loadRoutineTasks();
    } else if (session) {
      console.warn("⚠️ Sessão existe mas SEM apprentice_id:", session);
      setLoading(false);
    } else {
      console.log("⏳ Aguardando sessão...");
    }
  }, [session]);

  useEffect(() => {
    const updateIndicator = () => {
      const activeRef = activeTab === "agenda" ? agendaRef : rotinaRef;
      if (activeRef.current) {
        const { offsetLeft, offsetWidth } = activeRef.current;
        setIndicatorStyle({ left: offsetLeft, width: offsetWidth });
      }
    };
    updateIndicator();
  }, [activeTab]);

  const loadAgendaEvents = async () => {
    if (!session?.apprentice_id) {
      setLoading(false);
      return;
    }

    console.log("🔍 Loading agenda events for apprentice:", session.apprentice_id);

    try {
      const { data, error } = await supabase.rpc("get_apprentice_agenda_events", {
        p_apprentice_id: session.apprentice_id,
      });

      if (error) {
        console.error("❌ Error loading agenda events:", error);
        console.error("Error details:", JSON.stringify(error, null, 2));
        setAgendaEvents([]);
      } else {
        console.log("✅ Agenda events loaded:", data);
        setAgendaEvents(data || []);
      }
    } catch (error) {
      console.error("❌ Exception loading agenda events:", error);
      setAgendaEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const loadRoutineTasks = async () => {
    if (!session?.apprentice_id) {
      console.log("❌ Sem session ou apprentice_id para carregar rotinas");
      return;
    }

    console.log("🔍 Loading routine tasks for apprentice:", session.apprentice_id);
    console.log("📞 Chamando RPC: get_apprentice_routine_tasks");

    try {
      const { data, error } = await supabase.rpc("get_apprentice_routine_tasks", {
        p_apprentice_id: session.apprentice_id,
      });

      if (error) {
        console.error("❌ Error loading routine tasks:", error);
        console.error("Error code:", error.code);
        console.error("Error message:", error.message);
        console.error("Error details:", JSON.stringify(error, null, 2));
        setRoutineTasks([]);
      } else {
        console.log("✅ Routine tasks loaded. Count:", data?.length || 0);
        console.log("📊 Tasks data:", JSON.stringify(data, null, 2));
        setRoutineTasks(data || []);
      }
    } catch (error) {
      console.error("❌ Exception loading routine tasks:", error);
      setRoutineTasks([]);
    }
  };

  const handleToggleRoutine = async (id: string) => {
    const task = routineTasks.find((t) => t.id === id);
    if (!task || !session?.apprentice_id) return;

    console.log("🔄 Toggling routine task:", id, "completed:", !task.completed);

    try {
      const { error } = await supabase.rpc("update_routine_task_completion", {
        p_task_id: id,
        p_completed: !task.completed,
      });

      if (error) {
        console.error("❌ Error toggling routine:", error);
        throw error;
      }

      console.log("✅ Routine task toggled successfully");
      loadRoutineTasks();
    } catch (error) {
      console.error("Error toggling task:", error);
    }
  };

  const getEventTypeColor = (type: string) => {
    const colors = {
      escola: "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30",
      familia: "bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30",
      aniversario: "bg-pink-500/20 text-pink-700 dark:text-pink-300 border-pink-500/30",
      consulta: "bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30",
      amigos: "bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30",
    };
    return colors[type as keyof typeof colors] || colors.escola;
  };

  const getEventTypeIcon = (type: string) => {
    const icons = {
      escola: "📚",
      familia: "👨‍👩‍👧‍👦",
      aniversario: "🎂",
      consulta: "🏥",
      amigos: "🎮",
    };
    return icons[type as keyof typeof icons] || icons.escola;
  };

  const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
  const filteredRoutineTasks = routineTasks.filter((task) => task.is_holiday === isWeekend);
  const completedCount = filteredRoutineTasks.filter((t) => t.completed).length;
  const totalCount = filteredRoutineTasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  if (!session || loading) {
    return <div className="p-6"></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-3 sm:p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <BackButton to="/home" />
        </div>
        <div className="text-center space-y-1 sm:space-y-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Minhas Tarefas
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">Veja suas atividades e eventos!</p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "agenda" | "rotina")}
          className="w-full"
        >
          <div className="relative bg-muted p-1 rounded-md h-10 sm:h-12 flex items-center">
            {/* Sliding indicator */}
            <div
              className="absolute h-8 sm:h-10 bg-background rounded-sm shadow-sm transition-all duration-300 ease-in-out"
              style={{
                left: `${indicatorStyle.left}px`,
                width: `${indicatorStyle.width}px`,
                top: "4px",
              }}
            />
            <button
              ref={agendaRef}
              onClick={() => setActiveTab("agenda")}
              className={`relative z-10 flex-1 h-8 sm:h-10 rounded-sm text-sm sm:text-base font-medium transition-colors duration-200 ${
                activeTab === "agenda" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="hidden sm:inline">📅 Eventos</span>
              <span className="sm:hidden">📅</span>
            </button>
            <button
              ref={rotinaRef}
              onClick={() => setActiveTab("rotina")}
              className={`relative z-10 flex-1 h-8 sm:h-10 rounded-sm text-sm sm:text-base font-medium transition-colors duration-200 ${
                activeTab === "rotina" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="hidden sm:inline">⏰ Rotina</span>
              <span className="sm:hidden">⏰</span>
            </button>
          </div>

          {/* Rotina Tab */}
          <TabsContent value="rotina" className="space-y-3 sm:space-y-4 mt-4 sm:mt-6 animate-fade-in">
            {/* Date Navigation */}
            <Card className="border-2">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentDate(addDays(currentDate, -1))}
                    className="h-8 w-8 sm:h-10 sm:w-10 shrink-0"
                  >
                    <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                  <div className="text-center flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-bold capitalize truncate">{format(currentDate, "EEEE", { locale: ptBR })}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {format(currentDate, "dd 'de' MMMM", { locale: ptBR })}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentDate(addDays(currentDate, 1))}
                    className="h-8 w-8 sm:h-10 sm:w-10 shrink-0"
                  >
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Progress Card */}
            {totalCount > 0 && (
              <Card className="border-2 bg-gradient-to-br from-primary/10 to-accent/10">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0">
                      <svg className="w-16 h-16 sm:w-20 sm:h-20 transform -rotate-90">
                        <circle
                          cx="32"
                          cy="32"
                          r="26"
                          stroke="currentColor"
                          strokeWidth="5"
                          fill="transparent"
                          className="text-muted/20 sm:hidden"
                        />
                        <circle
                          cx="32"
                          cy="32"
                          r="26"
                          stroke="currentColor"
                          strokeWidth="5"
                          fill="transparent"
                          strokeDasharray={`${2 * Math.PI * 26}`}
                          strokeDashoffset={`${2 * Math.PI * 26 * (1 - progress / 100)}`}
                          className="text-primary transition-all duration-500 sm:hidden"
                          strokeLinecap="round"
                        />
                        <circle
                          cx="40"
                          cy="40"
                          r="32"
                          stroke="currentColor"
                          strokeWidth="6"
                          fill="transparent"
                          className="text-muted/20 hidden sm:block"
                        />
                        <circle
                          cx="40"
                          cy="40"
                          r="32"
                          stroke="currentColor"
                          strokeWidth="6"
                          fill="transparent"
                          strokeDasharray={`${2 * Math.PI * 32}`}
                          strokeDashoffset={`${2 * Math.PI * 32 * (1 - progress / 100)}`}
                          className="text-primary transition-all duration-500 hidden sm:block"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Star className="h-6 w-6 sm:h-8 sm:w-8 text-primary" fill="currentColor" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl sm:text-2xl font-bold">
                        {completedCount} de {totalCount}
                      </h3>
                      <p className="text-sm sm:text-base text-muted-foreground">tarefas concluídas hoje!</p>
                      {progress === 100 && (
                        <p className="text-sm sm:text-base text-primary font-semibold mt-1 animate-pulse">🎉 Parabéns! Você arrasou!</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tasks List */}
            <div className="space-y-3">
              {filteredRoutineTasks.map((task, index) => (
                <Card
                  key={task.id}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  className={`border-2 transition-all duration-300 hover:shadow-lg animate-bounce-in ${
                    task.completed ? "bg-muted/50" : "bg-card hover:scale-[1.02]"
                  }`}
                >
                  <CardContent className="flex items-center gap-2 sm:gap-4 p-3 sm:p-4">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => handleToggleRoutine(task.id)}
                      className="h-5 w-5 sm:h-6 sm:w-6 shrink-0"
                    />
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary shrink-0">
                        <Clock className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                          <span className="text-xs sm:text-sm font-semibold text-primary">{task.time}</span>
                          <h3
                            className={`text-sm sm:text-lg font-semibold truncate ${
                              task.completed ? "line-through text-muted-foreground" : ""
                            }`}
                          >
                            {task.title}
                          </h3>
                        </div>
                      </div>
                    </div>
                    {task.completed && <span className="text-xl sm:text-2xl shrink-0">✅</span>}
                  </CardContent>
                </Card>
              ))}
              {filteredRoutineTasks.length === 0 && (
                <Card className="border-2">
                  <CardContent className="p-8 sm:p-12 text-center">
                    <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🎉</div>
                    <p className="text-base sm:text-lg text-muted-foreground">Nenhuma tarefa para hoje!</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Agenda Tab */}
          <TabsContent value="agenda" className="space-y-3 sm:space-y-4 mt-4 sm:mt-6 animate-fade-in">
            <div className="space-y-3 sm:space-y-4">
              {agendaEvents.map((event, index) => (
                <Card 
                  key={event.id} 
                  style={{ animationDelay: `${index * 0.1}s` }}
                  className={`border-2 animate-bounce-in ${getEventTypeColor(event.type)}`}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="text-3xl sm:text-5xl shrink-0">{getEventTypeIcon(event.type)}</div>
                      <div className="flex-1 space-y-1 sm:space-y-2 min-w-0">
                        <h3 className="text-base sm:text-xl font-bold">{event.title}</h3>
                        <p className="text-sm sm:text-base break-words">{event.description}</p>
                        <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
                          <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                          <span className="break-words">
                            {format(addDays(new Date(event.date), 1), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                            {event.time && ` às ${event.time}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {agendaEvents.length === 0 && (
                <Card className="border-2">
                  <CardContent className="p-8 sm:p-12 text-center">
                    <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">📅</div>
                    <p className="text-base sm:text-lg text-muted-foreground">Nenhum evento agendado</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <SettingsDrawer />
    </div>
  );
};

export default Tasks;
