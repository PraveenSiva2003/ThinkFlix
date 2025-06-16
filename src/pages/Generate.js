import "./Generate.css";
import React, { useState } from "react";
import { auth, db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const isDev = window.location.hostname === "localhost";
const backendUrl = isDev
  ? "http://localhost:8080" // ✅ updated from 5000 to 8080
  : "https://thinkflix.onrender.com";

function formatTitle(filename) {
  const raw = filename.replace(/\.[^/.]+$/, "");
  const cleaned = raw
    .replace(/[_-]/g, " ")
    .replace(/\b([A-Z]{2,})\d{3}\b/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();

  const titleCased = cleaned
    .toLowerCase()
    .replace(/(^\w|\s\w)/g, (match) => match.toUpperCase());

  return titleCased.length >= 5 ? titleCased : "Untold Lessons: The Hidden Truth";
}

const Generate = () => {
  const [audioSrc, setAudioSrc] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [scriptData, setScriptData] = useState(null);
  const [coverUrl, setCoverUrl] = useState("");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      setUploadedFileName(file.name);
    }
  };

  const generateScript = async () => {
    if (!uploadedFile) return alert("Please upload a file.");
    if (!selectedStyle) return alert("Please select a show style.");

    setIsGenerating(true);
    try {
      const formData = new FormData();
      formData.append("file", uploadedFile);
      formData.append("style", selectedStyle);

      console.log("📤 Sending request to:", `${backendUrl}/generate_script`);

      const res = await fetch(`${backendUrl}/generate_script`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Script generation failed: ${res.status} - ${text}`);
      }

      const data = await res.json();
      setScriptData(data);
      setCoverUrl(data.coverUrl);
      alert("✅ Script generated! Ready to generate audio.");
    } catch (err) {
      console.error("❌ Script error:", err);
      alert("Error generating script. Check your backend server and console for more info.");
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAudio = async () => {
    if (!scriptData || !scriptData.script)
      return alert("No script to generate audio from");

    setIsGenerating(true);
    try {
      const res = await fetch(`${backendUrl}/generate_audio`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script: scriptData.script }),
      });

      if (!res.ok) throw new Error("Audio generation failed");

      const audioBlob = await res.blob();
      const audioURL = URL.createObjectURL(audioBlob);
      setAudioSrc(audioURL);

      const user = auth.currentUser;
      const finalTitle =
        scriptData.title && scriptData.title.length > 5
          ? scriptData.title
          : formatTitle(uploadedFileName);

      if (user && scriptData?.script) {
        const showData = {
          title: finalTitle,
          style: selectedStyle,
          coverUrl: coverUrl || `/${selectedStyle.toLowerCase()}-style.png`,
          script: scriptData.script
            .map((line) => `${line.speaker}: ${line.dialogue}`)
            .join("\n"),
          audioUrl: audioURL,
          createdAt: new Date(),
        };

        await addDoc(collection(db, "users", user.uid, "shows"), showData);
        alert("📚 Your show has been saved to your Library!");
      }
    } catch (err) {
      console.error("❌ Audio error:", err);
      alert("Error generating audio. Check console for more info.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="generate-page">
      <h1 className="page-title">🎬 Generate Your Educational Show</h1>

      <div className="upload-section">
        <h2>Upload Your Educational Content</h2>
        <label className="file-upload">
          Upload File
          <input type="file" onChange={handleFileUpload} hidden />
        </label>
        {uploadedFileName && (
          <p className="file-status">Uploaded: {uploadedFileName}</p>
        )}
      </div>

      <div className="style-selection">
        <h2>Select Your Show Style</h2>
        <div className="style-options">
          {["Spongebob", "Anime", "Simpsons"].map((style) => (
            <img
              key={style}
              src={`/${style.toLowerCase()}-style.png`}
              alt={style}
              className={`style-image ${
                selectedStyle === style ? "selected" : ""
              } ${style === "Simpsons" ? "simpsons-style" : ""} ${
                style === "Anime" ? "anime-style" : ""
              }`}
              onClick={() => setSelectedStyle(style)}
            />
          ))}
        </div>
      </div>

      <div className="audio-section">
        <h2>🧠 Generate an AI-Powered Script</h2>
        <button
          className="generate-btn"
          onClick={generateScript}
          disabled={isGenerating}
        >
          {isGenerating ? "Generating..." : "Generate AI Script"}
        </button>

        {scriptData && (
          <>
            <div className="script-container">
              {scriptData.script.map((line, idx) => (
                <div key={idx} className="script-line">
                  <span className="speaker-name">{line.speaker}:</span>
                  <span className="dialogue-text"> {line.dialogue}</span>
                </div>
              ))}
            </div>

            <h2>🎧 Generate AI Audio</h2>
            <button
              className="play-audio-btn"
              onClick={generateAudio}
              disabled={isGenerating}
            >
              {isGenerating ? "Generating..." : "Generate AI Audio"}
            </button>
            {audioSrc && (
              <audio controls src={audioSrc} className="audio-player" />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Generate;
