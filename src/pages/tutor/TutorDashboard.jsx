import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const TutorDashboard = () => {
  const [tutor, setTutor] = useState(null); 
  const [newSlot, setNewSlot] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTutor();
  }, []);

  //  GET ONLY LOGGED-IN TUTOR
  const fetchTutor = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/tutors/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTutor(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  //  ADD SLOT
  const addSlot = async (availability) => {
    try {
      const updated = [...(availability || []), newSlot];

      await axios.put(
        "http://localhost:5000/api/tutors/me",
        { availability: updated },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNewSlot("");
      fetchTutor();
    } catch (err) {
      alert("Add slot failed ❌");
    }
  };

  // UPDATE FIELD
  const updateField = (field, value) => {
    setTutor((prev) => ({ ...prev, [field]: value }));
  };

  //  SAVE PROFILE
  const saveProfile = async () => {
    try {
      await axios.put(
        "http://localhost:5000/api/tutors/me",
        {
          bio: tutor.bio,
          experience: tutor.experience,
          expertise: tutor.expertise,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Profile updated ✅");
      fetchTutor();
    } catch (err) {
      console.error(err);
      alert("Update failed ❌");
    }
  };

  // DELETE PROFILE
  const deleteTutor = async () => {
    try {
      await axios.delete(
        "http://localhost:5000/api/tutors/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Deleted successfully ✅");
      setTutor(null);
    } catch (err) {
      console.error(err);
      alert("Delete failed ❌");
    }
  };

  if (!tutor) return <p>No tutor profile found.
Create your profile to start teaching.</p>;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">
        Tutor Dashboard 🎓
      </h2>

      <div className="p-5 rounded-2xl mb-6 bg-white dark:bg-gray-900 dark:text-black border">
        <h3 className="text-xl font-semibold dark:text-white">{tutor.name}</h3>
        <p className="text-gray-400">{tutor.subject}</p>

        {/* Availability */}
        <div className="mt-3 flex flex-wrap gap-2">
          {tutor.availability?.map((slot) => (
            <span
              key={slot}
              className="px-3 py-1 bg-purple-500 text-white rounded"
            >
              {slot}
            </span>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="Add time"
            value={newSlot}
            onChange={(e) => setNewSlot(e.target.value)}
            className="p-2 border rounded w-full bg-white text-black dark:bg-gray-800 dark:text-white"
          />

          <button
            onClick={() => addSlot(tutor.availability)}
            className="px-4 bg-green-500 text-white rounded"
          >
            Add
          </button>
        </div>

        {/* Profile */}
        <div className="mt-4 space-y-2">
          <input
            type="text"
            placeholder="Bio"
            value={tutor.bio || ""}
            onChange={(e) =>
              updateField("bio", e.target.value)
            }
            className="w-full p-2 border rounded"
          />

          <input
            type="text"
            placeholder="Experience"
            value={tutor.experience || ""}
            onChange={(e) =>
              updateField("experience", e.target.value)
            }
            className="w-full p-2 border rounded"
          />

          <input
            type="text"
            placeholder="Expertise"
            value={tutor.expertise || ""}
            onChange={(e) =>
              updateField("expertise", e.target.value)
            }
            className="w-full p-2 border rounded"
          />

          <div className="flex gap-2">
            <button
              onClick={saveProfile}
              className="flex-1 py-2 bg-blue-500 text-white rounded"
            >
              Save Profile
            </button>

            <button
              onClick={deleteTutor}
              className="flex-1 py-2 bg-red-500 text-white rounded"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Earnings Button */}
      <Link
        to="/earnings"
        className="inline-block mb-6 px-4 py-2 bg-green-500 text-white rounded"
      >
        Earnings 💰
      </Link>
    </div>
  );
};

export default TutorDashboard;