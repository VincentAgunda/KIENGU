import React, { useState, useEffect, useMemo } from "react";
import { db, auth } from "../../firebase";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { FiHome, FiUsers, FiSettings, FiLogOut, FiFileText } from "react-icons/fi";

const AdminDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [users, setUsers] = useState([]); // Store logged-in users
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Fetch patients data
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "patients"), (snapshot) => {
      setPatients(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // Fetch active users in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const activeUsers = [];
      snapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData.isLoggedIn) {
          activeUsers.push({ id: doc.id, ...userData });
        }
      });
      setUsers(activeUsers);
    });
    return () => unsubscribe();
  }, []);

  // Handle window resize for mobile responsiveness
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsSidebarOpen(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Logout Current Admin
  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully!");
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  // Logout a specific user (Admin action)
  const logoutUser = async (userId) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { isLoggedIn: false });

      // Update local state to remove the logged-out user
      setUsers(users.filter((user) => user.id !== userId));

      alert("User logged out successfully.");
    } catch (error) {
      console.error("Error logging out user:", error);
    }
  };

  // Memoized Patients Table
  const PatientsTable = useMemo(() => (
    <div className="mt-8 bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Recommendation</th>
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
              <td className="p-3">{patient.recommendation || "N/A"}</td>
              <td className="p-3">{patient.billingAmount ? `$${patient.billingAmount}` : "N/A"}</td>
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
      <div
        className={`w-64 bg-white shadow-lg h-full p-6 transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ willChange: "transform" }}
      >
        <div className="flex items-center space-x-4 mb-6">
          <h2 className="text-lg font-semibold">Admin Panel</h2>
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
          <li
            className="flex items-center space-x-2 p-3 hover:bg-red-100 text-red-600 rounded-lg cursor-pointer"
            onClick={handleLogout}
          >
            <FiLogOut />
            <span>Logout</span>
          </li>
        </ul>
      </div>

      {/* ✅ Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold">Hi, Admin</h2>
            <button
              onClick={toggleSidebar}
              className="p-2 bg-gray-300 rounded-lg hover:bg-gray-400"
            >
              {isSidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
            </button>
          </div>

          {/* ✅ Patients Table */}
          {PatientsTable}

          {/* ✅ Active Users Table */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold">Active Users</h3>
            <div className="bg-white shadow-md rounded-lg overflow-hidden mt-4">
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
                        <button
                          onClick={() => logoutUser(user.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Log Out
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;