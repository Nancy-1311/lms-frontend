import { useEffect, useState } from "react";
import axios from "axios";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const token = localStorage.getItem("token");

  const fetchReviews = async () => {
    try {
      const res = await axios.get(
        "https://lms-backend-2r7y.onrender.com/api/admin/reviews",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReviews(res.data);
    } catch (err) {
      console.error("Fetch Reviews Error:", err.response?.data || err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [token]); 

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://lms-backend-2r7y.onrender.com/api/admin/reviews/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchReviews();
    } catch (err) {
      console.error("Delete Error:", err.response?.data || err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 dark:text-white">
        Reviews Management ⭐
      </h2>

      {reviews.length === 0 ? (
        <p className="text-gray-400">No reviews found</p>
      ) : (
        <div className="grid gap-4">
          {reviews.map((r) => (
            <div
              key={r._id}
              className="p-5 rounded-xl border 
              bg-white dark:bg-gray-900 
              border-gray-200 dark:border-gray-700"
            >
              <p className="font-semibold dark:text-white">
                Tutor Name : { " "}
                {r.tutorId?.userId?.name || "Unknown Tutor"}
              </p>

              <p className="text-sm text-gray-400">
                Rating: ⭐ {r.rating}
              </p>

              <p className="mt-2 dark:text-white">
                {r.comment || "No comment"}
              </p>

              <button
                onClick={() => handleDelete(r._id)}
                className="mt-3 px-3 py-1 bg-red-500 text-white rounded"
              >
                Delete ❌
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;