import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [availableRoles, setAvailableRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the appropriate dashboard when a role is selected
    if (selectedRole) {
      navigateToRole(selectedRole);
    }
  }, [selectedRole]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const roles = await getUserRoles(user.uid);
      if (!roles || roles.length === 0) {
        setError("No role assigned. Contact admin.");
      } else if (roles.length === 1) {
        // If user has only one role, navigate immediately
        setSelectedRole(roles[0]);
      } else {
        // If multiple roles, let the user choose
        setAvailableRoles(roles);
      }
    } catch (err) {
      setError("Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  const getUserRoles = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (!userDoc.exists()) return [];

      const userData = userDoc.data();
      return Array.isArray(userData.role) ? userData.role : [userData.role];
    } catch (error) {
      return [];
    }
  };

  const navigateToRole = (role) => {
    const roleRoutes = {
      admin: "/admin",
      receptionist: "/receptionist",
      doctor: "/doctor",
      cashier: "/cashier",
      lab: "/lab",
      pharmacy: "/pharmacy",
    };

    if (roleRoutes[role]) {
      navigate(roleRoutes[role]);
    } else {
      setError("Invalid role. Contact admin.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {isLoading && <p className="text-center text-blue-500">Logging in...</p>}

        {!isLoading && availableRoles.length > 0 ? (
          <div>
            <h3 className="text-center text-lg font-semibold mb-4">Select Your Role</h3>
            {availableRoles.map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700 my-2"
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            ))}
          </div>
        ) : (
          <form onSubmit={handleLogin}>
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
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
