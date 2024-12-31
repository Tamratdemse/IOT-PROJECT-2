import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        // Save token to localStorage
        localStorage.setItem("token", data.token);

        // Fetch user profile using the token
        const token = data.token;
        const profileResponse = await axios.get("http://localhost:5000/api/account/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const user = profileResponse.data.user;

        // Optionally, you can store the user data in localStorage or context
        localStorage.setItem("user", JSON.stringify(user));

        // Redirect to the account page
        navigate("/");
      } else {
        setErrorMessage(data.message || "Failed to register. Please try again.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error during registration:", error);
      setErrorMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 shadow-md rounded-md w-80">
        <h1 className="text-2xl font-bold text-center mb-6">Register</h1>
        {errorMessage && <p className="text-red-600 text-center mb-4">{errorMessage}</p>}
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block mb-2 font-semibold text-gray-600">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-semibold text-gray-600">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-semibold text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-semibold text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-2 text-white rounded-md ${
              loading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
