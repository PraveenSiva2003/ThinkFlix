import React from "react";

const Landing = ({ onSignIn }) => {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Welcome to ThinkFlix</h1>
      <p>Sign in to continue</p>
      <button onClick={onSignIn}>Sign in with Google</button>
    </div>
  );
};

export default Landing;
