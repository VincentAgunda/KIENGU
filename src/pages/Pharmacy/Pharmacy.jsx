import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, query, where, updateDoc, doc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { motion } from "framer-motion";

const Pharmacy = () => {
  const [patients, setPatients] = useState([]);
  const [medication, setMedication] = useState({});

  useEffect(() => {
    const fetchPatients = () => {
      const q = query(collection(db, "patients"), where("status", "in", ["waiting_for_pharmacy", "completed"]));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        let sortedPatients = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => {
            // ✅ Sort: Show "waiting_for_pharmacy" patients first, then "completed"
            if (a.status === "waiting_for_pharmacy" && b.status === "completed") return -1;
            if (a.status === "completed" && b.status === "waiting_for_pharmacy") return 1;
            return (b.dispensedAt?.seconds || 0) - (a.dispensedAt?.seconds || 0); // Newest on top
          });

        setPatients(sortedPatients);
      });

      return () => unsubscribe();
    };

    fetchPatients();
  }, []);

  const handleDispenseMedication = async (patientId) => {
    if (!medication[patientId]) {
      alert("Please enter medication details!");
      return;
    }

    await updateDoc(doc(db, "patients", patientId), {
      medication: medication[patientId],
      status: "completed",
      dispensedAt: serverTimestamp(),
    });

    alert("Medication dispensed!");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6">
      <h2 className="text-2xl font-bold mb-6">Pharmacy Page</h2>

      {patients.length === 0 && <p>No patients waiting.</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {patients.map((patient) => (
          <div key={patient.id} className="bg-white p-6 rounded-lg shadow-md">
            <p><strong>Name:</strong> {patient.name}</p>
            <p><strong>Billing Amount:</strong> ${patient.billingAmount || "N/A"}</p>
            <p>
              <strong>Status:</strong>{" "}
              <span className={patient.status === "completed" ? "text-green-600 font-bold" : "text-yellow-600 font-bold"}>
                {patient.status === "completed" ? "Completed" : "Pending"}
              </span>
            </p>
            <p><strong>Last Updated:</strong> {patient.dispensedAt ? new Date(patient.dispensedAt.seconds * 1000).toLocaleString() : "N/A"}</p>

            {patient.status === "waiting_for_pharmacy" && (
              <>
                <textarea
                  placeholder="Enter Medication"
                  value={medication[patient.id] || ""}
                  onChange={(e) => setMedication({ ...medication, [patient.id]: e.target.value })}
                  className="w-full p-2 border rounded-lg mt-2"
                />
                <button
                  onClick={() => handleDispenseMedication(patient.id)}
                  className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 mt-4 w-full"
                >
                  Dispense Medication
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Pharmacy;
