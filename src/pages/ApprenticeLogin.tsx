import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { ApprenticeLoginResponse } from "@/types/apprentice";
import BackButton from "@/components/BackButton";
import { SettingsDrawer } from "@/components/SettingsDrawer";

const ApprenticeLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // checa se aprendiz já está logado
  useEffect(() => {
    const sessionData = localStorage.getItem('apprentice_session');
    if (sessionData) {
      navigate("/home");
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !pin.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha usuário e PIN.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('🔍 Tentando login com:', { username: username.trim() });
      
      const { data, error } = await supabase.rpc('attempt_apprentice_login', {
        p_username: username.trim(),
        p_pin: pin.trim(),
        p_ip_address: null
      });

      console.log('📥 Resposta do RPC:', { data, error });

      if (error) {
        console.error('❌ Erro do Supabase:', error);
        throw error;
      }

      const response = data as ApprenticeLoginResponse;
      console.log('✅ Response parseada:', response);

      if (response.success) {
        // armazena sessão do aprendiz no localStorage
        localStorage.setItem('apprentice_session', JSON.stringify({
          apprentice_id: response.apprentice_id,
          name: response.name,
          tutor_id: response.tutor_id,
          logged_in_at: new Date().toISOString()
        }));

        toast({
          title: "Bem-vindo!",
          description: `Olá, ${response.name}! 🎉`,
        });

        navigate('/home');
      } else {
        let errorMessage = response.message || "Erro ao fazer login";
        
        if (response.attempts_left !== undefined && response.attempts_left <= 3) {
          errorMessage += ` (${response.attempts_left} tentativas restantes)`;
        }

        toast({
          title: "Erro no login",
          description: errorMessage,
          variant: "destructive",
        });

        setPin("");
      }
    } catch (error) {
      console.error('❌ ERRO COMPLETO:', error);
      console.error('❌ Tipo do erro:', typeof error);
      console.error('❌ Error stringified:', JSON.stringify(error, null, 2));
      
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao tentar fazer login.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="w-full max-w-md">
        <BackButton to="/login" className="mb-6" />
        <Card className="w-full">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold">Login do Aprendiz</CardTitle>
            <CardDescription>
              Digite seu usuário e PIN para acessar
            </CardDescription>
          </CardHeader>
          <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuário</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="seu_usuario_1234"
                disabled={isLoading}
                autoComplete="username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pin">PIN (4 caracteres)</Label>
              <Input
                id="pin"
                type="text"
                value={pin}
                onChange={(e) => setPin(e.target.value.toUpperCase())}
                placeholder="ABC12345"
                maxLength={8}
                disabled={isLoading}
                autoComplete="off"
                className="font-mono text-lg tracking-wider"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>

            <div className="text-center mt-4">
              <p className="text-sm text-muted-foreground mb-2">ou</p>
              <Button
                type="button"
                variant="link"
                onClick={() => navigate('/login')}
              >
                Voltar para o login do tutor
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      </div>
      <SettingsDrawer />
    </div>
  );
};

export default ApprenticeLogin;