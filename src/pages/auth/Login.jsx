import { useState, useEffect } from "react";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Prevent logged-in user from seeing login page
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      if (user.role === "tutor") {
        window.location.href = "/tutor";
      } else {
        window.location.href = "/dashboard";
      }
    }
  }, []);

  const handleLogin = async () => {
    try {
      
      localStorage.clear();

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

    
      if (res.data.user.role === "tutor") {
        window.location.href = "/tutor";
      } else {
        window.location.href = "/dashboard";
      }

    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-950">
      <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl w-80 border">

        <h2 className="text-xl font-bold mb-4 dark:text-white">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-2 border rounded"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 border rounded"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full py-2 bg-purple-500 text-white rounded"
        >
          Login
        </button>

      </div>
    </div>
  );
};

export default Login;