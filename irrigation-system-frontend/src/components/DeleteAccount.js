import React, { useState } from "react";
import { FaRegSadTear, FaExclamationCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function DeleteAccount() {
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState({
    dataLoss: false,
    agree: false,
  });

  const handleCheckboxChange = (e) => {
    setIsChecked({
      ...isChecked,
      [e.target.name]: e.target.checked,
    });
  };

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("You are not authorized to perform this action. Please log in.");
        navigate("/login");
        return;
      }

      // Call the deleteAccount endpoint
      await axios.delete("http://localhost:5000/api/account/deleteAccount", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Clear token and redirect to login page
      localStorage.removeItem("token");
      alert("Your account has been deleted successfully.");
      navigate("/login");
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center p-5">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-xl w-full">
        <h1 className="font-mono text-6xl text-center text-gray-800 mb-5">
          We are sorry to see you go!{" "}
          <FaRegSadTear className="inline-block text-red-500" />
        </h1>
        <h2 className="text-2xl text-center font-semibold text-gray-700 mb-6">
          Before you go...
        </h2>

        <div className="flex flex-col gap-4 mb-6">
          <label className="flex items-center text-gray-700">
            <input
              type="checkbox"
              name="dataLoss"
              checked={isChecked.dataLoss}
              onChange={handleCheckboxChange}
              className="mr-3 accent-red-500"
            />
            <span className="text-lg">
              If you delete your account, you will lose all your data!{" "}
              <FaExclamationCircle className="inline-block text-yellow-500" />
            </span>
          </label>
          <label className="flex items-center text-gray-700">
            <input
              type="checkbox"
              name="agree"
              checked={isChecked.agree}
              onChange={handleCheckboxChange}
              className="mr-3 accent-green-500"
            />
            <span className="text-lg">Agree to delete the account.</span>
          </label>
        </div>

        <div className="flex justify-between gap-5 pt-4">
          <button
            className="bg-green-500 text-white rounded-xl w-40 h-12 hover:bg-green-600 transition duration-300"
            onClick={() => navigate("/account")}
          >
            Back
          </button>
          <button
            className={`bg-red-700 text-white rounded-xl w-40 h-12 hover:bg-red-800 transition duration-300 ${
              !(isChecked.dataLoss && isChecked.agree) ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!(isChecked.dataLoss && isChecked.agree)}
            onClick={handleDeleteAccount}
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteAccount;
