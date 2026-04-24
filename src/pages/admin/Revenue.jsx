import { useEffect, useState } from "react";
import axios from "axios";

const Revenue = () => {
  const [data, setData] = useState({
    totalRevenue: 0,
    totalBookings: 0,
  });

  const token = localStorage.getItem("token");

  const fetchRevenue = async () => {
    try {
      const res = await axios.get(
        "https://lms-backend-2r7y.onrender.com/api/admin/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRevenue();
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 dark:text-white">Revenue Overview</h2>

      <div className="grid grid-cols-2 gap-6">

        {/* TOTAL REVENUE */}
        <div className="p-6 rounded-2xl 
        bg-gradient-to-r from-green-500/20 to-blue-500/20 
        backdrop-blur-lg border border-white/10 shadow">
          
          <h3 className="text-gray-400 dark:text-white">Total Revenue</h3>
          <p className="text-3xl font-bold mt-2 dark:text-white">
            ₹{data.totalRevenue || 0}
          </p>
        </div>

        {/* TOTAL BOOKINGS */}
        <div className="p-6 rounded-2xl 
        bg-gradient-to-r from-purple-500/20 to-pink-500/20 
        backdrop-blur-lg border border-white/10 shadow">
          
          <h3 className="text-gray-400 dark:text-white">Total Bookings</h3>
          <p className="text-3xl font-bold mt-2 dark:text-white">
            {data.totalBookings || 0}
          </p>
        </div>

      </div>
    </div>
  );
};

export default Revenue;