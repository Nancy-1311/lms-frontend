import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTutors: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });

  const [analytics, setAnalytics] = useState({
    monthlyRevenue: [],
    monthlyBookings: [],
  });

  const [topTutors, setTopTutors] = useState([]);

  const token = localStorage.getItem("token");

  //FETCH STATS
  const fetchStats = async () => {
    try {
      const res = await axios.get(
        "https://lms-backend-2r7y.onrender.com/api/admin/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  //FETCH ANALYTICS (NEW)
  const fetchAnalytics = async () => {
    try {
      const res = await axios.get(
        "https://lms-backend-2r7y.onrender.com/api/admin/analytics",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAnalytics(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchAnalytics();
  }, []);

  useEffect(() => {
  const fetchTopTutors = async () => {
    try {
      const res = await axios.get(
        "https://lms-backend-2r7y.onrender.com/api/admin/top-tutors",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setTopTutors(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  fetchTopTutors();
}, []);

  return (
    <div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-4 gap-6 mb-10">

        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-500/20 shadow">
          <h3 className="text-gray-400 dark:text-white">Users</h3>
          <p className="text-3xl font-bold dark:text-white">{stats.totalUsers}</p>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-r from-green-500/20 shadow">
          <h3 className="text-gray-400 dark:text-white">Tutors</h3>
          <p className="text-3xl font-bold dark:text-white">{stats.totalTutors}</p>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-r from-pink-500/20 shadow">
          <h3 className="text-gray-400 dark:text-white">Bookings</h3>
          <p className="text-3xl font-bold dark:text-white">{stats.totalBookings}</p>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-r from-yellow-500/20 shadow">
          <h3 className="text-gray-400 dark:text-white">Revenue</h3>
          <p className="text-3xl font-bold dark:text-white">₹{stats.totalRevenue}</p>
        </div>

      </div>

      {/*CHARTS */}
      <div className="grid grid-cols-2 gap-8">

        {/*REVENUE CHART */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
          <h3 className="mb-4 font-semibold dark:text-white">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* BOOKINGS CHART */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
          <h3 className="mb-4 font-semibold dark:text-white">Monthly Bookings</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.monthlyBookings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="bookings" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      <div className="mt-8 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
  <h2 className="text-xl font-bold mb-4 dark:text-white">
    Top Tutors 🏆
  </h2>

  {topTutors.length === 0 ? (
    <p className="text-gray-400 dark:text-white">No data available</p>
  ) : (
    <div className="space-y-3 dark:text-white">
      {topTutors.map((t, index) => (
        <div
          key={t._id}
          className="flex justify-between items-center border-b pb-2"
        >
          <div>
            <p className="font-semibold">
              {t.tutor?.name || "Tutor"}
            </p>
            <p className="text-sm text-gray-400">
              {t.totalBookings} bookings
            </p>
          </div>

          <p className="font-bold text-green-500">
            ₹{t.totalEarned}
          </p>
        </div>
      ))}
    </div>
  )}
</div>
    </div>
  );
};

export default AdminDashboard;