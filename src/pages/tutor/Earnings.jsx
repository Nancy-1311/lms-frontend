import { useEffect, useState } from "react";
import axios from "axios";

const Earnings = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const res = await axios.get(
        "https://lms-backend-2r7y.onrender.com/api/tutors/earnings",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">
        Earnings 💰
      </h2>

      {/* SUMMARY */}
      <div className="flex gap-6 mb-6">
        <div className="p-5 border rounded-xl">
          <h3>Total Earnings</h3>
          <p className="text-xl font-bold">
            ₹{data.totalEarnings}
          </p>
        </div>

        <div className="p-5 border rounded-xl">
          <h3>Total Lessons</h3>
          <p className="text-xl font-bold">
            {data.totalLessons}
          </p>
        </div>
      </div>

      {/* EARNINGS LIST */}
      <div className="grid gap-4">
        {data.payments.map((p) => (
          <div
            key={p._id}
            className="p-5 rounded-xl border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
          >
      
            <p className="font-semibold text-lg">
  Session with {p.student?.name || "Student"}
</p>

            {/* Subject */}
            <p className="text-sm text-gray-400">
              Subject - {p.subject || "Subject not specified"}
            </p>

            {/* Date & Time */}
            <p className="text-sm text-gray-400 mt-1">
              {new Date(p.createdAt).toLocaleDateString()} |{" "}
              {p.time || "Time not available"}
            </p>

            <p className="text-md text-gray-500 mt-2">Earning</p>
<p className="font-bold text-green-500 text-lg">₹{p.amount}</p>

            <span className="inline-block mt-2 px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded">
  Paid ✅
</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Earnings;

