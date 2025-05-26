import { db } from "../firebase";
import { doc, setDoc, collection, addDoc } from "firebase/firestore";

export const addShowToFirestore = async (userId, showData) => {
  try {
    // Create new show document in user's collection
    const showRef = await addDoc(collection(db, "users", userId, "shows"), {
      title: showData.title,
      style: showData.style,
      thumbnail: showData.thumbnail,
      createdAt: new Date(),
      lastWatched: {
        episodeId: "episode1",
        timestamp: new Date(),
      },
    });

    // Create the first episode inside subcollection "episodes"
    const episodeRef = doc(
      db,
      "users",
      userId,
      "shows",
      showRef.id,
      "episodes",
      "episode1"
    );

    await setDoc(episodeRef, {
      title: showData.episodeTitle,
      script: showData.script,
      audioUrl: showData.audioUrl,
    });

    return showRef.id;
  } catch (error) {
    console.error("🔥 Error saving show:", error);
    return null;
  }
};
