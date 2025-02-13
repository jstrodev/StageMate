import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import RequireAuth from "./components/Authentication/RequireAuth";
import Account from "./components/Account/AccountPage";
import Login from "./components/Authentication/Login";
 main
import SingleMusician from "./components/SingleMusician"; // TODO: Change to SingleMusician
import SingleMusician from "./components/SingleMusician";
main
import HomePage from "./pages/HomePage";
import Register from "./components/Authentication/Register";
import NotFound from "./pages/NotFound";
import Navigation from "./components/Navigation";
import Logout from "../src/components/authentication/Logout";

function App() {
  const token = useSelector((state) => state?.auth?.token ?? null);

  console.log("Current auth state:", { token });

  return (
    <Router>
      <Navigation />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/books/:id" element={<SingleMusician />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />

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
