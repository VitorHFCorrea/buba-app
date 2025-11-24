import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

const ChildProfile = () => {
  const childData = {
    name: "João Pedro",
    age: 7,
    level: "Nível 2 (requer apoio substancial)",
    stars: 450,
    avatar: "JP",
  };

  return (
    <div className="max-w-4xl space-y-6">
      <Card>
        <CardHeader></CardHeader>
        <CardContent>
          <div className="flex items-start gap-6">
            <Avatar className="h-32 w-32">
              <AvatarFallback className="text-3xl bg-secondary text-secondary-foreground">
                {childData.avatar}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-2xl font-bold">{childData.name}</h3>
                <p className="text-muted-foreground">{childData.age} anos</p>
              </div>

              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Nível de Acometimento</span>
                  <div className="mt-1">
                    <Badge variant="secondary" className="text-sm">
                      {childData.level}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <Star className="h-5 w-5 fill-secondary text-secondary" />
                  <span className="text-lg font-semibold">{childData.stars} estrelas</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Tarefas Concluídas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-success">12</p>
            <p className="text-sm text-muted-foreground">Esta semana</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Rotina Seguida</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-accent">85%</p>
            <p className="text-sm text-muted-foreground">Esta semana</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Conquistas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">7</p>
            <p className="text-sm text-muted-foreground">Total</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChildProfile;
