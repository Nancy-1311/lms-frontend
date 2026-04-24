import { useEffect, useState } from "react";
import axios from "axios";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);

  const token = localStorage.getItem("token");

  const fetchBookings = async () => {
    try {
      const res = await axios.get(
        "https://lms-backend-2r7y.onrender.com/api/admin/bookings",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBookings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // CANCEL BOOKING
  const handleCancel = async (id) => {
    try {
      await axios.delete(
        `https://lms-backend-2r7y.onrender.com/api/admin/bookings/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchBookings(); 
    } catch (err) {
      console.error(err);
    }
  };

  // MARK COMPLETED
  const handleComplete = async (id) => {
    try {
      await axios.put(
        `https://lms-backend-2r7y.onrender.com/api/bookings/admin/${id}/complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchBookings(); 
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">
        All Bookings 📅
      </h2>

      {bookings.length === 0 ? (
        <p className="text-gray-500 dark:text-white">No bookings found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse dark:text-white">
            
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800 text-sm">
                <th className="p-3">Student</th>
                <th className="p-3">Tutor</th>
                <th className="p-3">Date</th>
                <th className="p-3">Time</th>
                <th className="p-3">Price</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th> {/* ✅ NEW */}
              </tr>
            </thead>

            <tbody>
              {bookings.map((b) => (
                <tr
                  key={b._id}
                  className="border-b hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <td className="p-3 font-medium">
                    {b.student?.name || "N/A"}
                  </td>

                  <td className="p-3">
                    {b.tutor?.userId?.name || "N/A"}
                  </td>

                  <td className="p-3">
                    {new Date(b.date).toLocaleDateString()}
                  </td>

                  <td className="p-3">{b.time}</td>

                  <td className="p-3 font-semibold">
                    ₹{b.price}
                  </td>

                  {/* STATUS */}
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${
                        b.isCompleted
                          ? "bg-blue-100 text-blue-600"
                          : b.isPaid
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {b.isCompleted
                        ? "Completed"
                        : b.isPaid
                        ? "Paid"
                        : "Pending"}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="p-3 flex gap-2">
                    
                    {/* COMPLETE */}
                    {!b.isCompleted && (
                      <button
                        onClick={() => handleComplete(b._id)}
                        className="px-3 py-1 text-xs rounded bg-green-500 text-white"
                      >
                        Complete
                      </button>
                    )}

                    {/* CANCEL */}
                    <button
                      onClick={() => handleCancel(b._id)}
                      className="px-3 py-1 text-xs rounded bg-red-500 text-white"
                    >
                      Cancel
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}
    </div>
  );
};

export default Bookings;

