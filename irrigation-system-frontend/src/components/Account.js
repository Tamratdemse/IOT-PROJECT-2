import React, { useState, useEffect } from "react";
import axios from "axios";

function Account() {
  const [user, setUser] = useState(null); // User data from the backend
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [passwordData, setPasswordData] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
  });

  // Fetch user data when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
        console.log("Token from localStorage:", token);
  
        const response = await axios.get("http://localhost:5000/api/account/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        setUser(response.data.user);
        setFormData({
          firstName: response.data.user.firstName,
          lastName: response.data.user.lastName,
          email: response.data.user.email,
        });
      } catch (error) {
        console.error("Error fetching user data:", error.message);
        console.error("Error details:", error.response?.data || error);
      }
    };
  
    fetchUserData();
  }, []);
  

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:5000/api/account/update",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(response.data.user);
      setIsEditing(false);
      alert("Account updated successfully!");
    } catch (error) {
      console.error("Error updating account:", error.message);
      alert("Error updating account.");
    }
  };

  const handlePasswordChange = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/api/account/change-password",
        passwordData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Password changed successfully!");
      setIsChangingPassword(false);
      setPasswordData({ email: "", currentPassword: "", newPassword: "" });
    } catch (error) {
      console.error("Error changing password:", error.message);
      alert("Error changing password.");
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto max-w-4xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
          Account Settings
        </h1>

        {/* Personal Information Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Personal Information
          </h2>
          {isEditing ? (
            <div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  className="p-2 border-2 border-gray-300 rounded-lg focus:outline-none"
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  className="p-2 border-2 border-gray-300 rounded-lg focus:outline-none"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="p-2 border-2 border-gray-300 rounded-lg focus:outline-none"
                  disabled
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleSaveChanges}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg w-1/4"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded-lg w-1/4"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-gray-600 mb-2">First Name: {user.firstName}</p>
              <p className="text-gray-600 mb-2">Last Name: {user.lastName}</p>
              <p className="text-gray-600 mb-4">Email: {user.email}</p>
              <button
                onClick={handleEditClick}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg w-1/4"
              >
                Edit
              </button>
            </div>
          )}
        </section>

        {/* Change Password Section */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Change Password
          </h2>
          {isChangingPassword ? (
            <div className="flex flex-col gap-4">
              <input
                type="email"
                name="email"
                value={passwordData.email}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, email: e.target.value })
                }
                placeholder="Email"
                className="p-2 border-2 border-gray-300 rounded-lg focus:outline-none"
              />
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
                placeholder="Current Password"
                className="p-2 border-2 border-gray-300 rounded-lg focus:outline-none"
              />
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, newPassword: e.target.value })
                }
                placeholder="New Password"
                className="p-2 border-2 border-gray-300 rounded-lg focus:outline-none"
              />
              <div className="flex gap-4 mt-6">
                <button
                  onClick={handlePasswordChange}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg w-1/4"
                >
                  Change
                </button>
                <button
                  onClick={() => setIsChangingPassword(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded-lg w-1/4"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-gray-600 mb-4">******</p>
              <button
                onClick={() => setIsChangingPassword(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg w-1/4"
              >
                Change Password
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Account;
