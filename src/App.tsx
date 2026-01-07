
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
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
import AdminNotifications from "./pages/AdminNotifications";
import RemindersPage from "./pages/RemindersPage";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { App as CapacitorApp } from '@capacitor/app';

const queryClient = new QueryClient();

// Back Button Handler Component
const BackButtonHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    CapacitorApp.addListener('backButton', ({ canGoBack }) => {
      if (location.pathname === '/' || location.pathname === '/auth') {
        CapacitorApp.exitApp();
      } else {
        navigate(-1);
      }
    });

    return () => {
      CapacitorApp.removeAllListeners();
    };
  }, [navigate, location]);

  return null;
};

const AppRoutes = () => {
  return (
    <>
      <BackButtonHandler />
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

            <Route
              path="/reminders"
              element={
                <ProtectedRoute>
                  <RemindersPage />
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

          <Route
            path="/admin/push-notifications"
            element={
              <ProtectedRoute>
                <AdminNotifications />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter >
              </TooltipProvider >
            </AuthProvider >
          </QueryClientProvider >
          );

export default App;
