import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SettingsDrawer } from "./components/SettingsDrawer";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ApprenticeProtectedRoute } from "./components/ApprenticeProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import ApprenticeLogin from "./pages/ApprenticeLogin";
import ApprenticeDashboard from "./pages/ApprenticeDashboard";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Dictionary from "./pages/Dictionary";
import DictionaryCategory from "./pages/DictionaryCategory";
import Communication from "./pages/Communication";
import Activities from "./pages/Activities";
import Quizzes from "./pages/Quizzes";
import Equations from "./pages/Equations";
import Memory from "./pages/Memory";
import Tasks from "./pages/Tasks";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/apprentice-login" element={<ApprenticeLogin />} />
          <Route path="/home" element={<ApprenticeProtectedRoute><Home /></ApprenticeProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dictionary" element={<ApprenticeProtectedRoute><Dictionary /></ApprenticeProtectedRoute>} />
          <Route path="/dictionary/:id" element={<ApprenticeProtectedRoute><DictionaryCategory /></ApprenticeProtectedRoute>} />
          <Route path="/communication" element={<ApprenticeProtectedRoute><Communication /></ApprenticeProtectedRoute>} />
          <Route path="/activities" element={<ApprenticeProtectedRoute><Activities /></ApprenticeProtectedRoute>} />
          <Route path="/activities/quizzes" element={<ApprenticeProtectedRoute><Quizzes /></ApprenticeProtectedRoute>} />
          <Route path="/activities/equations" element={<ApprenticeProtectedRoute><Equations /></ApprenticeProtectedRoute>} />
          <Route path="/activities/memory" element={<ApprenticeProtectedRoute><Memory /></ApprenticeProtectedRoute>} />
          <Route path="/tasks" element={<ApprenticeProtectedRoute><Tasks /></ApprenticeProtectedRoute>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <SettingsDrawer />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
