import { auth } from "./firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

// Sign Up with Email & Password
export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Sign-up Error:", error.message);
    throw error;
  }
};

// Sign In with Email & Password
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Sign-in Error:", error.message);
    throw error;
  }
};

// Google Sign-In
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    return userCredential.user;
  } catch (error) {
    console.error("Google Sign-in Error:", error.message);
    throw error;
  }
};

// Logout
export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Sign-out Error:", error.message);
    throw error;
  }
};

// Listen for Auth State Changes (Optional but Useful)
export const authStateListener = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Export `auth` so it can be used in other components (Fixes the "auth not defined" error)
export { auth };
