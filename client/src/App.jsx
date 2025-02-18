import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Layout from "./components/layout/Layout";
import AuthPage from "./pages/auth/AuthPage";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import TalentBoardPage from "./pages/TalentBoardPage";
import PrivateRoute from "./components/auth/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* Public routes */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Protected routes with layout */}
        <Route
          path="/"
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

        {/* Catch all */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
