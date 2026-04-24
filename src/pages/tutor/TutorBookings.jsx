import { useEffect, useState, useRef } from "react";
import axios from "axios";

const TutorBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meetingLinks, setMeetingLinks] = useState({});
  const [recordingLinks, setRecordingLinks] = useState({});
  const recordingInputRefs = useRef({});
  const [joinedClasses, setJoinedClasses] = useState({});

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
      console.error("Fetch bookings error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

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
      setBookings(bookings.filter((b) => b._id !== id));
    } catch (err) {
      console.error(err);
      alert("Cancel failed ❌");
    }
  };

  const saveMeetingLink = async (id, link) => {
    try {
      if (!id || !link) {
        alert("Missing data ❌");
        return;
      }

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
      console.error(err);
      alert("Failed to save link ❌");
    }
  };

  const saveRecording = async (id) => {
    try {
      const link = recordingLinks[id];

      console.log("FINAL SENDING:", link);

      if (!link) {
        alert("Please enter recording link first ❌");
        return;
      }

      await axios.put(
        `https://lms-backend-2r7y.onrender.com/api/bookings/${id}/recording`,
        { recordingUrl: link },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Recording saved 🎥");
      fetchBookings();

    } catch (err) {
      console.error(err);
      alert("Failed ❌");
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading bookings...</p>;
  }

return (
  <div className="p-6">
    <h2 className="text-3xl font-bold mb-6">
      My Bookings 📚
    </h2>

    {bookings.length === 0 ? (
      <p className="text-gray-400">No bookings yet</p>
    ) : (
      <div className="grid grid-cols-3 gap-6">
        {bookings.map((b) => {

          const now = new Date();
          const classDate = new Date(b.date);

          const [time, modifier] = b.time.trim().split(" ");
          let [hours, minutes] = time.split(":");

          if (modifier === "PM" && hours !== "12") {
            hours = parseInt(hours) + 12;
          }
          if (modifier === "AM" && hours === "12") {
            hours = 0;
          }

          classDate.setHours(parseInt(hours));
          classDate.setMinutes(parseInt(minutes));

          const isMeetingAdded = b.meetingLink && b.meetingLink.trim() !== "";
          const isRecordingAdded = b.recordingUrl && b.recordingUrl.trim() !== "";

          const hasJoined = joinedClasses[b._id];
          const isCompleted = hasJoined || classDate < now;

          return (
            <div key={b._id} className="p-5 rounded-2xl border">

              <h3 className="text-xl font-semibold">
                {b.student?.name || "Student"}
              </h3>

              <p className="text-gray-400">{b.subject}</p>

              <p className="text-purple-500 mt-2">
                {new Date(b.date).toLocaleDateString()} | {b.time}
              </p>

              <div className="mt-3 mb-2">
                {isCompleted ? (
                  <span className="text-green-500 text-sm font-medium">
                    Completed ✅
                  </span>
                ) : (
                  <span className="text-yellow-500 text-sm font-medium">
                    Upcoming ⏳
                  </span>
                )}
              </div>

              {/* BEFORE JOIN */}
              {!isCompleted && (
                <>
                  {isMeetingAdded && (
                    <button
                      onClick={() => {
                        window.open(b.meetingLink);
                        setJoinedClasses({
                          ...joinedClasses,
                          [b._id]: true,
                        });
                      }}
                      className="mt-2 w-full py-2 bg-blue-500 text-white rounded"
                    >
                      Join Meeting 🎥
                    </button>
                  )}

                  {!isMeetingAdded && (
                    <>
                      <button
                        onClick={() => cancelBooking(b._id)}
                        className="mt-2 w-full py-2 bg-red-500 text-white rounded"
                      >
                        Cancel Booking ❌
                      </button>

                      <input
                        type="text"
                        placeholder="Meeting Link"
                        className="w-full p-2 border rounded mt-2 text-black"
                        onChange={(e) =>
                          setMeetingLinks({
                            ...meetingLinks,
                            [b._id]: e.target.value,
                          })
                        }
                      />

                      <button
                        onClick={() =>
                          saveMeetingLink(b._id, meetingLinks[b._id])
                        }
                        className="mt-2 w-full py-2 bg-green-600 text-white rounded"
                      >
                        Save Link 🔗
                      </button>
                    </>
                  )}
                </>
              )}

              {/* AFTER JOIN */}
              {isCompleted && (
                <>
                  <p className="text-green-500 mt-2">
                    Session completed 🎉
                  </p>

                  <input
                    type="text"
                    placeholder="Paste Recording Link"
                    className="w-full p-2 border rounded mt-2 text-black"
                    onChange={(e) =>
                      setRecordingLinks({
                        ...recordingLinks,
                        [b._id]: e.target.value,
                      })
                    }
                  />

                  <button
                    onClick={() => saveRecording(b._id)}
                    className="mt-2 w-full py-2 bg-purple-500 text-white rounded"
                  >
                    Save Recording 🎥
                  </button>

                  {isRecordingAdded && (
                    <button
                      onClick={() => window.open(b.recordingUrl)}
                      className="mt-2 w-full py-2 bg-purple-600 text-white rounded"
                    >
                      Watch Recording 🎥
                    </button>
                  )}
                </>
              )}

            </div>
          );
        })}
      </div>
    )}
  </div>
);

};

export default TutorBookings;
