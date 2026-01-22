import { db } from "./firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// Post Job
export const postJob = async (jobData) => {
  return await addDoc(collection(db, "jobs"), {
    ...jobData,
    createdAt: serverTimestamp()
  });
};

// Save proposal URL
export const saveProposal = async (data) => {
  return await addDoc(collection(db, "proposals"), {
    ...data,
    submittedAt: serverTimestamp()
  });
};

// Save SLA URL
export const saveSLA = async (data) => {
  return await addDoc(collection(db, "sla_agreements"), {
    ...data,
    signedAt: serverTimestamp()
  });
};
