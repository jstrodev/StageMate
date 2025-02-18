import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearCredentials } from "../../redux/slices/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Add effect to check auth state
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!token || !savedUser) {
      dispatch(clearCredentials());
      navigate("/auth");
    }
  }, [dispatch, navigate]);

  // Handle clicking outside of dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Add console log to check user data
  console.log("Current user in Navbar:", user);

  const handleLogout = () => {
    dispatch(clearCredentials());
    setIsDropdownOpen(false);
    navigate("/auth");
  };

  // Ensure we have user data before accessing firstName
  const userInitial = user?.firstName?.[0]?.toUpperCase() || "?";
  const displayName = user?.firstName || "Guest";

  return (
    <nav className="bg-white border-b h-16 px-4 flex items-center justify-between">
      <Link to="/" className="flex items-center space-x-2">
        <img src="/logo.svg" alt="StageMate" className="h-8 w-8" />
        <span className="text-xl font-bold text-primary-DEFAULT">
          StageMate
        </span>
      </Link>

      <div className="flex items-center space-x-4">
        <span className="text-gray-700">Welcome, {displayName}</span>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-8 h-8 bg-primary-dark text-white rounded-full flex items-center justify-center text-sm font-medium shadow-md hover:bg-primary-DEFAULT transition-colors"
          >
            {userInitial}
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
