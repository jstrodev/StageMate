import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserApi } from "../config/api";
import { updateUser } from "../redux/slices/authSlice";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

const SettingsForm = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // old version, backup if this new updates fail  (NC)

  //   const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setMessage("");

  //   if (!token) {
  //     setMessage("Authentication error. Please log in again.");
  //     setLoading(false);
  //     return;
  //   }

  //   try {
  //     const updateData = { ...formData };
  //     delete updateData.id; // Ensure we don't send user ID

  //     const updatedUserData = await updateUserApi(token, updateData);
  //     dispatch(updateUser(updatedUserData));
  //     setMessage("Profile updated successfully!");
  //   } catch (error) {
  //     console.error("Error updating profile:", error.response?.data || error);
  //     setMessage(error.response?.data?.message || "Error updating profile.");
  //   }

  //   setLoading(false);
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!token) {
      setMessage("Authentication error. Please log in again.");
      console.error("Token missing in frontend.");
      setLoading(false);
      return;
    }

    try {
      const updateData = {
        username: formData.username || undefined, // Ensure we don't send empty values
        email: formData.email || undefined,
        password: formData.password ? formData.password : undefined, // Only send password if updated
      };

      console.log("Sending data to API:", updateData); // ✅ Debugging log

      const updatedUserData = await updateUserApi(token, updateData);
      dispatch(updateUser(updatedUserData));
      setMessage("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error);
      setMessage(error.response?.data?.message || "Error updating profile.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
      {message && <p className="text-sm text-green-500">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
        />
        <Input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <Input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="New Password (optional)"
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
};

export default SettingsForm;
