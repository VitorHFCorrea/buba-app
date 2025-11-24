import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Brain, Trophy, MessageCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SettingsDrawer } from "@/components/SettingsDrawer";
const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // checa se usuário já está logado (tutor)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      }
    });
  }, [navigate]);
  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) {
        toast({
          title: "Erro ao fazer login",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao fazer login",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login/Signup Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-7xl font-cherry bg-gradient-primary bg-clip-text text-transparent mb-2">Buba</h1>
            <p className="text-muted-foreground mt-2">Entre ou crie sua conta para começar</p>
          </div>

          <div className="mb-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/apprentice-login")}
              className="w-full text-lg text-foreground py-0"
            >
              Sou um Aprendiz!
            </Button>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Cadastro</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Bem-vindo de volta!</CardTitle>
                  <CardDescription>Entre com seus dados para continuar aprendendo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="seu@email.com"
                        disabled
                        className="opacity-50 cursor-not-allowed"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Senha</Label>
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        disabled
                        className="opacity-50 cursor-not-allowed"
                      />
                    </div>
                    <Button type="button" className="w-full bg-gradient-primary opacity-50 cursor-not-allowed" disabled>
                      Entrar
                    </Button>
                  </div>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">ou</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-[#4285F4] hover:bg-[#357ABD] text-white border-0"
                    onClick={handleGoogleAuth}
                    disabled={isLoading}
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Entrar com Google
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="signup">
              <Card>
                <CardHeader>
                  <CardTitle>Criar conta</CardTitle>
                  <CardDescription>Crie sua conta para começar a aventura do conhecimento</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Nome</Label>
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Seu nome"
                        disabled
                        className="opacity-50 cursor-not-allowed"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="seu@email.com"
                        disabled
                        className="opacity-50 cursor-not-allowed"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Senha</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        disabled
                        className="opacity-50 cursor-not-allowed"
                      />
                    </div>
                    <Button type="button" className="w-full bg-gradient-primary opacity-50 cursor-not-allowed" disabled>
                      Criar conta
                    </Button>
                  </div>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">ou</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-[#4285F4] hover:bg-[#357ABD] text-white border-0"
                    onClick={handleGoogleAuth}
                    disabled={isLoading}
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Cadastrar com Google
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right Side - Visual Content */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-10"></div>

        <div className="relative z-10 max-w-lg text-center space-y-8">
          <div className="animate-bounce-in">
            <h2 className="text-4xl font-bold text-foreground mb-4">Um Mundo de Conhecimento!</h2>
            <p className="text-xl text-muted-foreground mb-8">Aprendizado de forma divertida e interativa!</p>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-12">
            <div
              className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow-soft hover:shadow-colored transition-all hover:scale-105 animate-scale-in"
              style={{
                animationDelay: "0.1s",
              }}
            >
              <div className="w-14 h-14 bg-gradient-primary rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-semibold text-foreground text-xl">Comunicação</h3>
              <p className="text-sm text-muted-foreground mt-2">Cada um fala do seu jeito!</p>
            </div>

            <div
              className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow-soft hover:shadow-colored transition-all hover:scale-105 animate-scale-in"
              style={{
                animationDelay: "0.2s",
              }}
            >
              <div className="w-14 h-14 bg-gradient-accent rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-semibold text-foreground text-xl">Atividades</h3>
              <p className="text-sm text-muted-foreground mt-2">Brincando e aprendendo!</p>
            </div>

            <div
              className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow-soft hover:shadow-colored transition-all hover:scale-105 animate-scale-in"
              style={{
                animationDelay: "0.3s",
              }}
            >
              <div className="w-14 h-14 bg-gradient-secondary rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <Trophy className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-semibold text-foreground text-xl">Pontuação</h3>
              <p className="text-sm text-muted-foreground mt-2">Progresso constante!</p>
            </div>

            <div
              className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow-soft hover:shadow-colored transition-all hover:scale-105 animate-scale-in"
              style={{
                animationDelay: "0.4s",
              }}
            >
              <div className="w-14 h-14 bg-gradient-success rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-semibold text-foreground text-xl">Flexibilidade</h3>
              <p className="text-sm text-muted-foreground mt-2">Design responsivo e adaptável!</p>
            </div>
          </div>
        </div>
      </div>
      <SettingsDrawer />
    </div>
  );
};
export default Login;
