import { useEffect, useState } from "react";
import axios from "axios";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [newTime, setNewTime] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const res = await axios.get("https://lms-backend-2r7y.onrender.com/api/bookings");
    setBookings(res.data);
  };

  const reschedule = async (id) => {
    try {
      await axios.put(
        `https://lms-backend-2r7y.onrender.com/api/bookings/${id}/reschedule`,
        { newTime }
      );

      alert("Rescheduled ✅");
      setNewTime("");
      fetchBookings();
    } catch (err) {
      alert("Failed ❌");
    }
  };

  const joinClass = (booking) => {
    alert("Joining class...");
  };

  const watchRecording = async (url) => {
    window.open(url);
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">
        My Bookings 📅
      </h2>

      {bookings.map((b) => {
        const now = new Date();
        const bookingDateTime = new Date(`${b.date}T${b.time}`);
        const isPast = bookingDateTime < now;

        return (
          <div
            key={b._id}
            className="p-5 mb-4 border rounded-xl"
          >
            <p>Tutor: {b.tutorName}</p>
            <p>Time: {b.time}</p>

            {/* ✅ Show cancelled status */}
            {b.isCancelled && (
              <p className="text-red-500 font-bold">
                Cancelled ❌
              </p>
            )}

            <div className="mt-2">
              {!b.recordingUrl ? (
                <button
                  onClick={() => joinClass(b)}
                  disabled={b.isCancelled || isPast}
                  className={`px-4 py-2 rounded ${
                    b.isCancelled || isPast
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-500 text-white"
                  }`}
                >
                  Join Class
                </button>
              ) : (
                <button
                  onClick={() => watchRecording(b.recordingUrl)}
                  className="px-4 py-2 bg-purple-500 text-white rounded"
                >
                  Watch Recording 🎥
                </button>
              )}
            </div>

            <div className="mt-3 flex gap-2">
              <input
                type="text"
                placeholder="New time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                disabled={b.isCancelled || isPast}
                className="p-2 border rounded w-full"
              />

              <button
                onClick={() => reschedule(b._id)}
                disabled={b.isCancelled || isPast}
                className={`px-4 rounded ${
                  b.isCancelled || isPast
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 text-white"
                }`}
              >
                Reschedule
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MyBookings;
