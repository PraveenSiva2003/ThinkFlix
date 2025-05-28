import React from "react";
import { Link } from "react-router-dom";
import "./Landing.css"; // ✅ Make sure this file exists in /src

const showStyles = [
  {
    title: "SpongeBob Style",
    video: "/clips/spongebob.mp4",
  },
  {
    title: "Naruto Style",
    video: "/clips/naruto.mp4",
  },
  {
    title: "Simpsons Style",
    video: "/clips/simpsons.mp4",
  },
];

const Landing = ({ onSignIn }) => {
  return (
    <div className="landing-container">
      {/* Hero Title */}
      <div className="hero-header">
        <h1 className="hero-title">THINKFLIX</h1>
        <p className="hero-subtext">
          Turn your schoolwork into binge-worthy shows.{" "}
          <span className="highlighted-text">AI-powered. Style-driven.</span>
        </p>
      </div>

      {/* Horizontal Card Row */}
      <div className="card-row">
        {showStyles.map((style, index) => (
          <div key={index} className="style-card">
            <video
              src={style.video}
              autoPlay
              loop
              muted
              playsInline
              className="style-video"
            />
            <div className="style-card-title">{style.title}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="cta-section">
        <button className="cta-button" onClick={onSignIn}>
          Sign in with Google
        </button>
        <div>
          <Link to="/pricing" className="pricing-link">
            View Pricing
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
