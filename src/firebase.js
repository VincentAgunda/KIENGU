import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

// ✅ Firebase configuration using environment variables (with fallback)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "your-default-api-key",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "your-default-auth-domain",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "your-default-project-id",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "your-default-storage-bucket",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "your-default-messaging-sender-id",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "your-default-app-id",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "",
};

// ✅ Warn if essential Firebase credentials are missing
if (!process.env.REACT_APP_FIREBASE_API_KEY) {
  console.warn("⚠️ Firebase API Key is missing. Check your .env file.");
}

// ✅ Initialize Firebase
console.log("Initializing Firebase...");
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Set authentication persistence (ensures user session persists)
setPersistence(auth, browserSessionPersistence)
  .then(() => console.log("✅ Firebase Auth persistence set to 'session'"))
  .catch((error) => console.error("❌ Error setting Firebase persistence:", error));

// ✅ Initialize Analytics (if supported)
let analytics;
isSupported()
  .then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
      console.log("✅ Firebase Analytics initialized.");
    } else {
      console.log("ℹ️ Firebase Analytics not supported on this device.");
    }
  })
  .catch((error) => console.error("❌ Analytics initialization error:", error));

export { app, auth, db, analytics };
