import React, { useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { motion } from "framer-motion";

const Receptionist = () => {
  const [patientDetails, setPatientDetails] = useState({
    name: "",
    date: "",
    time: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "patients"), {
        ...patientDetails,
        status: "waiting_for_doctor",
        createdAt: serverTimestamp(),
      });
      alert("Patient sent to the doctor!");
      setPatientDetails({ name: "", date: "", time: "" });
    } catch (error) {
      console.error("Error adding patient:", error);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6">
      <h2 className="text-2xl font-bold mb-6">Receptionist Page</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Patient Name"
          value={patientDetails.name}
          onChange={(e) => setPatientDetails({ ...patientDetails, name: e.target.value })}
          className="w-full p-2 border rounded-lg"
          required
        />
        <input
          type="date"
          value={patientDetails.date}
          onChange={(e) => setPatientDetails({ ...patientDetails, date: e.target.value })}
          className="w-full p-2 border rounded-lg"
          required
        />
        <input
          type="time"
          value={patientDetails.time}
          onChange={(e) => setPatientDetails({ ...patientDetails, time: e.target.value })}
          className="w-full p-2 border rounded-lg"
          required
        />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">
          Send to Doctor
        </button>
      </form>
    </motion.div>
  );
};

export default Receptionist;
