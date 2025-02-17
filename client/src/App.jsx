import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import RequireAuth from "./components/Authentication/RequireAuth";
import Account from "./components/Account/AccountPage";
import Login from "./components/Authentication/Login";
import SingleBook from "./components/SingleBook"; // TODO: Change to SingleMusician
import HomePage from "./pages/HomePage";
import Register from "./components/Authentication/Register";
import NotFound from "./pages/NotFound";
import Navigation from "./components/Navigation";

function App() {
  const token = useSelector((state) => state?.auth?.token ?? null);

  console.log("Current auth state:", { token });

  return (
    <Router>
      <Navigation />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/books/:id" element={<SingleBook />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/account"
          element={
            <RequireAuth>
              <Account />
            </RequireAuth>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;