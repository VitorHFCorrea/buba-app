import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

const TutorProfile = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setProfile({
          full_name: user.user_metadata?.full_name || "",
          email: user.email || "",
        });
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({ full_name: profile.full_name })
      .eq('id', user.id);

    if (error) {
      toast({
        title: "Erro ao atualizar",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setIsEditing(false);
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
      });
    }
  };

  if (loading) {
    return <div className="max-w-2xl"><Card><CardContent className="p-6">Carregando...</CardContent></Card></div>;
  }

  return (
    <div className="max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Informações do Tutor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
              <AvatarImage src={user?.user_metadata?.avatar_url} alt={profile.full_name} />
              <AvatarFallback className="text-xl sm:text-2xl bg-primary text-primary-foreground">
                {profile.full_name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-semibold">{profile.full_name}</h3>
              <p className="text-sm sm:text-base text-muted-foreground">Tutor</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                disabled
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {isEditing ? (
              <>
                <Button onClick={handleSave} className="w-full sm:w-auto">Salvar</Button>
                <Button variant="outline" onClick={() => setIsEditing(false)} className="w-full sm:w-auto">
                  Cancelar
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} className="w-full sm:w-auto">Editar Perfil</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TutorProfile;
