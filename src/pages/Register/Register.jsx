import React, { useState } from "react";
import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("receptionist"); // Default role
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 🔎 Check if a user already exists for this role (except admin)
      if (role !== "admin") {
        const roleQuery = query(collection(db, "users"), where("role", "==", role));
        const roleSnapshot = await getDocs(roleQuery);
        if (!roleSnapshot.empty) {
          setError(`A user is already registered as ${role}.`);
          setLoading(false);
          return;
        }
      }

      // 🔐 Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("✅ User registered:", user.uid);

      // 📌 Save user details in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: role,
        isLoggedIn: false,
        createdAt: new Date().toISOString(),
      });

      console.log("✅ User document created in Firestore");

      // ✅ Redirect to login page
      navigate("/login");
    } catch (err) {
      console.error("❌ Registration error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleRegister}>
          {/* 🔹 Email Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          {/* 🔹 Password Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-lg"
              required
              minLength={6} // Ensure password meets Firebase requirements
            />
          </div>

          {/* 🔹 Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="admin">Admin</option>
              <option value="receptionist">Receptionist</option>
              <option value="doctor">Doctor</option>
              <option value="cashier">Cashier</option>
              <option value="lab">Lab</option>
              <option value="pharmacy">Pharmacy</option>
            </select>
          </div>

          {/* 🔹 Register Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;