import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

// Signup
export const signupUser = async (email, password, role) => {
  const res = await createUserWithEmailAndPassword(auth, email, password);

  await setDoc(doc(db, "users", res.user.uid), {
    email,
    role,
    isActive: true,
    createdAt: new Date()
  });

  return res.user;
};

// Login + active check
export const loginUser = async (email, password) => {
  const res = await signInWithEmailAndPassword(auth, email, password);

  const userDoc = await getDoc(doc(db, "users", res.user.uid));

  if (!userDoc.exists() || userDoc.data().isActive === false) {
    await signOut(auth);
    throw new Error("User account is inactive");
  }

  return res.user;
};

// Logout
export const logoutUser = async () => {
  await signOut(auth);
};
