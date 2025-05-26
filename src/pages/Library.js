import React, { useEffect, useState } from "react";
import "./Library.css";
import { Link } from "react-router-dom";
import { db, auth } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

const Library = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShows = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const showsRef = collection(db, "users", user.uid, "shows");
        const snapshot = await getDocs(showsRef);
        const userShows = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setShows(userShows);
      } catch (err) {
        console.error("Failed to fetch shows:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, []);

  const handleDelete = async (showId) => {
    const user = auth.currentUser;
    if (!user) return;
    if (!window.confirm("Are you sure you want to delete this episode?")) return;

    try {
      await deleteDoc(doc(db, "users", user.uid, "shows", showId));
      setShows(shows.filter((show) => show.id !== showId));
    } catch (err) {
      console.error("Failed to delete show:", err);
      alert("Error deleting show.");
    }
  };

  return (
    <div className="library-page">
      <h1 className="library-title">🎞️ Your Shows</h1>

      {loading ? (
        <p style={{ color: "white", textAlign: "center" }}>Loading...</p>
      ) : shows.length === 0 ? (
        <p style={{ color: "white", textAlign: "center" }}>
          You haven't created any shows yet.
        </p>
      ) : (
        <div className="show-grid">
          {shows.map((show) => (
            <div key={show.id} className="show-card">
              <Link to={`/show/${show.id}`}>
                <div className="thumbnail-wrapper">
                  <img
                    src={show.coverUrl || `/${show.style?.toLowerCase()}-style.png`}
                    alt={show.title}
                    className="show-thumbnail"
                  />
                  <img
                    src="/logo.png"
                    alt="Thinkflix Logo"
                    className="logo-overlay"
                  />
                </div>
              </Link>

              <button className="delete-button" onClick={() => handleDelete(show.id)}>
                ✖
              </button>

              <h3 className="show-title">{show.title}</h3>

              {show.audioUrl && (
                <audio controls src={show.audioUrl} className="audio-player" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Library;
