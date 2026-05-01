import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyLessons = () => {
  const [bookings, setBookings] = useState([]);
  const [newTimes, setNewTimes] = useState({});
  const [reviewData, setReviewData] = useState({});
  const [meetingLinks, setMeetingLinks] = useState({});
  const [loading, setLoading] = useState(true);
  const [recordingLinks, setRecordingLinks] = useState({});

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(
        "https://lms-backend-2r7y.onrender.com/api/bookings",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveRecording = async (id) => {
    try {
      await axios.put(
        `https://lms-backend-2r7y.onrender.com/api/bookings/${id}/recording`,
        { recordingUrl: recordingLinks[id] },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Recording saved 🎥");
      fetchBookings();
    } catch (err) {
      alert("Failed ❌");
    }
  };

  const joinClass = (booking) => {
    if (!booking.meetingLink) {
      alert("Meeting link not added yet ❌");
      return;
    }
    window.open(booking.meetingLink, "_blank");
  };

const cancelBooking = async (id) => {
  try {
    await axios.delete(
      `https://lms-backend-2r7y.onrender.com/api/bookings/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    // ✅ REFRESH FROM SERVER (correct way)
    fetchBookings();

  } catch (err) {
    alert("Cancel failed ❌");
  }
};

  const reschedule = async (id) => {
    try {
      if (!newTimes[id]) {
        alert("Please select a new time ❌");
        return;
      }

      await axios.put(
        `https://lms-backend-2r7y.onrender.com/api/bookings/${id}/reschedule`,
        { newTime: newTimes[id] },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Rescheduled successfully ✅");
      fetchBookings();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Reschedule failed ❌");
    }
  };

  const submitReview = async (booking) => {
    try {
      const tutorId =
        typeof booking.tutor === "object"
          ? booking.tutor._id
          : booking.tutor;

      const data = reviewData[tutorId];

      console.log("TutorId:", tutorId);
      console.log("Review Data:", data);

      if (!tutorId) {
        alert("Tutor not found ❌");
        return;
      }

      if (!data || data.rating === undefined) {
        alert("Rating missing ❌");
        return;
      }

      const rating = Number(data.rating);

      if (isNaN(rating) || rating < 1 || rating > 5) {
        alert("Rating must be between 1 and 5 ⭐");
        return;
      }

      await axios.post(
        "https://lms-backend-2r7y.onrender.com/api/reviews",
        {
          tutorId,
          rating,
          comment: data.comment || "",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Review submitted ✅");

      // reset form
      setReviewData((prev) => ({
        ...prev,
        [tutorId]: { rating: "", comment: "" },
      }));

      fetchBookings();

    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.message || "Failed ❌");
    }
  };

  const saveMeetingLink = async (id, link) => {
    try {
      await axios.put(
        `https://lms-backend-2r7y.onrender.com/api/bookings/${id}/meeting-link`,
        { meetingLink: link },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Meeting link saved ✅");
      fetchBookings();
    } catch (err) {
      alert("Failed to save link ❌");
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading lessons...</p>;
  }

return (
  <div>
    <h2 className="text-3xl font-bold mb-6">My Lessons 📚</h2>

    <div className="grid grid-cols-3 gap-6">
      {bookings
        .filter((b) => b.isPaid)
        .map((b) => {
          const tutorId =
            typeof b.tutor === "object" ? b.tutor._id : b.tutor;

          const now = new Date();

          const [hours, minutes] = b.time.split(":");
          const classDateTime = new Date(b.date);
          classDateTime.setHours(parseInt(hours));
          classDateTime.setMinutes(parseInt(minutes));

          const isCompleted = b.recordingUrl;
          const isCancelled = b.isCancelled;
          const isPast = classDateTime < now;

          return (
            <div key={b._id} className="p-5 rounded-2xl border">
              <h3 className="text-xl font-semibold">{b.tutorName}</h3>
              <p className="text-gray-400">{b.subject}</p>

              <p className="text-purple-500 mt-2">
                {new Date(b.date).toLocaleDateString()} | {formatTime(b.time)}
              </p>

              {/* ✅ Cancelled Label */}
              {isCancelled && (
                <p className="text-red-500 font-bold mt-2">
                  Cancelled ❌
                </p>
              )}

              <div className="mt-3 space-y-2">

                {/* COMPLETED MESSAGE */}
                {isCompleted && (
                  <p className="text-green-400 text-sm">
                    Session completed 🎉
                  </p>
                )}

                {!isCompleted ? (
                  <>
                    {/* JOIN */}
                    <button
                      onClick={() => joinClass(b)}
                      disabled={isCancelled || isPast}
                      className={`w-full py-2 rounded ${
                        isCancelled || isPast
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-500 text-white"
                      }`}
                    >
                      Join Class 🎥
                    </button>

                    {/* CANCEL */}
                    <button
                      onClick={() => cancelBooking(b._id)}
                      disabled={isCancelled || isPast}
                      className={`w-full py-2 rounded ${
                        isCancelled || isPast
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {isCancelled ? "Cancelled ❌" : "Cancel Booking ❌"}
                    </button>

                    {user?.role === "student" && (
                      <>
                        <select
                          className="w-full p-2 border rounded text-black"
                          value={newTimes[b._id] || ""}
                          onChange={(e) =>
                            setNewTimes({
                              ...newTimes,
                              [b._id]: e.target.value,
                            })
                          }
                          disabled={isCancelled || isPast}
                        >
                          <option value="">Select New Time</option>
                          <option value="10:00 AM">10:00 AM</option>
                          <option value="2:00 PM">2:00 PM</option>
                          <option value="6:00 PM">6:00 PM</option>
                        </select>

                        <button
                          onClick={() => reschedule(b._id)}
                          disabled={isCancelled || isPast}
                          className={`w-full py-2 rounded ${
                            isCancelled || isPast
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-indigo-500 text-white"
                          }`}
                        >
                          Reschedule 🔄
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {/* WATCH RECORDING */}
                    {b.recordingUrl && (
                      <a
                        href={b.recordingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full block text-center py-2 bg-purple-600 text-white rounded"
                      >
                        Watch Recording 🎥
                      </a>
                    )}

                    {/* REVIEW */}
                    {user?.role === "student" && !b.reviewed && (
                      <div>
                        <input
                          type="number"
                          placeholder="Rating (1-5)"
                          className="w-full p-2 border rounded mb-2 text-black"
                          onChange={(e) =>
                            setReviewData((prev) => ({
                              ...prev,
                              [tutorId]: {
                                ...prev[tutorId],
                                rating: e.target.value,
                              },
                            }))
                          }
                        />

                        <input
                          type="text"
                          placeholder="Comment"
                          className="w-full p-2 border rounded mb-2 text-black"
                          onChange={(e) =>
                            setReviewData((prev) => ({
                              ...prev,
                              [tutorId]: {
                                ...prev[tutorId],
                                comment: e.target.value,
                              },
                            }))
                          }
                        />

                        <button
                          onClick={() => submitReview(b)}
                          className="w-full py-2 bg-yellow-500 text-white rounded"
                        >
                          Submit Review ⭐
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
    </div>
  </div>
);
}

export default MyLessons;





