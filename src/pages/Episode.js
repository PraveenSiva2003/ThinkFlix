import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db, auth } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import "./Episode.css";

const Episode = () => {
  const { id } = useParams();
  const [episode, setEpisode] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showId, episodeId] = id.split("_");

  console.log("🔍 useParams().id:", id);
  console.log("📦 Parsed showId:", showId);
  console.log("📦 Parsed episodeId:", episodeId);

  useEffect(() => {
    const fetchEpisode = async () => {
      const user = auth.currentUser;
      if (!user) {
        console.warn("⚠️ No user found.");
        return;
      }

      console.log("🧠 Fetching episode from Firebase...");

      try {
        const docRef = doc(
          db,
          "users",
          user.uid,
          "shows",
          showId,
          "episodes",
          episodeId
        );
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log("✅ Episode data fetched:", docSnap.data());
          setEpisode(docSnap.data());
        } else {
          console.warn("❌ No episode found.");
        }
      } catch (error) {
        console.error("🔥 Error loading episode:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEpisode();
  }, [showId, episodeId]);

  if (loading) return <h2 style={{ color: "white" }}>Loading...</h2>;
  if (!episode) return <h2 style={{ color: "white" }}>Episode not found.</h2>;

  return (
    <div className="episode-page">
      <h1 style={{ color: "lime", fontSize: "2rem" }}>EPISODE.JS ACTIVE ✅</h1>

      <h1>{episode.title || "Untitled Episode"}</h1>
      <h2 className="show-title">{episode.showTitle || "Untitled Show"}</h2>

      {episode.script && (
        <div className="script-section">
          <h3>🧠 Script</h3>
          <p>{episode.script}</p>
        </div>
      )}

      <div className="audio-player-wrapper">
        <h3>🎧 Listen</h3>
        {episode.audioUrl ? (
          <audio controls src={episode.audioUrl} />
        ) : (
          <p style={{ color: "gray" }}>No audio available for this episode.</p>
        )}
      </div>
    </div>
  );
};

export default Episode;
