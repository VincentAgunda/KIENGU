import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { motion } from "framer-motion";

const Lab = () => {
  const [patients, setPatients] = useState([]);
  const [testResults, setTestResults] = useState({});

  useEffect(() => {
    const fetchPatients = async () => {
      const q = query(collection(db, "patients"), where("status", "==", "waiting_for_lab"));
      const querySnapshot = await getDocs(q);
      setPatients(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchPatients();
  }, []);

  const handleCompleteTest = async (patientId) => {
    if (!testResults[patientId]) {
      alert("Please enter test results!");
      return;
    }
    await updateDoc(doc(db, "patients", patientId), {
      testResults: testResults[patientId],
      status: "completed",
    });
    alert("Test completed and recorded!");
    setPatients(patients.filter((p) => p.id !== patientId));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6">
      <h2 className="text-2xl font-bold mb-6">Lab Page</h2>
      {patients.map((patient) => (
        <div key={patient.id} className="bg-white p-6 rounded-lg shadow-md mb-4">
          <p><strong>Name:</strong> {patient.name}</p>
          <p><strong>Billing Amount:</strong> ${patient.billingAmount}</p>
          <textarea
            placeholder="Enter Test Results"
            value={testResults[patient.id] || ""}
            onChange={(e) => setTestResults({ ...testResults, [patient.id]: e.target.value })}
            className="w-full p-2 border rounded-lg"
          />
          <button onClick={() => handleCompleteTest(patient.id)}
            className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 mt-4">
            Complete Test
          </button>
        </div>
      ))}
    </motion.div>
  );
};

export default Lab;
