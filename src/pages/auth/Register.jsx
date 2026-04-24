import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        "https://lms-backend-2r7y.onrender.com/api/auth/register",
        form
      );

      alert("Registered Successfully ✅");
      navigate("/login");

    } catch (err) {
      alert(err.response?.data?.message || "Error ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 
    bg-gradient-to-br from-gray-100 via-blue-50 to-purple-100">

      <div className="flex flex-col md:flex-row gap-8">

        {/* REGISTER FORM */}
        <form
          onSubmit={handleSubmit}
          className="w-[350px] p-6 rounded-2xl 
          bg-white dark:bg-gray-900 dark:text-white
          border border-gray-200 dark:border-gray-700 shadow-xl"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">
            Register 📝
          </h2>

          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 mb-4 rounded-xl 
            bg-white dark:bg-gray-800 
            border border-gray-300 dark:border-gray-700 outline-none"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 mb-4 rounded-xl 
            bg-white dark:bg-gray-800 
            border border-gray-300 dark:border-gray-700 outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 mb-4 rounded-xl 
            bg-white dark:bg-gray-800 
            border border-gray-300 dark:border-gray-700 outline-none"
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full p-3 mb-4 rounded-xl 
            bg-white dark:bg-gray-800 
            border border-gray-300 dark:border-gray-700 outline-none"
          >
            <option value="student">Student</option>
            <option value="tutor">Tutor</option>
          </select>

          <button
            disabled={loading}
            className="w-full py-2 rounded-xl 
            bg-gradient-to-r from-purple-500 to-blue-500 text-white
            disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="w-[350px] p-6 rounded-2xl 
        bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 
        text-white shadow-xl">

          <h2 className="text-xl font-bold mb-2">
            🚀 Explore Demo
          </h2>

          <p className="text-sm mb-4">
            You can register or quickly explore the LMS using demo accounts.
          </p>

          <button
            onClick={() => navigate("/login")}
            className="mb-4 px-4 py-2 bg-white text-black rounded-lg font-semibold hover:scale-105 transition"
          >
            Go to Login
          </button>

          <div className="text-sm space-y-1">
            <p>👤 Admin: admin@test.com / 123456</p>
            <p>👨‍🏫 Tutor: tutor@test.com / 123456</p>
            <p>🎓 Student: student@test.com / 123456</p>
          </div>

          <div className="mt-4 text-sm">
            <p className="font-semibold">💳 Test Payment</p>
            <p>Card: 4242 4242 4242 4242</p>
            <p>Expiry: 12/34 | CVV: 123</p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Register;