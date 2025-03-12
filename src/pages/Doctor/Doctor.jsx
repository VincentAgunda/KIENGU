import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, query, updateDoc, doc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { motion } from "framer-motion";

const Doctor = () => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "patients")); // ✅ Listen to all patients in real time

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let fetchedPatients = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      // ✅ Show "waiting_for_doctor" patients first
      fetchedPatients.sort((a, b) => (a.status === "waiting_for_doctor" ? -1 : 1));

      setPatients(fetchedPatients);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  const handleSendToCashier = async (patientId) => {
    const patient = patients.find((p) => p.id === patientId);

    if (!patient.diagnosis || (!patient.medicine && !patient.injection)) {
      alert("Please enter a diagnosis and at least one treatment (medicine or injection).");
      return;
    }

    await updateDoc(doc(db, "patients", patientId), {
      status: "waiting_for_cashier",
      nextStep: patient.nextStep || "pharmacy",
      updatedAt: serverTimestamp(),
    });

    alert("Patient sent to Cashier!");
  };

  // ✅ Update Firestore in real time when input changes
  const handleUpdatePatient = async (patientId, field, value) => {
    await updateDoc(doc(db, "patients", patientId), { [field]: value, updatedAt: serverTimestamp() });

    // ✅ Update local state so UI changes instantly
    setPatients((prev) =>
      prev.map((p) => (p.id === patientId ? { ...p, [field]: value, updatedAt: new Date() } : p))
    );
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6">
      <h2 className="text-2xl font-bold mb-6">Doctor Dashboard</h2>

      {/* ✅ Responsive Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {patients.map((patient) => (
          <div key={patient.id} className="bg-white p-6 rounded-lg shadow-md">
            <p><strong>Name:</strong> {patient.name}</p>
            <p><strong>Status:</strong> 
              <span className={patient.status === "waiting_for_cashier" ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                {patient.status === "waiting_for_cashier" ? "Sent" : "Pending"}
              </span>
            </p>
            <p><strong>Last Updated:</strong> {patient.updatedAt ? new Date(patient.updatedAt.seconds * 1000).toLocaleString() : "N/A"}</p>

            <textarea
              placeholder="Enter diagnosis"
              value={patient.diagnosis || ""}
              onChange={(e) => handleUpdatePatient(patient.id, "diagnosis", e.target.value)}
              className="w-full p-2 border rounded-lg mt-2"
            />

            <input
              type="text"
              placeholder="Medicine to be issued"
              value={patient.medicine || ""}
              onChange={(e) => handleUpdatePatient(patient.id, "medicine", e.target.value)}
              className="w-full p-2 border rounded-lg mt-2"
            />

            <input
              type="text"
              placeholder="Injection to be administered"
              value={patient.injection || ""}
              onChange={(e) => handleUpdatePatient(patient.id, "injection", e.target.value)}
              className="w-full p-2 border rounded-lg mt-2"
            />

            <label className="block mt-3 font-semibold">Send patient to:</label>
            <select
              value={patient.nextStep || "pharmacy"}
              onChange={(e) => handleUpdatePatient(patient.id, "nextStep", e.target.value)}
              className="w-full p-2 border rounded-lg mt-2"
            >
              <option value="pharmacy">Pharmacy</option>
              <option value="lab">Lab</option>
            </select>

            <button
              onClick={() => handleSendToCashier(patient.id)}
              className={`w-full p-2 rounded-lg mt-4 ${patient.status === "waiting_for_cashier" ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}
              disabled={patient.status === "waiting_for_cashier"}
            >
              {patient.status === "waiting_for_cashier" ? "Sent" : "Send to Cashier"}
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Doctor;
