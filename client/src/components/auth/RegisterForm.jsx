import { useState } from "react";
import { toast } from "sonner";
import { endpoints } from "../../config/api";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    venueName: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Log the form data being sent
    console.log("Sending registration data:", formData);

    try {
      const response = await fetch(endpoints.register, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Registration response:", data);

      if (response.ok) {
        toast.success("Registration successful! Please login.");
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An error occurred during registration");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div className="space-y-4">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700"
          >
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
          />
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700"
          >
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
          />
        </div>

        <div>
          <label
            htmlFor="venueName"
            className="block text-sm font-medium text-gray-700"
          >
            Venue Name
          </label>
          <input
            id="venueName"
            type="text"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            value={formData.venueName}
            onChange={(e) =>
              setFormData({ ...formData, venueName: e.target.value })
            }
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Register
      </button>
    </form>
  );
};

export default RegisterForm;
