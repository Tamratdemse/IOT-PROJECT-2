import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import WeatherForecast from "./WeatherForecast";
import { BASE_URL } from "../config/b_url";

const CropDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Extract location and name from query parameters
  const queryParams = new URLSearchParams(location.search);
  const cropLocation = queryParams.get("location"); // Get location from the URL query string
  const cropName = queryParams.get("name"); // Get name from the URL query string

  const [cropDetails, setCropDetails] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCropDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/arduino/${id}`);
        setCropDetails(response.data);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch crop details");
      }
    };

    fetchCropDetails();
  }, [id]);

  const handleNotificationClick = () => {
    navigate(`/notifications/${id}`);
  };

  if (error) {
    return <p className="text-center text-lg text-red-500">{error}</p>;
  }

  if (!cropDetails) {
    return <p className="text-center text-lg">Loading...</p>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-4xl font-bold text-gray-800 ">Crop Details</h2>
        <button
          onClick={handleNotificationClick}
          className=" bg-green-100  text-green-800 hover:text-lg"
        >
          <i className="fas fa-bell mr-2"></i> Notifications
        </button>
      </div>
      <div className="p-6">
        <WeatherForecast location={cropLocation} />{" "}
        {/* Pass the cropLocation here */}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="bg-white shadow-lg rounded-lg p-6 space-y-4">
          <p>
            <strong>Temperature:</strong> {cropDetails.temperature}°C
          </p>
          <p>
            <strong>Humidity:</strong> {cropDetails.humidity}%
          </p>
          <p>
            <strong>Rain Level:</strong> {cropDetails.rain}mm
          </p>
          <p>
            <strong>Moisture Level:</strong> {cropDetails.moisture}%
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 space-y-4">
          <h3 className="text-2xl font-bold mb-4">Field : {cropName}</h3>
          {cropDetails.fields &&
            cropDetails.fields.map((field) => (
              <div key={field._id} className="p-4 border rounded-lg">
                <p>
                  <strong>Field Name:</strong> {field.name}
                </p>
                <p>
                  <strong>Location:</strong>{" "}
                  {field.fieldNumber?.location || "Location not available"}
                </p>
                <p>
                  <strong>Area:</strong> {field.area}
                </p>
                <p>
                  <strong>Soil Type:</strong> {field.soilType}
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CropDetails;
