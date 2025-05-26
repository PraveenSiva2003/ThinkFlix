import { logOut } from "../authService";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logOut();
    navigate("/"); // Redirect to homepage after logout
  };

  return (
    <div className="dashboard">
      <h2>Welcome to Your Dashboard</h2>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
};

export default Dashboard;
