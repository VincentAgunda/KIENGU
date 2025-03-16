import React, { useState, useEffect, useMemo } from "react";
import { db, auth } from "../../firebase";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { FiHome, FiUsers, FiSettings, FiLogOut, FiFileText, FiUserPlus, FiMenu, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [users, setUsers] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Fetch patients data
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "patients"), (snapshot) => {
      setPatients(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // Fetch authenticated users (real-time updates)
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const activeUsers = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((user) => user.isLoggedIn);

      setUsers(activeUsers);
    });

    return () => unsubscribe();
  }, []);

  // Logout a specific user
  const logoutUser = async (userId) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { isLoggedIn: false });
      setUsers(users.filter((user) => user.id !== userId));
      alert("User logged out successfully.");
    } catch (error) {
      console.error("Error logging out user:", error);
    }
  };

  // Logout Admin
  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully!");
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  // Patients Table
  const PatientsTable = useMemo(() => (
    <div className="mt-8 bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Diagnosis</th>
            <th className="p-3 text-left">Billing</th>
            <th className="p-3 text-left">Test Results</th>
            <th className="p-3 text-left">Medication</th>
            <th className="p-3 text-left">Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient, index) => (
            <tr key={patient.id} className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} border-b`}>
              <td className="p-3">{patient.name}</td>
              <td className="p-3">
                <span className={`px-2 py-1 text-sm font-semibold rounded ${patient.status === "completed" ? "bg-green-200 text-green-700" : "bg-yellow-200 text-yellow-700"}`}>
                  {patient.status}
                </span>
              </td>
              <td className="p-3">{patient.diagnosis || "N/A"}</td>
              <td className="p-3">{patient.billingAmount ? `ksh ${patient.billingAmount}` : "N/A"}</td>
              <td className="p-3">{patient.testResults || "N/A"}</td>
              <td className="p-3">{patient.medication || "N/A"}</td>
              <td className="p-3">
                {patient.updatedAt ? new Date(patient.updatedAt.seconds * 1000).toLocaleString() : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ), [patients]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* ✅ Sidebar */}
      <motion.div
        initial={{ x: isSidebarOpen ? 0 : -250 }}
        animate={{ x: isSidebarOpen ? 0 : -250 }}
        transition={{ duration: 0.3 }}
        className={`w-64 bg-white shadow-lg h-full p-6 fixed md:relative transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Admin Panel</h2>
          {/* Close Sidebar Button */}
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-600">
            <FiX size={24} />
          </button>
        </div>

        <ul className="space-y-4">
          <li className="flex items-center space-x-2 p-3 bg-gray-200 rounded-lg cursor-pointer">
            <FiHome className="text-gray-600" />
            <span>Dashboard</span>
          </li>
          <li className="flex items-center space-x-2 p-3 hover:bg-gray-100 rounded-lg cursor-pointer">
            <FiUsers className="text-gray-600" />
            <span>Patients</span>
          </li>
          <li className="flex items-center space-x-2 p-3 hover:bg-gray-100 rounded-lg cursor-pointer">
            <FiFileText className="text-gray-600" />
            <span>Invoices</span>
          </li>
          <li className="flex items-center space-x-2 p-3 hover:bg-gray-100 rounded-lg cursor-pointer">
            <FiSettings className="text-gray-600" />
            <span>Settings</span>
          </li>
          {/* ✅ Add User Button with Framer Motion */}
          <motion.li
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
            onClick={() => navigate("/add-user")}
          >
            <FiUserPlus className="text-gray-600" />
            <span>Add User</span>
          </motion.li>
          <li
            className="flex items-center space-x-2 p-3 hover:bg-red-100 text-red-600 rounded-lg cursor-pointer"
            onClick={handleLogout}
          >
            <FiLogOut />
            <span>Logout</span>
          </li>
        </ul>
      </motion.div>

      {/* ✅ Main Content */}
      <div className="flex-1 overflow-y-auto p-8 ml-64 md:ml-0">
        {/* Show Sidebar Button */}
        {!isSidebarOpen && (
          <button onClick={() => setIsSidebarOpen(true)} className="md:hidden fixed top-4 left-4 bg-white shadow p-2 rounded-full">
            <FiMenu size={24} />
          </button>
        )}

        <h2 className="text-3xl font-bold mb-6">Hi, Admin</h2>

        {/* ✅ Patients Table */}
        {PatientsTable}

        {/* ✅ Active Users Table */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Active Users</h3>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.role}</td>
                    <td className="p-3">
                      <button onClick={() => logoutUser(user.id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Log Out</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
