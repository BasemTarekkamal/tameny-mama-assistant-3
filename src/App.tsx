
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import ChildrenPage from "./pages/ChildrenPage";
import ChildFormPage from "./pages/ChildFormPage";
import ChatPage from "./pages/ChatPage";
import NormalPage from "./pages/NormalPage";
import GrowthPage from "./pages/GrowthPage";
import EmergencyPage from "./pages/EmergencyPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Protected routes */}
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route
                path="/chat"
                element={
                  <ProtectedRoute>
                    <ChatPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/normal"
                element={
                  <ProtectedRoute>
                    <NormalPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/growth"
                element={
                  <ProtectedRoute>
                    <GrowthPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/emergency"
                element={
                  <ProtectedRoute>
                    <EmergencyPage />
                  </ProtectedRoute>
                }
              />
            </Route>
            
            {/* Profile routes (outside Layout for custom header) */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/children"
              element={
                <ProtectedRoute>
                  <ChildrenPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/children/new"
              element={
                <ProtectedRoute>
                  <ChildFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/children/:id"
              element={
                <ProtectedRoute>
                  <ChildFormPage />
                </ProtectedRoute>
              }
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
