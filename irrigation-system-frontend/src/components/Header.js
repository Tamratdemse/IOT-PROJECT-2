import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-gray-100 p-4 flex justify-between items-center shadow-md">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
          <Link to="viewprofile">
            <img
              src="/asset/farmer1.png"
              alt="User Profile"
              className="rounded-full w-full h-full object-cover"
            />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
