import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const getTitle = () => {
    const path = location.pathname;

    // ADMIN ROUTES 
    if (path.startsWith("/admin")) {
      if (path === "/admin") return "Admin Dashboard 📊";
      if (path.includes("users")) return "Users Management 👥";
      if (path.includes("bookings")) return "Bookings 📅";
      if (path.includes("revenue")) return "Revenue 💰";
      return "Admin Panel 👨‍💼";
    }

    // EXISTING
    if (path === "/tutor") return "Tutor Dashboard 🎓";
    if (path === "/lessons") return "My Lessons";
    if (path === "/payments") return "Payments";

    return "Dashboard";
  };

  return (
    <div className="flex justify-between items-center p-4 
     dark:bg-gray-900/70 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700">

      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold">
          {getTitle()}
        </h2>

        {/* ADMIN QUICK LINK */}
        {user && user.role === "admin" && (
          <Link
            to="/admin"
            className="text-sm px-3 py-1 rounded-lg 
            bg-purple-500 text-white"
          >
            Admin
          </Link>
        )}
      </div>

      <div className="flex items-center gap-4">

        {user && (
          <p className="text-sm text-gray-500">
            Hi, {user.name}
          </p>
        )}

        <button
          onClick={toggleTheme}
          className="px-4 py-2 rounded-xl 
          bg-gradient-to-r from-purple-500 to-blue-500 text-white"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>

        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-xl bg-red-500 text-white"
        >
          Logout
        </button>

      </div>
    </div>
  );
};

export default Navbar;


