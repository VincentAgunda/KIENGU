import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";

const Header = () => {
  const navigate = useNavigate();
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

  // Navigate & Close Menus
  const handleNavigation = (path) => {
    navigate(path);
    setShowMobileMenu(false);
    setShowProfileMenu(false); // Close profile menu
  };

  return (
    <header className="bg-[#26676E] text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo - Navigates to Home */}
        <h1 className="text-3xl font-bold flex flex-col text-center cursor-pointer" onClick={() => navigate("/")}>
          <span className="text-[#E6B4AA] text-3xl">KIENGU</span>
          <span className="text-black text-sm font-normal">HMS</span>
        </h1>

        {/* Desktop Navigation + Profile Icon */}
        <div className="hidden md:flex items-center space-x-6">
          <nav className="flex space-x-4">
            <button onClick={() => navigate("/admin")} className="hover:text-blue-200">Admin</button>
            <button onClick={() => navigate("/receptionist")} className="hover:text-blue-200">Receptionist</button>
            <button onClick={() => navigate("/doctor")} className="hover:text-blue-200">Doctor</button>
            <button onClick={() => navigate("/cashier")} className="hover:text-blue-200">Cashier</button>
            <button onClick={() => navigate("/lab")} className="hover:text-blue-200">Lab</button>
            <button onClick={() => navigate("/pharmacy")} className="hover:text-blue-200">Pharmacy</button>
          </nav>

          {/* Profile Dropdown */}
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
                    <button
                      onClick={() => handleNavigation("/login")}
                      className="block px-4 py-2 hover:bg-gray-100 rounded-md w-full text-left"
                    >
                      Login
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleNavigation("/register")}
                      className="block px-4 py-2 hover:bg-gray-100 rounded-md w-full text-left"
                    >
                      Register
                    </button>
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
                    <button
                      onClick={() => handleNavigation("/login")}
                      className="block px-4 py-2 hover:bg-gray-100 rounded-md w-full text-left"
                    >
                      Login
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleNavigation("/register")}
                      className="block px-4 py-2 hover:bg-gray-100 rounded-md w-full text-left"
                    >
                      Register
                    </button>
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
            <button onClick={() => handleNavigation("/admin")} className="block hover:text-blue-300">Admin</button>
            <button onClick={() => handleNavigation("/receptionist")} className="block hover:text-blue-300">Receptionist</button>
            <button onClick={() => handleNavigation("/doctor")} className="block hover:text-blue-300">Doctor</button>
            <button onClick={() => handleNavigation("/cashier")} className="block hover:text-blue-300">Cashier</button>
            <button onClick={() => handleNavigation("/lab")} className="block hover:text-blue-300">Lab</button>
            <button onClick={() => handleNavigation("/pharmacy")} className="block hover:text-blue-300">Pharmacy</button>
          </nav>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
