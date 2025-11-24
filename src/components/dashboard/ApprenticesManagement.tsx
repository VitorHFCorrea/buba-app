import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Copy, Trash2, CheckCircle2, XCircle } from "lucide-react";
import type { Apprentice } from "@/types/apprentice";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { z } from "zod";

const ApprenticesManagement = () => {
  const { toast } = useToast();
  const [apprentices, setApprentices] = useState<Apprentice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCredentials, setNewCredentials] = useState<{ username: string; pin: string } | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    age: "",
    gender: "",
    support_level: "",
    relationship: "",
  });
  const [usernameError, setUsernameError] = useState("");

  useEffect(() => {
    loadApprentices();
  }, []);

  const loadApprentices = async () => {
    try {
      const { data, error } = await supabase.from("apprentices").select("*").order("created_at", { ascending: false });

      if (error) throw error;
      setApprentices(data || []);
    } catch (error) {
      console.error("Error loading apprentices:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os aprendizes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validateUsername = (username: string): boolean => {
    const usernameRegex = /^[a-z0-9_]{3,20}$/;

    if (!username) {
      setUsernameError("Username é obrigatório");
      return false;
    }

    if (!usernameRegex.test(username)) {
      setUsernameError("Username deve ter 3-20 caracteres e usar apenas letras minúsculas, números e _");
      return false;
    }

    setUsernameError("");
    return true;
  };

  // função gera pin localmente (4 digits)
  const generatePin = (): string => {
    let result = "";
    for (let i = 0; i < 4; i++) {
      result += Math.floor(Math.random() * 10).toString();
    }
    return result;
  };

  const handleCreateApprentice = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.username || !formData.age) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome, username e idade são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (!validateUsername(formData.username)) {
      return;
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // chama função gera pin localmente
      const plainPin = generatePin();

      // insert de novo aprendiz
      const { error: insertError } = await supabase.from("apprentices").insert({
        tutor_id: user.id,
        name: formData.name,
        age: parseInt(formData.age),
        gender: formData.gender || null,
        support_level: formData.support_level || null,
        relationship: formData.relationship || null,
        username: formData.username,
        pin: plainPin,
        stars: 0,
      });

      if (insertError) {
        // se error 23505 = username já existe
        if (insertError.code === "23505") {
          setUsernameError("Este username já existe. Escolha outro.");
          toast({
            title: "Username já existe",
            description: "Escolha um username diferente.",
            variant: "destructive",
          });
          return;
        }
        throw insertError;
      }

      // armazenar credenciais (username + pin) para mostrar no dialog
      setNewCredentials({ username: formData.username, pin: plainPin });

      toast({
        title: "Aprendiz criado!",
        description: "Anote as credenciais mostradas abaixo.",
      });

      // reseta form e recarrega lista para proximo aprendiz
      setFormData({ name: "", username: "", age: "", gender: "", support_level: "", relationship: "" });
      setUsernameError("");
      loadApprentices();
    } catch (error) {
      console.error("Error creating apprentice:", error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o aprendiz.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (apprenticeId: string) => {
    if (!confirm("Tem certeza que deseja excluir este aprendiz?")) return;

    try {
      const { error } = await supabase.from("apprentices").delete().eq("id", apprenticeId);

      if (error) throw error;

      toast({
        title: "Aprendiz excluído",
        description: "O aprendiz foi removido com sucesso.",
      });

      loadApprentices();
    } catch (error) {
      console.error("Error deleting apprentice:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o aprendiz.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Texto copiado para a área de transferência.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Aprendizes</h2>
          <p className="text-muted-foreground">Crie e gerencie perfis para aprendizes</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setNewCredentials(null)} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Aprendiz
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Novo Aprendiz</DialogTitle>
              <DialogDescription>Preencha os dados do aprendiz</DialogDescription>
            </DialogHeader>

            {newCredentials ? (
              <div className="space-y-4">
                <Alert>
                  <AlertDescription>
                    <strong>✅ Aprendiz criado com sucesso!</strong> As credenciais também estarão disponíveis no card do aprendiz.
                  </AlertDescription>
                </Alert>

                <div className="space-y-3 p-4 bg-muted rounded-lg">
                  <div>
                    <Label className="text-sm font-semibold">Usuário:</Label>
                    <div className="flex gap-2 items-center mt-1">
                      <code className="flex-1 p-2 bg-background rounded border">{newCredentials.username}</code>
                      <Button size="sm" variant="outline" onClick={() => copyToClipboard(newCredentials.username)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-semibold">PIN (8 caracteres):</Label>
                    <div className="flex gap-2 items-center mt-1">
                      <code className="flex-1 p-2 bg-background rounded border font-mono text-lg tracking-wider">
                        {newCredentials.pin}
                      </code>
                      <Button size="sm" variant="outline" onClick={() => copyToClipboard(newCredentials.pin)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <Button className="w-full" onClick={() => setIsDialogOpen(false)}>
                  Fechar
                </Button>
              </div>
            ) : (
              <form onSubmit={handleCreateApprentice} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nome do aprendiz"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username *</Label>
                  <div className="relative">
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => {
                        const value = e.target.value.toLowerCase();
                        setFormData({ ...formData, username: value });
                        validateUsername(value);
                      }}
                      placeholder="Ex: joao123, maria_silva"
                      required
                      className={
                        usernameError
                          ? "border-destructive pr-10"
                          : formData.username && !usernameError
                            ? "border-green-500 pr-10"
                            : "pr-10"
                      }
                    />
                    {formData.username && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {usernameError ? (
                          <XCircle className="w-5 h-5 text-destructive" />
                        ) : (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                    )}
                  </div>
                  {usernameError ? (
                    <p className="text-sm text-destructive">{usernameError}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      3-20 caracteres • Apenas letras minúsculas, números e _
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Idade *</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="5"
                    min="1"
                    max="99"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gênero (opcional)</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => setFormData({ ...formData, gender: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="masculino">Masculino</SelectItem>
                      <SelectItem value="feminino">Feminino</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                      <SelectItem value="prefiro_nao_dizer">Prefiro não dizer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="support_level">Nível de Suporte (opcional)</Label>
                  <Select
                    value={formData.support_level}
                    onValueChange={(value) => setFormData({ ...formData, support_level: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nivel_1">Nível 1 - Leve</SelectItem>
                      <SelectItem value="nivel_2">Nível 2 - Moderado</SelectItem>
                      <SelectItem value="nivel_3">Nível 3 - Severo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="relationship">Relação (opcional)</Label>
                  <Select
                    value={formData.relationship}
                    onValueChange={(value) => setFormData({ ...formData, relationship: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="filho">Filho</SelectItem>
                      <SelectItem value="filha">Filha</SelectItem>
                      <SelectItem value="aluno">Aluno</SelectItem>
                      <SelectItem value="aluna">Aluna</SelectItem>
                      <SelectItem value="paciente">Paciente</SelectItem>
                      <SelectItem value="neto">Neto</SelectItem>
                      <SelectItem value="neta">Neta</SelectItem>
                      <SelectItem value="sobrinho">Sobrinho</SelectItem>
                      <SelectItem value="sobrinha">Sobrinha</SelectItem>
                      <SelectItem value="primo">Primo</SelectItem>
                      <SelectItem value="prima">Prima</SelectItem>
                      <SelectItem value="amigo">Amigo</SelectItem>
                      <SelectItem value="amiga">Amiga</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full">
                  Criar Aprendiz
                </Button>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : apprentices.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum aprendiz cadastrado ainda</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {apprentices.map((apprentice) => (
            <Card key={apprentice.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{apprentice.name}</span>
                </CardTitle>
                <CardDescription className="space-y-1">
                  <div>{apprentice.age} anos • @{apprentice.username}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-muted-foreground">PIN:</span>
                    <code className="px-2 py-1 bg-muted rounded text-sm font-mono">{apprentice.pin}</code>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-6 w-6 p-0"
                      onClick={() => copyToClipboard(apprentice.pin)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {apprentice.gender && (
                    <div>
                      <span className="text-muted-foreground">Gênero:</span>
                      <p className="font-medium capitalize">{apprentice.gender.replace("_", " ")}</p>
                    </div>
                  )}
                  {apprentice.support_level && (
                    <div>
                      <span className="text-muted-foreground">Nível de suporte:</span>
                      <p className="font-medium capitalize">{apprentice.support_level.replace("_", " ")}</p>
                    </div>
                  )}
                  {apprentice.relationship && (
                    <div>
                      <span className="text-muted-foreground">Relação:</span>
                      <p className="font-medium capitalize">{apprentice.relationship}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground">Estrelas:</span>
                    <p className="font-medium">{apprentice.stars || 0}✨</p>
                  </div>
                </div>

                <div className="flex mt-3">
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(apprentice.id)}>
                    <Trash2 className="w-4 h-4" />
                    Excluir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApprenticesManagement;
