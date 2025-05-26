import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { auth } from "./firebase";
import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";

// Pages
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Generate from "./pages/Generate";
import Library from "./pages/Library";
import ShowPage from "./pages/ShowPage";
import Episode from "./pages/Episode";
import Pricing from "./pages/Pricing"; // ✅ Add this line to include Pricing page

// Components
import Navbar from "./components/Navbar";

import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Sign-in error:", error);
    }
  };

  return (
    <>
      <Navbar user={user} />

      <Routes>
        {/* Public */}
        <Route
          path="/"
          element={
            !user ? <Landing onSignIn={handleSignIn} /> : <Navigate to="/home" />
          }
        />
        <Route path="/pricing" element={<Pricing />} /> {/* ✅ Public Pricing Page */}

        {/* Authenticated Routes */}
        <Route path="/home" element={user ? <Home /> : <Navigate to="/" />} />
        <Route path="/generate" element={user ? <Generate /> : <Navigate to="/" />} />
        <Route path="/library" element={user ? <Library /> : <Navigate to="/" />} />
        <Route path="/show/:id" element={user ? <ShowPage /> : <Navigate to="/" />} />
        <Route path="/episode/:id" element={user ? <Episode /> : <Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
