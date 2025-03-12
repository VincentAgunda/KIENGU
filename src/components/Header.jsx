import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">KIENGU HMS</h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/admin" className="hover:text-blue-200">
                Admin
              </Link>
            </li>
            <li>
              <Link to="/receptionist" className="hover:text-blue-200">
                Receptionist
              </Link>
            </li>
            <li>
              <Link to="/doctor" className="hover:text-blue-200">
                Doctor
              </Link>
            </li>
            <li>
              <Link to="/cashier" className="hover:text-blue-200">
                Cashier
              </Link>
            </li>
            <li>
              <Link to="/lab" className="hover:text-blue-200">
                Lab
              </Link>
            </li>
            <li>
              <Link to="/pharmacy" className="hover:text-blue-200">
                Pharmacy
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;