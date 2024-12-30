import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../config/b_url";
import ErrorBoundary from "./ErrorBoundary";

function Notification() {
  const { id } = useParams();
  const [isNotificationOn, setIsNotificationOn] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");

  const handleToggle = () => {
    setIsNotificationOn((prevState) => !prevState);
    console.log(`Notifications turned ${!isNotificationOn ? "On" : "Off"}`);
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/arduino/${id}`);
        console.log("API Response:", response.data); // Debugging log

        // Check if the response data is an array
        if (Array.isArray(response.data)) {
          setNotifications(response.data);
        } else if (response.data && typeof response.data === "object") {
          // If the response data is an object, convert it to an array
          setNotifications([response.data]);
        } else {
          setError("Unexpected data format");
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setError("Failed to fetch notifications");
      }
    };

    fetchNotifications();
  }, [id]);

  if (error) {
    return <p className="text-center text-lg text-red-500">{error}</p>;
  }

  if (!Array.isArray(notifications) || notifications.length === 0) {
    console.log("Notifications is not an array or is empty:", notifications); // Debugging log
    return <p className="text-center text-lg">No notifications available.</p>;
  }

  return (
    <ErrorBoundary>
      <div className="p-6 min-h-screen bg-gray-50">
        <h2 className="text-2xl font-bold mb-6 text-green-700">
          IoT-Enabled Agriculture: Notification Settings
        </h2>
        <p className="mb-4 text-gray-700">
          Manage your real-time notifications for updates from IoT sensors, such
          as soil moisture levels, temperature changes, or equipment status.
        </p>
        <div className="flex items-center gap-6">
          <span className="text-lg font-medium">
            Notifications:{" "}
            <span
              className={`${
                isNotificationOn ? "text-green-600" : "text-gray-500"
              }`}
            >
              {isNotificationOn ? "On" : "Off"}
            </span>
          </span>
          <button
            onClick={handleToggle}
            className={`px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 ${
              isNotificationOn
                ? "bg-green-500 hover:bg-green-600"
                : "bg-gray-500 hover:bg-gray-600"
            }`}
          >
            {isNotificationOn ? "Turn Off" : "Turn On"}
          </button>
        </div>

        {isNotificationOn && (
          <div className="mt-6 border-t pt-4">
            <h3 className="text-xl font-semibold mb-4 text-green-600">
              Recent Notifications
            </h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              {notifications.map((notification, index) => (
                <li key={index}>
                  <p>
                    <strong>Temperature:</strong> {notification.temperature}°C
                  </p>
                  <p>
                    <strong>Humidity:</strong> {notification.humidity}%
                  </p>
                  <p>
                    <strong>Rain Level:</strong> {notification.rain}mm
                  </p>
                  <p>
                    <strong>Moisture Level:</strong> {notification.moisture}%
                  </p>
                  <p>
                    <strong className="text-2xl">Water Status:</strong>{" "}
                    <span
                      className={`${
                        notification.waterStatus
                          ? "text-green-800 text-xl"
                          : "text-red-800 text-xl"
                      }`}
                    >
                      {notification.waterStatus ? "On" : "Off"}
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default Notification;
