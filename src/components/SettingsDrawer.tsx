import { Settings, Palette, Sparkles, Volume2, Moon, Sun, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useSettings } from "@/contexts/SettingsContext";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const SettingsDrawer = () => {
  const { 
    colorPalette, 
    setColorPalette, 
    animationsEnabled, 
    setAnimationsEnabled,
    soundEnabled,
    setSoundEnabled,
    theme,
    setTheme
  } = useSettings();

  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDesktop, setIsDesktop] = useState(false);

  // esconde botçao de configurações em /
  const shouldHideSettings = location.pathname === '/';

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.clear();
      toast({
        title: "Logout realizado",
        description: "Você saiu da sua conta com sucesso.",
      });
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Erro",
        description: "Não foi possível sair da conta.",
        variant: "destructive",
      });
    }
  };

  const SettingsContent = () => (
    <div className="space-y-6">
      {/* theme */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          {theme === 'dark' ? (
            <Moon className="h-5 w-5 text-primary" />
          ) : (
            <Sun className="h-5 w-5 text-primary" />
          )}
          <Label className="text-lg font-semibold">Tema</Label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant={theme === 'light' ? 'default' : 'outline'}
            onClick={() => setTheme('light')}
            className="h-auto py-4 flex flex-col gap-2"
          >
            <Sun className="h-6 w-6" />
            <span>Claro</span>
          </Button>
          <Button
            variant={theme === 'dark' ? 'default' : 'outline'}
            onClick={() => setTheme('dark')}
            className="h-auto py-4 flex flex-col gap-2"
          >
            <Moon className="h-6 w-6" />
            <span>Escuro</span>
          </Button>
        </div>
      </div>

      {/* color palette */}
      <div className="space-y-3 border-t pt-6">
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-primary" />
          <Label className="text-lg font-semibold">Cores</Label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant={colorPalette === 'soft' ? 'default' : 'outline'}
            onClick={() => setColorPalette('soft')}
            className="h-auto py-4 flex flex-col gap-2"
          >
            <div className="flex gap-1">
              <div className="w-4 h-4 rounded-full bg-gradient-primary" />
              <div className="w-4 h-4 rounded-full bg-gradient-secondary" />
              <div className="w-4 h-4 rounded-full bg-gradient-accent" />
            </div>
            <span>Delicadas</span>
          </Button>
          <Button
            variant={colorPalette === 'vibrant' ? 'default' : 'outline'}
            onClick={() => setColorPalette('vibrant')}
            className="h-auto py-4 flex flex-col gap-2"
          >
            <div className="flex gap-1">
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-600" />
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-orange-500 to-red-500" />
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
            </div>
            <span>Vivas</span>
          </Button>
        </div>
      </div>

      {/* animations */}
      <div className="flex items-center justify-between py-3 border-t">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          <Label htmlFor="animations" className="text-lg font-semibold cursor-pointer">
            Animações
          </Label>
        </div>
        <Switch
          id="animations"
          checked={animationsEnabled}
          onCheckedChange={setAnimationsEnabled}
        />
      </div>

      {/* sound effects */}
      <div className="flex items-center justify-between py-3 border-t">
        <div className="flex items-center gap-2">
          <Volume2 className="h-5 w-5 text-success" />
          <Label htmlFor="sound" className="text-lg font-semibold cursor-pointer">
            Efeitos Sonoros
          </Label>
        </div>
        <Switch
          id="sound"
          checked={soundEnabled}
          onCheckedChange={setSoundEnabled}
        />
      </div>

      {/* logout */}
      <div className="py-3 border-t">
        <Button 
          variant="destructive" 
          className="w-full"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Sair da Conta
        </Button>
      </div>
    </div>
  );

  // se em / esconde o drawer/sidebar
  if (shouldHideSettings) {
    return null;
  }

  const TriggerButton = (
    <Button
      className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-colored z-50 bg-gradient-primary hover:shadow-lg hover:scale-110 transition-all"
    >
      <Settings className="h-7 w-7 text-white" />
    </Button>
  );

  if (isDesktop) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          {TriggerButton}
        </SheetTrigger>
        <SheetContent side="right" className="w-[400px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-2xl">Configurações</SheetTitle>
            <SheetDescription>
              Personalize sua experiência
            </SheetDescription>
          </SheetHeader>
          
          <div className="py-6">
            <SettingsContent />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        {TriggerButton}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-2xl">Configurações</DrawerTitle>
          <DrawerDescription>
            Personalize sua experiência
          </DrawerDescription>
        </DrawerHeader>
        
        <div className="px-4 pb-6">
          <SettingsContent />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
