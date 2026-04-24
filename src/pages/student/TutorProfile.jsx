import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import BookingModal from "../../components/common/BookingModal";

const TutorProfile = () => {
  const { id } = useParams();

  const [tutor, setTutor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showBooking, setShowBooking] = useState(false);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchTutor();
    fetchReviews();
  }, []);

  const fetchTutor = async () => {
    try {
      const res = await axios.get(
        "https://lms-backend-2r7y.onrender.com/api/tutors"
      );

      const found = res.data.find((t) => t._id === id);
      setTutor(found);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await axios.get(
        `https://lms-backend-2r7y.onrender.com/api/reviews/${id}`
      );
      setReviews(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!tutor) return <p className="text-center mt-10">Tutor not found</p>;

  return (
    <div className="max-w-5xl mx-auto">

      {/* HEADER */}
      <div className="p-6 rounded-2xl 
      bg-white dark:bg-gray-900 
      border border-gray-200 dark:border-gray-700 mb-6">

        <h1 className="text-3xl font-bold">
          {tutor.name}
        </h1>

        <p className="text-gray-400 mt-1">
          {tutor.subject}
        </p>

        <p className="mt-2 text-yellow-500">
          ⭐ {tutor.rating || 0}
        </p>

        <p className="mt-2 text-purple-500 font-semibold">
          ₹{tutor.price}/hr
        </p>



{user?.role === "student" && (
  <button
    onClick={() => setShowBooking(true)}
    className="mt-4 px-6 py-2 rounded-xl 
    bg-gradient-to-r from-purple-500 to-blue-500 text-white"
  >
    Book Lesson
  </button>
)}

      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">

        <div className="p-5 rounded-xl bg-white dark:bg-gray-900 border">
          <h3 className="font-semibold mb-2">Bio</h3>
          <p>{tutor.bio || "No bio available"}</p>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-gray-900 border">
          <h3 className="font-semibold mb-2">Experience</h3>
          <p>{tutor.experience || "Not provided"}</p>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-gray-900 border">
          <h3 className="font-semibold mb-2">Expertise</h3>
          <p>{tutor.expertise || "Not provided"}</p>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-gray-900 border">
          <h3 className="font-semibold mb-2">Availability</h3>

          {tutor.availability?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {tutor.availability.map((slot, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-purple-500 text-white rounded-lg text-sm"
                >
                  {slot}
                </span>
              ))}
            </div>
          ) : (
            <p>No availability added</p>
          )}
        </div>

      </div>

      <div className="p-6 rounded-2xl 
      bg-white dark:bg-gray-900 border">

        <h2 className="text-xl font-bold mb-4">
          Reviews ⭐
        </h2>

        {reviews.length === 0 ? (
          <p className="text-gray-400">No reviews yet</p>
        ) : (
          <div className="space-y-3">
            {reviews.map((r) => (
              <div
                key={r._id}
                className="p-3 rounded-lg border bg-gray-50 dark:bg-gray-800"
              >
                <p className="text-yellow-500 font-semibold">
                  ⭐ {r.rating}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  {r.comment || "No comment"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {showBooking && (
        <BookingModal
          tutor={tutor}
          onClose={() => setShowBooking(false)}
        />
      )}

    </div>
  );
};

export default TutorProfile;