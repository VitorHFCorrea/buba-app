import { useState } from "react";
import { User, Baby, CheckSquare, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import TutorProfile from "@/components/dashboard/TutorProfile";
import ChildProfile from "@/components/dashboard/ChildProfile";
import ApprenticesManagement from "@/components/dashboard/ApprenticesManagement";
import TasksControl from "@/components/dashboard/TasksControl";
import SettingsSection from "@/components/dashboard/SettingsSection";
import { useIsMobile } from "@/hooks/use-mobile";
import { SettingsDrawer } from "@/components/SettingsDrawer";

type Section = "tutor-profile" | "child-profile" | "apprentices" | "tasks" | "settings";

const menuItems = [
  { id: "tutor-profile" as Section, title: "Meu Perfil", icon: User },
  { id: "apprentices" as Section, title: "Aprendizes", icon: Baby },
  { id: "tasks" as Section, title: "Tarefas", icon: CheckSquare },
  { id: "settings" as Section, title: "Configurações", icon: Settings },
];

const DashboardContent = () => {
  const [activeSection, setActiveSection] = useState<Section>("tutor-profile");
  const { setOpen } = useSidebar();
  const isMobile = useIsMobile();

  const handleSectionChange = (section: Section) => {
    setActiveSection(section);
    // fecha a sidebar apenas em mobile
    if (isMobile) {
      setOpen(false);
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case "tutor-profile":
        return <TutorProfile />;
      case "apprentices":
        return <ApprenticesManagement />;
      case "tasks":
        return <TasksControl />;
      case "settings":
        return <SettingsSection />;
      default:
        return <TutorProfile />;
    }
  };

  return (
    <>
      <Sidebar className="border-r border-sidebar-border">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-sidebar-foreground">Dashboard</h1>
        </div>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => handleSectionChange(item.id)}
                      isActive={activeSection === item.id}
                      className="w-full h-[42px]"
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="text-xl">{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <main className="flex-1 min-w-0">
        <header className="h-14 sm:h-16 border-b border-border flex items-center px-3 sm:px-6 bg-card">
          <SidebarTrigger />
          <h2 className="ml-2 sm:ml-4 text-base sm:text-lg font-semibold text-foreground truncate">
            {menuItems.find((item) => item.id === activeSection)?.title}
          </h2>
        </header>

        <div className="p-3 sm:p-6">{renderSection()}</div>
      </main>
    </>
  );
};

const Dashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardContent />
        <SettingsDrawer />
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
