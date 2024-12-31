import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewProfile = () => {
  const [profile, setProfile] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Token not found. Please log in again.");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/account/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Extracting user object from the response
        const user = response.data.user;
        setProfile({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        });
      } catch (err) {
        console.error("Error fetching profile:", err.response || err);
        if (err.response && err.response.status === 401) {
          setError("Unauthorized. Please log in again.");
        } else {
          setError("Failed to fetch profile. Please try again later.");
        }
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="p-6 bg-white shadow-lg rounded-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Profile Details</h1>
      {error && <p className="text-red-500">{error}</p>}
      {!error && (
        <div className="flex items-center mb-6">
          <img
            src="/asset/farmer1.png"
            alt={`${profile.firstName || ""} ${profile.lastName || ""}`}
            className="w-24 h-24 rounded-full border-2 border-gray-300 shadow-md"
          />
          <div className="ml-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {profile.firstName} {profile.lastName}
            </h2>
            <p className="text-gray-600">{profile.email}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewProfile;
