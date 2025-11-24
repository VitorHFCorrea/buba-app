import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Plus,
  Pencil,
  Trash2,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { format, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import type { Apprentice } from "@/types/apprentice";

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

const TasksControl = () => {
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());

  const [apprentices, setApprentices] = useState<Apprentice[]>([]);
  const [selectedApprenticeId, setSelectedApprenticeId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // agenda state
  const [agendaEvents, setAgendaEvents] = useState<AgendaEvent[]>([]);
  const [isAgendaDialogOpen, setIsAgendaDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AgendaEvent | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    type: "escola" as const,
  });

  // rotina state
  const [routineTasks, setRoutineTasks] = useState<RoutineTask[]>([]);
  const [isRoutineDialogOpen, setIsRoutineDialogOpen] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<RoutineTask | null>(
    null
  );
  const [newRoutine, setNewRoutine] = useState({
    title: "",
    time: "",
    is_holiday: false,
  });

  // carrega aprendizes
  useEffect(() => {
    loadApprentices();
  }, []);

  // se aprendiz mudar, recarrega eventos e tarefas
  useEffect(() => {
    if (selectedApprenticeId) {
      loadAgendaEvents();
      loadRoutineTasks();
    }
  }, [selectedApprenticeId]);

  const loadApprentices = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("apprentices")
        .select("*")
        .eq("tutor_id", user.id)
        .order("name");

      if (error) throw error;
      setApprentices(data || []);
      if (data && data.length > 0) {
        setSelectedApprenticeId(data[0].id);
      }
    } catch (error) {
      console.error("Error loading apprentices:", error);
      toast({
        title: "Erro ao carregar aprendizes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAgendaEvents = async () => {
    if (!selectedApprenticeId) return;

    try {
      const { data, error } = await supabase
        .from("agenda_events")
        .select("*")
        .eq("apprentice_id", selectedApprenticeId)
        .order("date");

      if (error) throw error;
      setAgendaEvents(data || []);
    } catch (error) {
      console.error("Error loading agenda events:", error);
    }
  };

  const loadRoutineTasks = async () => {
    if (!selectedApprenticeId) return;

    try {
      const { data, error } = await supabase
        .from("routine_tasks")
        .select("*")
        .eq("apprentice_id", selectedApprenticeId)
        .order("time");

      if (error) throw error;
      setRoutineTasks(data || []);
    } catch (error) {
      console.error("Error loading routine tasks:", error);
    }
  };

  // funções de agenda
  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.date || !selectedApprenticeId) return;

    try {
      // separa data e hora de datetime (add event)
      const dateTime = new Date(newEvent.date);
      const date = format(dateTime, "yyyy-MM-dd");
      const time = format(dateTime, "HH:mm");

      const { error } = await supabase.from("agenda_events").insert({
        apprentice_id: selectedApprenticeId,
        title: newEvent.title,
        description: newEvent.description || "",
        date: date,
        time: time,
        type: newEvent.type,
      });

      if (error) throw error;
      toast({
        title: "Evento adicionado",
        description: "O evento foi criado com sucesso.",
      });
      setNewEvent({ title: "", description: "", date: "", type: "escola" });
      setIsAgendaDialogOpen(false);
      loadAgendaEvents();
    } catch (error) {
      console.error("Error adding event:", error);
      toast({
        title: "Erro ao adicionar evento",
        variant: "destructive",
      });
    }
  };

  const handleEditEvent = async () => {
    if (!editingEvent || !editingEvent.title || !editingEvent.date) return;

    try {
      // separa data e hora de datetime (edit event)
      const dateTime = new Date(editingEvent.date);
      const date = format(dateTime, "yyyy-MM-dd");
      const time = format(dateTime, "HH:mm");

      const { error } = await supabase
        .from("agenda_events")
        .update({
          title: editingEvent.title,
          description: editingEvent.description,
          date: date,
          time: time,
          type: editingEvent.type,
        })
        .eq("id", editingEvent.id);

      if (error) throw error;

      toast({
        title: "Evento atualizado",
        description: "As alterações foram salvas.",
      });
      setEditingEvent(null);
      setIsAgendaDialogOpen(false);
      loadAgendaEvents();
    } catch (error) {
      console.error("Error updating event:", error);
      toast({
        title: "Erro ao atualizar evento",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      const { error } = await supabase
        .from("agenda_events")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Evento excluído",
        description: "O evento foi removido.",
      });
      loadAgendaEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        title: "Erro ao remover evento",
        variant: "destructive",
      });
    }
  };

  // funções rotina
  const handleAddRoutine = async () => {
    if (!newRoutine.title || !newRoutine.time || !selectedApprenticeId) return;

    try {
      const { error } = await supabase.from("routine_tasks").insert({
        apprentice_id: selectedApprenticeId,
        title: newRoutine.title,
        time: newRoutine.time,
        is_holiday: newRoutine.is_holiday,
        completed: false,
      });

      if (error) throw error;
      toast({
        title: "Tarefa adicionada",
        description: "A tarefa foi adicionada à rotina.",
      });
      setNewRoutine({ title: "", time: "", is_holiday: false });
      setIsRoutineDialogOpen(false);
      loadRoutineTasks();
    } catch (error) {
      console.error("Error adding task:", error);
      toast({
        title: "Erro ao adicionar tarefa",
        variant: "destructive",
      });
    }
  };

  const handleEditRoutine = async () => {
    if (!editingRoutine || !editingRoutine.title || !editingRoutine.time)
      return;

    try {
      const { error } = await supabase
        .from("routine_tasks")
        .update({
          title: editingRoutine.title,
          time: editingRoutine.time,
          is_holiday: editingRoutine.is_holiday,
        })
        .eq("id", editingRoutine.id);

      if (error) throw error;

      toast({
        title: "Tarefa atualizada",
        description: "As alterações foram salvas.",
      });
      setEditingRoutine(null);
      setIsRoutineDialogOpen(false);
      loadRoutineTasks();
    } catch (error) {
      console.error("Error updating task:", error);
      toast({
        title: "Erro ao atualizar tarefa",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRoutine = async (id: string) => {
    try {
      const { error } = await supabase
        .from("routine_tasks")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Tarefa excluída",
        description: "A tarefa foi removida.",
      });
      loadRoutineTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
      toast({
        title: "Erro ao remover tarefa",
        variant: "destructive",
      });
    }
  };

  const handleToggleRoutine = async (id: string) => {
    const task = routineTasks.find((t) => t.id === id);
    if (!task) return;

    try {
      const { error } = await supabase
        .from("routine_tasks")
        .update({ completed: !task.completed })
        .eq("id", id);

      if (error) throw error;

      loadRoutineTasks();
    } catch (error) {
      console.error("Error toggling task:", error);
    }
  };

  const handleToggleAllRoutines = async () => {
    if (filteredRoutineTasks.length === 0) return;

    const allCompleted = filteredRoutineTasks.every((t) => t.completed);
    const newCompletedStatus = !allCompleted;

    try {
      const { error } = await supabase
        .from("routine_tasks")
        .update({ completed: newCompletedStatus })
        .in(
          "id",
          filteredRoutineTasks.map((t) => t.id)
        );

      if (error) throw error;

      toast({
        title: newCompletedStatus
          ? "Todas marcadas como concluídas"
          : "Todas desmarcadas",
        description: newCompletedStatus
          ? "Todas as tarefas foram marcadas como concluídas!"
          : "Todas as tarefas foram desmarcadas para o próximo dia.",
      });

      loadRoutineTasks();
    } catch (error) {
      console.error("Error toggling all tasks:", error);
      toast({
        title: "Erro ao atualizar tarefas",
        variant: "destructive",
      });
    }
  };

  const getEventTypeColor = (type: string) => {
    const colors = {
      escola: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
      familia: "bg-green-500/10 text-green-700 dark:text-green-300",
      aniversario: "bg-pink-500/10 text-pink-700 dark:text-pink-300",
      consulta: "bg-purple-500/10 text-purple-700 dark:text-purple-300",
      amigos: "bg-orange-500/10 text-orange-700 dark:text-orange-300",
    };
    return colors[type as keyof typeof colors] || colors.escola;
  };

  const getEventTypeLabel = (type: string) => {
    const labels = {
      escola: "Escola",
      familia: "Família",
      aniversario: "Aniversário",
      consulta: "Consulta",
      amigos: "Amigos",
    };
    return labels[type as keyof typeof labels] || type;
  };

  // filtra tarefas com base no dia (0=domingo, 6=sabado)
  const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
  const filteredRoutineTasks = routineTasks.filter(
    (task) => task.is_holiday === isWeekend
  );

  if (loading) {
    return <div className="p-6">Carregando...</div>;
  }

  if (apprentices.length === 0) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Nenhum aprendiz cadastrado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Cadastre um aprendiz primeiro para gerenciar suas tarefas.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Selecionar Aprendiz</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedApprenticeId}
            onValueChange={setSelectedApprenticeId}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione um aprendiz" />
            </SelectTrigger>
            <SelectContent>
              {apprentices.map((apprentice) => (
                <SelectItem key={apprentice.id} value={apprentice.id}>
                  {apprentice.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Tabs defaultValue="agenda" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-2">
          <TabsTrigger value="agenda">Agenda</TabsTrigger>
          <TabsTrigger value="rotina">Rotina</TabsTrigger>
        </TabsList>

        <TabsContent value="agenda" className="space-y-4">
          <div className="flex items-center gap-4 justify-end w-full sm:w-auto">
            <Dialog
              open={isAgendaDialogOpen}
              onOpenChange={setIsAgendaDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingEvent(null);
                    setNewEvent({
                      title: "",
                      description: "",
                      date: "",
                      type: "escola",
                    });
                  }}
                  className="w-full sm:w-auto"
                >
                  <Plus className="h-4 w-4" />
                  Evento
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingEvent ? "Editar Evento" : "Novo Evento"}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Título</Label>
                    <Input
                      value={editingEvent ? editingEvent.title : newEvent.title}
                      onChange={(e) =>
                        editingEvent
                          ? setEditingEvent({
                              ...editingEvent,
                              title: e.target.value,
                            })
                          : setNewEvent({ ...newEvent, title: e.target.value })
                      }
                      placeholder="Ex: Reunião escolar"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo</Label>
                    <Select
                      value={editingEvent ? editingEvent.type : newEvent.type}
                      onValueChange={(value) =>
                        editingEvent
                          ? setEditingEvent({
                              ...editingEvent,
                              type: value as any,
                            })
                          : setNewEvent({ ...newEvent, type: value as any })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="escola">Escola</SelectItem>
                        <SelectItem value="familia">Família</SelectItem>
                        <SelectItem value="aniversario">Aniversário</SelectItem>
                        <SelectItem value="consulta">
                          Consulta Médica
                        </SelectItem>
                        <SelectItem value="amigos">Amigos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Data</Label>
                    <Input
                      type="datetime-local"
                      value={editingEvent ? editingEvent.date : newEvent.date}
                      onChange={(e) =>
                        editingEvent
                          ? setEditingEvent({
                              ...editingEvent,
                              date: e.target.value,
                            })
                          : setNewEvent({ ...newEvent, date: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Descrição</Label>
                    <Textarea
                      value={
                        editingEvent
                          ? editingEvent.description
                          : newEvent.description
                      }
                      onChange={(e) =>
                        editingEvent
                          ? setEditingEvent({
                              ...editingEvent,
                              description: e.target.value,
                            })
                          : setNewEvent({
                              ...newEvent,
                              description: e.target.value,
                            })
                      }
                      placeholder="Detalhes do evento"
                    />
                  </div>
                  <Button
                    onClick={editingEvent ? handleEditEvent : handleAddEvent}
                    className="w-full"
                  >
                    {editingEvent ? "Salvar" : "Adicionar"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-3">
            {agendaEvents.map((event) => (
              <Card key={event.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <CalendarIcon className="h-5 w-5 mt-1 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{event.title}</h3>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${getEventTypeColor(
                            event.type
                          )}`}
                        >
                          {getEventTypeLabel(event.type)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {event.description}
                      </p>
                      <p className="text-sm font-medium">
                        {format(
                          addDays(new Date(event.date), 1),
                          "dd 'de' MMMM 'de' yyyy",
                          { locale: ptBR }
                        )}
                        {event.time && ` às ${event.time}`}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          // combina data + hora = datetime-local format
                          const dateTimeValue = event.time
                            ? `${event.date}T${event.time}`
                            : event.date;
                          setEditingEvent({ ...event, date: dateTimeValue });
                          setIsAgendaDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {agendaEvents.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  Nenhum evento agendado
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="rotina" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex items-center gap-4 justify-center sm:justify-start w-full sm:w-auto">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentDate(addDays(currentDate, -1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-center">
                <h3 className="text-lg font-semibold">
                  {format(currentDate, "EEEE", { locale: ptBR })}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {format(currentDate, "dd 'de' MMMM 'de' yyyy", {
                    locale: ptBR,
                  })}
                </p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentDate(addDays(currentDate, 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={handleToggleAllRoutines}
                disabled={filteredRoutineTasks.length === 0}
                className="rounded-full flex-1 sm:flex-initial sm:max-w-[8rem]"
              >
                {filteredRoutineTasks.every((t) => t.completed)
                  ? "Desmarcar Tudo"
                  : "Marcar Tudo"}
              </Button>
              <Dialog
                open={isRoutineDialogOpen}
                onOpenChange={setIsRoutineDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setEditingRoutine(null);
                      setNewRoutine({
                        title: "",
                        time: "",
                        is_holiday: isWeekend,
                      });
                    }}
                    className="rounded-full flex-1 sm:flex-initial sm:max-w-[7rem]"
                  >
                    <Plus className="h-4 w-4" />
                    Tarefa
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingRoutine ? "Editar Tarefa" : "Nova Tarefa"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Tarefa</Label>
                      <Input
                        value={
                          editingRoutine
                            ? editingRoutine.title
                            : newRoutine.title
                        }
                        onChange={(e) =>
                          editingRoutine
                            ? setEditingRoutine({
                                ...editingRoutine,
                                title: e.target.value,
                              })
                            : setNewRoutine({
                                ...newRoutine,
                                title: e.target.value,
                              })
                        }
                        placeholder="Ex: Escovar os dentes"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Horário</Label>
                      <Input
                        type="time"
                        value={
                          editingRoutine ? editingRoutine.time : newRoutine.time
                        }
                        onChange={(e) =>
                          editingRoutine
                            ? setEditingRoutine({
                                ...editingRoutine,
                                time: e.target.value,
                              })
                            : setNewRoutine({
                                ...newRoutine,
                                time: e.target.value,
                              })
                        }
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="is_holiday"
                        checked={
                          editingRoutine
                            ? editingRoutine.is_holiday
                            : newRoutine.is_holiday
                        }
                        onCheckedChange={(checked) =>
                          editingRoutine
                            ? setEditingRoutine({
                                ...editingRoutine,
                                is_holiday: checked as boolean,
                              })
                            : setNewRoutine({
                                ...newRoutine,
                                is_holiday: checked as boolean,
                              })
                        }
                      />
                      <Label
                        htmlFor="is_holiday"
                        className="text-sm font-normal cursor-pointer"
                      >
                        Dia de folga (sábado e domingo)
                      </Label>
                    </div>
                    <Button
                      onClick={
                        editingRoutine ? handleEditRoutine : handleAddRoutine
                      }
                      className="w-full"
                    >
                      {editingRoutine ? "Salvar" : "Adicionar"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="space-y-3">
            {filteredRoutineTasks.map((task) => (
              <Card key={task.id}>
                <CardContent className="flex items-center gap-4 p-4">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => handleToggleRoutine(task.id)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-muted-foreground min-w-[60px]">
                        {task.time}
                      </span>
                      <h3
                        className={`font-semibold ${
                          task.completed
                            ? "line-through text-muted-foreground"
                            : ""
                        }`}
                      >
                        {task.title}
                      </h3>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setEditingRoutine({ ...task });
                        setIsRoutineDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDeleteRoutine(task.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredRoutineTasks.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  Nenhuma tarefa cadastrada ainda...
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TasksControl;
