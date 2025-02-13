// Clicking logout removes the token and redirects to HomePage
// Clears user state in Redux

import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "../../redux/slices/authSlice"; // Assuming you have this action to clear user data

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user data from state
    dispatch(setCredentials(null)); // Clear the user's credentials

    // Optionally, remove auth token from localStorage or sessionStorage
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");

    // Redirect user to login page or home page
    navigate("/login"); // or navigate('/') for the home page
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
          Are you sure you want to logout?
        </h2>

        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={handleLogout}
            className="group relative flex justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;
