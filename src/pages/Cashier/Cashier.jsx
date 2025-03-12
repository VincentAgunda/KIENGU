import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, query, onSnapshot, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { motion } from "framer-motion";

const Cashier = () => {
  const [patients, setPatients] = useState([]);
  const [billingAmount, setBillingAmount] = useState({});
  const [selectedOption, setSelectedOption] = useState({});

  useEffect(() => {
    const q = query(collection(db, "patients"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let patientsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // ✅ Show "waiting_for_cashier" patients first, then others
      patientsData.sort((a, b) => (a.status === "waiting_for_cashier" ? -1 : 1));

      setPatients(patientsData);
    });

    return () => unsubscribe();
  }, []);

  const handleSend = async (patientId) => {
    const amount = billingAmount[patientId];
    const destination = selectedOption[patientId];

    if (!amount || !destination) {
      alert("Please enter a billing amount and select a destination!");
      return;
    }

    await updateDoc(doc(db, "patients", patientId), {
      billingAmount: amount,
      status: destination === "Lab" ? "waiting_for_lab" : "waiting_for_pharmacy",
      billingTimestamp: serverTimestamp(),
    });

    alert(`Patient sent to ${destination}!`);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6">
      <h2 className="text-2xl font-bold mb-6">Cashier Page</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {patients.map((patient) => (
          <div key={patient.id} className="bg-white p-6 rounded-lg shadow-md">
            <p><strong>Name:</strong> {patient.name}</p>
            <p><strong>Recommendation:</strong> {patient.recommendation || "N/A"}</p>
            <p><strong>Status:</strong> {patient.status}</p>
            <p><strong>Billing Amount:</strong> {patient.billingAmount ? `$${patient.billingAmount}` : "N/A"}</p>

            {patient.status === "waiting_for_cashier" && (
              <>
                <input
                  type="number"
                  placeholder="Billing Amount"
                  value={billingAmount[patient.id] || ""}
                  onChange={(e) => setBillingAmount({ ...billingAmount, [patient.id]: e.target.value })}
                  className="w-full p-2 border rounded-lg mt-2"
                />

                <select
                  value={selectedOption[patient.id] || ""}
                  onChange={(e) => setSelectedOption({ ...selectedOption, [patient.id]: e.target.value })}
                  className="w-full p-2 border rounded-lg mt-2"
                >
                  <option value="">Select Destination</option>
                  <option value="Lab">Lab</option>
                  <option value="Pharmacy">Pharmacy</option>
                </select>

                <button
                  onClick={() => handleSend(patient.id)}
                  className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 mt-4 w-full"
                  disabled={!billingAmount[patient.id] || !selectedOption[patient.id]}
                >
                  Send to {selectedOption[patient.id] || "Lab/Pharmacy"}
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Cashier;
