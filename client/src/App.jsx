import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import AuthPage from "./pages/auth/AuthPage";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<AuthPage />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* Catch all */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
