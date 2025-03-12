import React, { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { db } from "../firebase";
import { doc, getDoc, updateDoc, collection, getDocs } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [users, setUsers] = useState([]); // Store all users for Admin view
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      
      if (user) {
        setCurrentUser(user);
        
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role || "user"); 
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setUserRole("user");
        }
      } else {
        setCurrentUser(null);
        setUserRole(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch all users if the current user is Admin
  useEffect(() => {
    if (userRole === "admin") {
      const fetchUsers = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, "users"));
          setUsers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };

      fetchUsers();
    }
  }, [userRole]);

  // Function to log out a specific user
  const logoutUser = async (userId) => {
    try {
      await updateDoc(doc(db, "users", userId), { isLoggedIn: false });
      setUsers(users.map(user => (user.id === userId ? { ...user, isLoggedIn: false } : user)));
    } catch (error) {
      console.error("Error logging out user:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, userRole, users, loading, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
