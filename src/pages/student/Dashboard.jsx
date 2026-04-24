import { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    completed: 0,
    totalSpent: 0, 
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const user = JSON.parse(localStorage.getItem("user"));

  
 const fetchStats = async () => {
  try {
    const token = localStorage.getItem("token");

    
    if (user?.role === "admin") {
      const res = await axios.get(
        "https://lms-backend-2r7y.onrender.com/api/admin/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStats(res.data);
      return;
    }


    if (user?.role === "tutor") {
      const res = await axios.get(
        "https://lms-backend-2r7y.onrender.com/api/tutors/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStats(res.data);
      return;
    }

    const res = await axios.get(
      "https://lms-backend-2r7y.onrender.com/api/bookings",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const bookings = res.data;

    const total = bookings.length;
    const now = new Date();

    let upcoming = 0;
    let completed = 0;

   bookings.forEach((b) => {
  if (b.meetingLink && b.meetingLink !== "") {
    completed++; 
  } else {
    upcoming++;    
  }
});

    const totalSpent = bookings.reduce(
      (sum, b) => sum + (b.price || 0),
      0
    );

    setStats({ total, upcoming, completed, totalSpent });

  } catch (err) {
    console.error(err);
  }
};

  
  
  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">
        Welcome Back 👋
      </h2>

      <div className="grid grid-cols-3 gap-6">

        <div className="p-6 rounded-2xl 
        bg-gradient-to-r from-purple-500/20 to-blue-500/20 
        backdrop-blur-lg border border-white/10
        hover:scale-105 transition-all shadow-lg">
          
          <h3 className="text-gray-400">Total Lessons</h3>
          <p className="text-3xl font-bold mt-2">
            {stats.total}
          </p>
        </div>

        <div className="p-6 rounded-2xl 
        bg-gradient-to-r from-pink-500/20 to-purple-500/20 
        backdrop-blur-lg border border-white/10
        hover:scale-105 transition-all shadow-lg">
          
          <h3 className="text-gray-400">Upcoming</h3>
          <p className="text-3xl font-bold mt-2">
            {stats.upcoming}
          </p>
        </div>

        <div className="p-6 rounded-2xl 
        bg-gradient-to-r from-green-500/20 to-blue-500/20 
        backdrop-blur-lg border border-white/10
        hover:scale-105 transition-all shadow-lg">
          
          <h3 className="text-gray-400">Completed</h3>
          <p className="text-3xl font-bold mt-2">
            {stats.completed}
          </p>
        </div>


        {user?.role === "student" && (
  <div className="p-6 rounded-2xl 
  bg-gradient-to-r from-yellow-500/20 to-orange-500/20 
  backdrop-blur-lg border border-white/10">
    
    <h3 className="text-gray-400">Total Spent</h3>
    <p className="text-3xl font-bold mt-2">
      ₹{stats.totalSpent}
    </p>
  </div>
)}


{user?.role === "tutor" && (
  <div className="p-6 rounded-2xl 
  bg-gradient-to-r from-green-500/20 to-blue-500/20 
  backdrop-blur-lg border border-white/10">
    
    <h3 className="text-gray-400">Total Earnings</h3>
    <p className="text-3xl font-bold mt-2">
      ₹{stats.totalEarnings || 0}
    </p>
  </div>
)}

{user?.role === "admin" && (
  <>
    <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20">
      <h3 className="text-gray-400">Total Users</h3>
      <p className="text-3xl font-bold mt-2">
        {stats.totalUsers || 0}
      </p>
    </div>

    <div className="p-6 rounded-2xl bg-gradient-to-r from-green-500/20 to-blue-500/20">
      <h3 className="text-gray-400">Total Tutors</h3>
      <p className="text-3xl font-bold mt-2">
        {stats.totalTutors || 0}
      </p>
    </div>

    <div className="p-6 rounded-2xl bg-gradient-to-r from-pink-500/20 to-purple-500/20">
      <h3 className="text-gray-400">Total Bookings</h3>
      <p className="text-3xl font-bold mt-2">
        {stats.totalBookings || 0}
      </p>
    </div>

    <div className="p-6 rounded-2xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20">
      <h3 className="text-gray-400">Total Revenue</h3>
      <p className="text-3xl font-bold mt-2">
        ₹{stats.totalRevenue || 0}
      </p>
    </div>
  </>
)}

      </div>
    </div>
  );
};

export default Dashboard;





















