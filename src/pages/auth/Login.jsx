import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;

      if (user) {
  if (user.role === "admin") {
    navigate("/admin");
  } else if (user.role === "tutor") {
    navigate("/tutor");
  } else {
    navigate("/");
  }
}
    } catch (err) {
      console.error("User parse error:", err);
      localStorage.removeItem("user"); 
    }
  }, [navigate]);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "https://lms-backend-2r7y.onrender.com/api/auth/login",
        { email, password }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.data.user.role === "admin") { 
  navigate("/admin");
} else if (res.data.user.role === "tutor") {
  navigate("/tutor");
} else {
  navigate("/");
}

    } catch (err) {
      alert(err.response?.data?.message || "Login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen  
    dark:from-gray-900 dark:to-gray-950 transition-all">

      <div className="w-[350px] p-6 rounded-2xl 
      bg-white dark:bg-gray-900 
      border border-gray-200 dark:border-gray-700 
      shadow-xl">

        <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">
          Login 🔐
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-3 rounded-lg border 
          dark:bg-gray-800 dark:text-white outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 rounded-lg border 
          dark:bg-gray-800 dark:text-white outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3 rounded-lg 
          bg-gradient-to-r from-purple-500 to-blue-500 
          text-white font-semibold hover:opacity-90 transition
          disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center mt-4 text-sm text-gray-500">
          Don’t have an account?{" "}
          <Link to="/register" className="text-purple-500 font-semibold">
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;