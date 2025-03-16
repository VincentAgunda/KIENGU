import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Receptionist from "./pages/Receptionist/Receptionist";
import Doctor from "./pages/Doctor/Doctor";
import Cashier from "./pages/Cashier/Cashier";
import Lab from "./pages/Lab/Lab";
import Pharmacy from "./pages/Pharmacy/Pharmacy";
import Admin from "./pages/Admin/Admin";
import AddUser from "./pages/Admin/AddUser";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthProvider"; // Make sure AuthProvider exists

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <div className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute role="receptionist" />}>
                <Route path="/receptionist" element={<Receptionist />} />
              </Route>
              <Route element={<ProtectedRoute role="doctor" />}>
                <Route path="/doctor" element={<Doctor />} />
              </Route>
              <Route element={<ProtectedRoute role="cashier" />}>
                <Route path="/cashier" element={<Cashier />} />
              </Route>
              <Route element={<ProtectedRoute role="lab" />}>
                <Route path="/lab" element={<Lab />} />
              </Route>
              <Route element={<ProtectedRoute role="pharmacy" />}>
                <Route path="/pharmacy" element={<Pharmacy />} />
              </Route>
              <Route element={<ProtectedRoute role="admin" />}>
                <Route path="/admin" element={<Admin />} />
                <Route path="/add-user" element={<AddUser />} />
              </Route>

              {/* Default Route */}
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
