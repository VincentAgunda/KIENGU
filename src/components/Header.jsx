import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";

const Header = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const menuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setShowMobileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close one dropdown if another opens
  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
    setShowMobileMenu(false);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
    setShowProfileMenu(false);
  };

  return (
    <header className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">KIENGU HMS</h1>

        {/* Desktop Navigation + Profile Icon */}
        <div className="hidden md:flex items-center space-x-6">
          <nav className="flex space-x-4">
            <Link to="/admin" className="hover:text-blue-200">Admin</Link>
            <Link to="/receptionist" className="hover:text-blue-200">Receptionist</Link>
            <Link to="/doctor" className="hover:text-blue-200">Doctor</Link>
            <Link to="/cashier" className="hover:text-blue-200">Cashier</Link>
            <Link to="/lab" className="hover:text-blue-200">Lab</Link>
            <Link to="/pharmacy" className="hover:text-blue-200">Pharmacy</Link>
          </nav>

          {/* Profile Dropdown (Visible on Desktop too) */}
          <div className="relative" ref={menuRef}>
            <button onClick={toggleProfileMenu} className="ml-4">
              <FaUserCircle size={28} />
            </button>

            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-40 bg-white text-black rounded-lg shadow-xl border border-gray-200"
              >
                <ul className="py-2">
                  <li>
                    <Link
                      to="/login"
                      className="block px-4 py-2 hover:bg-gray-100 rounded-md"
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      className="block px-4 py-2 hover:bg-gray-100 rounded-md"
                    >
                      Register
                    </Link>
                  </li>
                </ul>
              </motion.div>
            )}
          </div>
        </div>

        {/* Mobile Icons: Menu + Profile */}
        <div className="md:hidden flex items-center space-x-4">
          {/* Profile Dropdown */}
          <div className="relative" ref={menuRef}>
            <button onClick={toggleProfileMenu}>
              <FaUserCircle size={28} />
            </button>

            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-40 bg-white text-black rounded-lg shadow-xl border border-gray-200"
              >
                <ul className="py-2">
                  <li>
                    <Link
                      to="/login"
                      className="block px-4 py-2 hover:bg-gray-100 rounded-md"
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      className="block px-4 py-2 hover:bg-gray-100 rounded-md"
                    >
                      Register
                    </Link>
                  </li>
                </ul>
              </motion.div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={toggleMobileMenu}>
            {showMobileMenu ? <FaTimes size={28} /> : <FaBars size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          className="fixed top-0 left-0 w-2/3 h-full bg-blue-800 text-white p-6 shadow-lg md:hidden rounded-r-xl"
          ref={mobileMenuRef}
        >
          <button className="absolute top-4 right-4" onClick={toggleMobileMenu}>
            <FaTimes size={24} />
          </button>
          <nav className="mt-10 space-y-4">
            <Link to="/admin" className="block hover:text-blue-300">Admin</Link>
            <Link to="/receptionist" className="block hover:text-blue-300">Receptionist</Link>
            <Link to="/doctor" className="block hover:text-blue-300">Doctor</Link>
            <Link to="/cashier" className="block hover:text-blue-300">Cashier</Link>
            <Link to="/lab" className="block hover:text-blue-300">Lab</Link>
            <Link to="/pharmacy" className="block hover:text-blue-300">Pharmacy</Link>
          </nav>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
