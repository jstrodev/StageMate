import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Layout from "./components/layout/Layout";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import TalentBoardPage from "./pages/TalentBoardPage";
import PrivateRoute from "./components/auth/PrivateRoute";
import SettingsPage from "./pages/SettingsPage"; // Import SettingsPage
import CalendarPage from "./pages/CalendarPage";
import LandingPage from "./pages/LandingPage"; // Import LandingPage

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* Public routes */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={<LandingPage />} /> {/* Add LandingPage route */}

        {/* Protected routes with layout */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Layout>
                <HomePage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/search"
          element={
            <PrivateRoute>
              <Layout>
                <SearchPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/talent-board"
          element={
            <PrivateRoute>
              <Layout>
                <TalentBoardPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Layout>
                <SettingsPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <PrivateRoute>
              <Layout>
                <CalendarPage />
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
