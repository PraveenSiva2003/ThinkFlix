import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase";
import "./ShowPage.css";

const ShowPage = () => {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShow = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const showRef = doc(db, "users", user.uid, "shows", id);
        const showSnap = await getDoc(showRef);

        if (showSnap.exists()) {
          setShow({ id: showSnap.id, ...showSnap.data() });

          // Fetch all episodes
          const episodesSnapshot = await getDocs(
            collection(db, "users", user.uid, "shows", id, "episodes")
          );

          const episodesList = episodesSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setEpisodes(episodesList);
        } else {
          setShow(null);
        }
      } catch (err) {
        console.error("❌ Error fetching show:", err);
        setShow(null);
      } finally {
        setLoading(false);
      }
    };

    fetchShow();
  }, [id]);

  if (loading) return <p style={{ color: "white" }}>Loading...</p>;
  if (!show) return <h2 style={{ color: "white" }}>Show not found.</h2>;

  return (
    <div className="show-page">
      <div className="show-header">
        <img src={show.thumbnail} alt={show.title} className="show-cover" />
        <h1>{show.title}</h1>
      </div>

      <div className="episode-list">
        <h2>📺 Episodes</h2>
        <div className="episode-grid">
          {episodes.map((ep) => (
            <Link
              to={`/episode/${id}_${ep.id}`}
              key={ep.id}
              className="episode-card"
            >
              {ep.coverImageUrl && (
                <img
                  src={ep.coverImageUrl}
                  alt={ep.title}
                  className="episode-thumb"
                />
              )}
              <div className="episode-info">
                <h3>{ep.title}</h3>
                <p>{ep.script?.slice(0, 100)}...</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShowPage;
