import { useState } from "react";
import { signIn, signUp, signInWithGoogle } from "../authService";
import { useNavigate } from "react-router-dom"; // Import navigation

const Login = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize navigation

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        await signUp(email, password);
        alert("Sign-up successful! Please log in.");
      } else {
        await signIn(email, password);
        alert("Login successful!");
        onClose(); // Close login modal
        navigate("/dashboard"); // Redirect to Dashboard
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      alert("Google Sign-in successful!");
      onClose();
      navigate("/dashboard"); // Redirect to Dashboard
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-modal">
      <h2>{isSignUp ? "Sign Up" : "Login"}</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleAuth}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">{isSignUp ? "Sign Up" : "Login"}</button>
      </form>
      <button onClick={handleGoogleSignIn} className="google-signin-btn">
        Sign in with Google
      </button>
      <p onClick={() => setIsSignUp(!isSignUp)}>
        {isSignUp ? "Already have an account? Log in" : "No account? Sign up"}
      </p>
      <button className="close-btn" onClick={onClose}>Close</button>
    </div>
  );
};

export default Login;


