import React from "react";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <section className="hero-section">
        <h1 className="hero-title">Revolutionizing Education, One Show at a Time</h1>
        <p className="hero-subtitle">
          Welcome to ThinkFlix — the AI-powered learning platform where textbooks become binge-worthy shows.
        </p>
      </section>

      <div className="trending-courses">
        <h3>🔥 Trending Shows</h3>
        <div className="course-list">
          <div className="course">📚 Macroeconomics Made Simple</div>
          <div className="course">🚀 Space Science Explained</div>
          <div className="course">🤖 Intro to AI & Neural Networks</div>
          <div className="course">💡 Creative Writing Masterclass</div>
        </div>
      </div>

      <div className="user-reviews">
        <h3>⭐ What Learners Are Saying</h3>
        <div className="review-list">
          <div className="review">
            <strong>Sarah J.</strong>: “My son now watches educational shows instead of cartoons. Love it!”
          </div>
          <div className="review">
            <strong>Ali K.</strong>: “The AI narrator voice is 🔥 — makes learning feel like Netflix.”
          </div>
          <div className="review">
            <strong>Meena R.</strong>: “I actually understand quantum physics now 😂 10/10!”
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
