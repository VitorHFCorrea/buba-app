import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Pencil, Trash2, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface RoutineItem {
  id: number;
  time: string;
  activity: string;
  completed: boolean;
}

const RoutineControl = () => {
  const { toast } = useToast();
  const [routines, setRoutines] = useState<RoutineItem[]>([
    { id: 1, time: "07:00", activity: "Acordar e tomar café", completed: true },
    { id: 2, time: "09:00", activity: "Atividades escolares", completed: true },
    { id: 3, time: "12:00", activity: "Almoço", completed: false },
    { id: 4, time: "14:00", activity: "Tempo de descanso", completed: false },
    { id: 5, time: "16:00", activity: "Brincadeiras", completed: false },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<RoutineItem | null>(null);
  const [newRoutine, setNewRoutine] = useState({ time: "", activity: "" });

  const handleAddRoutine = () => {
    if (!newRoutine.time || !newRoutine.activity) return;

    const routine: RoutineItem = {
      id: Date.now(),
      time: newRoutine.time,
      activity: newRoutine.activity,
      completed: false,
    };

    setRoutines([...routines, routine].sort((a, b) => a.time.localeCompare(b.time)));
    setNewRoutine({ time: "", activity: "" });
    setIsDialogOpen(false);
    toast({
      title: "Rotina adicionada",
      description: "A atividade foi adicionada à rotina.",
    });
  };

  const handleEditRoutine = () => {
    if (!editingRoutine) return;

    setRoutines(
      routines
        .map((r) => (r.id === editingRoutine.id ? editingRoutine : r))
        .sort((a, b) => a.time.localeCompare(b.time)),
    );
    setEditingRoutine(null);
    setIsDialogOpen(false);
    toast({
      title: "Rotina atualizada",
      description: "As alterações foram salvas.",
    });
  };

  const handleDeleteRoutine = (id: number) => {
    setRoutines(routines.filter((r) => r.id !== id));
    toast({
      title: "Rotina excluída",
      description: "A atividade foi removida.",
    });
  };

  const handleToggleComplete = (id: number) => {
    setRoutines(routines.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r)));
  };

  const openEditDialog = (routine: RoutineItem) => {
    setEditingRoutine({ ...routine });
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingRoutine(null);
    setNewRoutine({ time: "", activity: "" });
    setIsDialogOpen(true);
  };

  return (
    <div className="max-w-4xl space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Controle de Rotina</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog}>
              <Plus className="h-4 w-4" />
              Nova Atividade
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingRoutine ? "Editar Rotina" : "Nova Rotina"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="routine-time">Horário</Label>
                <Input
                  id="routine-time"
                  type="time"
                  value={editingRoutine ? editingRoutine.time : newRoutine.time}
                  onChange={(e) =>
                    editingRoutine
                      ? setEditingRoutine({ ...editingRoutine, time: e.target.value })
                      : setNewRoutine({ ...newRoutine, time: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="routine-activity">Atividade</Label>
                <Input
                  id="routine-activity"
                  value={editingRoutine ? editingRoutine.activity : newRoutine.activity}
                  onChange={(e) =>
                    editingRoutine
                      ? setEditingRoutine({ ...editingRoutine, activity: e.target.value })
                      : setNewRoutine({ ...newRoutine, activity: e.target.value })
                  }
                  placeholder="Ex: Almoço"
                />
              </div>
              <Button onClick={editingRoutine ? handleEditRoutine : handleAddRoutine} className="w-full">
                {editingRoutine ? "Salvar" : "Adicionar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {routines.map((routine) => (
          <Card key={routine.id}>
            <CardContent className="flex items-center gap-4 p-4">
              <Checkbox checked={routine.completed} onCheckedChange={() => handleToggleComplete(routine.id)} />
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className={`font-semibold ${routine.completed ? "line-through text-muted-foreground" : ""}`}>
                    {routine.time}
                  </span>
                  <span className={routine.completed ? "line-through text-muted-foreground" : ""}>
                    {routine.activity}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="ghost" onClick={() => openEditDialog(routine)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => handleDeleteRoutine(routine.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RoutineControl;
