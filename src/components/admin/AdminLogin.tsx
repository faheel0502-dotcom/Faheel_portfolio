import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      
      if (data.success) {
        localStorage.setItem("adminToken", data.token);
        navigate("/admin/dashboard");
      } else {
        setError(data.message || "Invalid login");
      }
    } catch (err) {
      setError("Failed to connect to backend server");
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-login-box">
        <h2>Admin Login</h2>
        {error && <div className="admin-error">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="admin-input-group">
            <label>Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div className="admin-input-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="admin-btn">Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
