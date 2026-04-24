import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTutors } from "../../services/tutorService";
import axios from "axios";

const FindTutors = () => {
  const [tutors, setTutors] = useState([]);
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");

  const [minRating, setMinRating] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [availability, setAvailability] = useState("");

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchTutors();
  }, []);

  const fetchTutors = async () => {
    try {
      const data = await getTutors();
      setTutors(data);
    } catch (err) {
      console.error(err);
    }
  };

const deleteTutor = async (id) => {
  try {
    await axios.delete(
      `https://lms-backend-2r7y.onrender.com/api/tutors/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    alert("Tutor deleted ✅");

    setTutors((prev) =>
      prev.filter((t) => t._id !== id)
    );

  } catch (err) {
    console.error(err);
    alert("Only Admin can delete the tutor ❌");
  }
};

  const filteredTutors = tutors.filter((tutor) => {
  return (
    tutor.name?.toLowerCase().includes(search.toLowerCase()) &&
    (subject === "" ||
      tutor.subject?.toLowerCase().includes(subject.toLowerCase())) &&
    (minRating === "" || (tutor.rating || 0) >= Number(minRating)) &&
    (maxPrice === "" || tutor.price <= Number(maxPrice)) &&
    (availability === "" ||
      tutor.availability?.some((slot) =>
        slot.toLowerCase().includes(availability.toLowerCase())
      ))
  );
});

  const clearFilters = () => {
    setSearch("");
    setSubject("");
    setMinRating("");
    setMaxPrice("");
    setAvailability("");
  };

  return (
    <>
    <div>
      <h2 className="text-3xl font-bold mb-6">
        Find Tutors 🔍
      </h2>

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
          <option value="English">English</option>
          <option value="Hindi">Hindi</option>
          <option value="Science">Science</option>
        </select>

        <input
          type="number"
          placeholder="Min Rating ⭐"
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
          className="p-3 border rounded dark:text-black"
        />

        <input
          type="number"
          placeholder="Max Price ₹"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="p-3 border rounded dark:text-black"
        />

        <input
          type="text"
          placeholder="Time (e.g. 10:00)"
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
          className="p-3 border rounded dark:text-black"
        />

        <button
          onClick={clearFilters}
          className="px-4 py-2 bg-gray-400 text-white rounded"
        >
          Clear
        </button>
      </div>

      {filteredTutors.length === 0 ? (
        <p className="text-gray-400 text-center mt-10">
          No tutors found 😔
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {filteredTutors.map((tutor) => (
            <div
              key={tutor._id}
              className="p-5 rounded-2xl 
              bg-white dark:bg-gray-900 
              border border-gray-200 dark:border-gray-700
              shadow-lg hover:scale-105 transition-all duration-300"
            >
              <h3 className="text-xl font-semibold">
                {tutor.name}
              </h3>

              <p className="text-gray-400">
                {tutor.subject}
              </p>

              <p className="mt-2 text-yellow-500">
                ⭐ {tutor.rating || 0}
              </p>

              <p className="mt-2 text-purple-500 font-bold">
                ₹{tutor.price}/hr
              </p>

              <button
                onClick={() => navigate(`/tutors/${tutor._id}`)}
                className="mt-4 w-full py-2 rounded-xl 
                bg-gradient-to-r from-purple-500 to-blue-500 text-white"
              >
                View Profile
              </button>

              { user.role === "tutor" && (
  <button
    onClick={() => deleteTutor(tutor._id)}
    className="mt-2 w-full py-2 bg-red-500 text-white rounded"
  >
    Delete ❌
  </button>
)}
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
};

export default FindTutors;