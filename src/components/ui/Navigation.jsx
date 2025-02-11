/* TODO - add your code to create a functional React component that renders a navigation bar for the different views in your single page application. You may consider conditionally rendering some options - for example 'Login' should be available if someone has not logged in yet. */

// src/components/Navigation.jsx
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectCurrentToken } from "../redux/slices/authSlice";

const Navigation = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state?.auth?.token ?? null);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="topnav">
      <Link to="/">Home</Link>

      <div className="search-container">
        {token ? (
          <>
            <Link to="/account">My Account</Link>
            <button onClick={handleLogout} className="button">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navigation;