import { useEffect, useState } from "react";
import { getTutors } from "../../services/tutorService";
import BookingModal from "../../components/common/BookingModal";

const FindTutors = () => {
  const [tutors, setTutors] = useState([]);
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");

  // FILTERS
  const [minRating, setMinRating] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [availability, setAvailability] = useState("");

  const [selectedTutor, setSelectedTutor] = useState(null);

  // NEW: store reviews
  const [reviewsMap, setReviewsMap] = useState({});

  useEffect(() => {
    fetchTutors();
  }, []);

  // FETCH REVIEWS
  const getReviewsByTutor = async (tutorId) => {
    const res = await fetch(`http://localhost:5000/api/reviews/${tutorId}`);
    return res.json();
  };

  const fetchTutors = async () => {
    try {
      const data = await getTutors();
      setTutors(data);

      // FETCH REVIEWS FOR EACH TUTOR
      const reviewData = {};

      for (let tutor of data) {
        const reviews = await getReviewsByTutor(tutor._id);
        reviewData[tutor._id] = reviews;
      }

      setReviewsMap(reviewData);

    } catch (err) {
      console.error(err);
    }
  };

  // FILTER LOGIC
  const filteredTutors = tutors.filter((tutor) => {
    return (
      tutor.name.toLowerCase().includes(search.toLowerCase()) &&
      (subject === "" || tutor.subject === subject) &&
      (minRating === "" || tutor.rating >= minRating) &&
      (maxPrice === "" || tutor.price <= maxPrice) &&
      (availability === "" ||
        tutor.availability?.includes(availability))
    );
  });

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">
        Find Tutors 🔍
      </h2>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-4 mb-8">

        <input
          type="text"
          placeholder="Search tutor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 border rounded text-black dark:text-black"
        />

        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="p-3 border rounded dark:text-black"
        >
          <option value="">All Subjects</option>
          <option value="Mathematics">Mathematics</option>
          <option value="Physics">Physics</option>
          <option value="Chemistry">Chemistry</option>
        </select>

        <input
          type="number"
          placeholder="Min Rating"
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
          className="p-3 border rounded dark:text-black"
        />

        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="p-3 border rounded dark:text-black"
        />

        <input
          type="text"
          placeholder="Time (e.g. 10:00 AM)"
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
          className="p-3 border rounded dark:text-black"
        />
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-3 gap-6">
        {filteredTutors.map((tutor) => (
          <div
            key={tutor._id}
            className="p-5 rounded-2xl border"
          >
            <h3 className="text-xl font-semibold">
              {tutor.name}
            </h3>

            <p>{tutor.subject}</p>
            <p>⭐ {tutor.rating || 0}</p>
            <p>₹{tutor.price}/hr</p>

            {/* ✅ SHOW REVIEWS */}
            <div className="mt-2 text-sm text-gray-400">
              {reviewsMap[tutor._id]?.length > 0 ? (
                reviewsMap[tutor._id].map((r, i) => (
                  <p key={i}>
                    ⭐ {r.rating} - {r.comment}
                  </p>
                ))
              ) : (
                <p>No reviews yet</p>
              )}
            </div>

            <button
              onClick={() => setSelectedTutor(tutor)}
              className="mt-4 w-full py-2 bg-purple-500 text-white rounded"
            >
              Book Lesson
            </button>
          </div>
        ))}
      </div>

      {selectedTutor && (
        <BookingModal
          tutor={selectedTutor}
          onClose={() => setSelectedTutor(null)}
        />
      )}
    </div>
  );
};

export default FindTutors;