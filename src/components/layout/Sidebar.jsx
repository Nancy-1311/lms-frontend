import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (user?.role === "admin") return null;

  // BASE MENU
  let menu = [
    { name: "Dashboard", path: "/" },
    { name: "Profile", path: "/profile" },
  ];

  //STUDENT MENU
  if (user?.role === "student") {
    menu = [
      ...menu,
      { name: "Find Tutors", path: "/tutors" },
      { name: "My Lessons", path: "/lessons" },
      { name: "Payments", path: "/payments" },
    ];
  }

  // TUTOR MENU
  if (user?.role === "tutor") {
    menu = [
      ...menu,
      { name: "My Bookings", path: "/bookings" },
      { name: "Tutor Panel", path: "/tutor" },
    ];
  }

  return (
    <div
      className="w-64 h-screen p-6 
      dark:bg-gray-900/70 
      backdrop-blur-xl border-r border-gray-200 dark:border-gray-700"
    >
      <h1 className="text-2xl font-bold mb-10">
        LMS 🚀
      </h1>

      <nav className="flex flex-col gap-3">
        {menu.map((item) => (
          <Link
            key={item.path + item.name}  // ✅ FIXED (no duplicate key issue)
            to={item.path}
            className={`px-4 py-2 rounded-xl transition-all 
            ${
              location.pathname === item.path
                ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                : "hover:bg-gray-200 dark:hover:bg-gray-800"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;