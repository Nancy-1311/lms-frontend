import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
const TutorDashboard = () => {
  const [tutor, setTutor] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [newSlot, setNewSlot] = useState("");
  const [isEditing, setIsEditing] = useState(false);

   const isValidTime = (time) => {
    return /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i.test(time);
  };

 const formatTime = (time) => {
  const [hour, minute] = time.split(":");
  let h = parseInt(hour);

  const suffix = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;

  return `${h}:${minute} ${suffix}`;
};

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTutor();
    fetchDashboard();
  }, []);

  // FETCH TUTOR PROFILE
  const fetchTutor = async () => {
    const res = await axios.get(
      "https://lms-backend-2r7y.onrender.com/api/tutors/me",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setTutor(res.data);
  };

  // FETCH DASHBOARD
  const fetchDashboard = async () => {
    const res = await axios.get(
      "https://lms-backend-2r7y.onrender.com/api/tutors/dashboard",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setDashboard(res.data);
  };

  if (!tutor?.isApproved) {
  return (
    <div className="p-6 text-center">
      <h2 className="text-xl font-semibold text-yellow-500">
        ⏳ Your tutor account is under review
      </h2>
      <p className="text-gray-400 mt-2">
        You will be able to accept bookings once approved by admin.
      </p>
    </div>
  );
}

  //UPLOAD RECORDING
  const uploadRecording = async (id, url) => {
    try {
      await axios.put(
        `https://lms-backend-2r7y.onrender.com/api/bookings/${id}/recording`,
        { recordingUrl: url },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Recording uploaded ✅");
      fetchDashboard(); // refresh
    } catch (err) {
      console.error(err);
    }
  };

  const updateProfile = async () => {
    try {
      await axios.put(
        "https://lms-backend-2r7y.onrender.com/api/tutors/me",
        tutor,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Profile updated ✅");
    } catch (err) {
      console.error(err);
    }
  };

 const addSlot = () => {
  if (!newSlot) {
    alert("Please select time");
    return;
  }

  setTutor({
    ...tutor,
    availability: [...(tutor.availability || []), newSlot], // ✅ store raw 24h
  });

  setNewSlot("");
};

  // UPDATE FIELD
  const updateField = (field, value) => {
    setTutor((prev) => ({ ...prev, [field]: value }));
  };

  // SAVE PROFILE
  const saveProfile = async () => {
    await axios.put(
      "https://lms-backend-2r7y.onrender.com/api/tutors/me",
      {
        bio: tutor.bio,
        experience: tutor.experience,
        expertise: tutor.expertise,
         availability: tutor.availability, 
      price: tutor.price, 
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    alert("Profile updated ✅");
    fetchTutor();
  };
  
  if (!tutor) return <p>No tutor profile found</p>;

return (
  <div>

    {dashboard && (
      <div className="grid grid-cols-5 gap-6 mb-6">
        <div className="p-4 border rounded-xl">
          <p>Total</p>
          <h3 className="text-xl font-bold">{dashboard.total}</h3>
        </div>

        <div className="p-4 border rounded-xl">
          <p>Upcoming</p>
          <h3 className="text-xl font-bold">{dashboard.upcoming}</h3>
        </div>

        <div className="p-4 border rounded-xl">
          <p>Completed</p>
          <h3 className="text-xl font-bold">{dashboard.completed}</h3>
        </div>

        <div className="p-4 border rounded-xl">
          <p>Earnings</p>
          <h3 className="text-xl font-bold text-green-500">
            ₹{dashboard.totalEarnings || 0}
          </h3>
        </div>

        <div className="p-4 border rounded-xl">
          <p>Students</p>
          <h3 className="text-xl font-bold">
            {dashboard.totalStudents || 0}
          </h3>
        </div>
      </div>
    )}

    {/* PROFILE */}
    <div className="p-5 rounded-2xl mb-6 bg-white dark:bg-gray-900 border">
      <h3 className="text-xl font-semibold">{tutor.name}</h3>
      <p className="text-gray-400">{tutor.subject}</p>

      {/* AVAILABILITY */}
      <div className="mt-3 flex flex-wrap gap-2">
        {tutor.availability?.map((slot) => (
          <span
            key={slot}
            className="px-3 py-1 bg-purple-500 text-white rounded"
          >
            {formatTime(slot)}
          </span>
        ))}
      </div>

      {/* ADD SLOT */}
      <div className="mt-4 flex gap-2 items-center">
        <label className="text-sm text-gray-400">Select Time</label>

        <input
          type="time"
          value={newSlot}
          onChange={(e) => setNewSlot(e.target.value)}
          disabled={!isEditing}
          className="p-2 border rounded w-full dark:bg-black"
        />

        <button
          onClick={addSlot}
          disabled={!isEditing}
          className="px-4 bg-green-500 text-white rounded"
        >
          Add
        </button>
      </div>

      {/* PRICE */}
      <div className="mt-4">
        <label className="block text-sm mb-1">
          Price per hour (₹)
        </label>

        <input
          type="number"
          value={tutor.price || ""}
          onChange={(e) =>
            setTutor({ ...tutor, price: e.target.value })
          }
          disabled={!isEditing}
          className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
        />

        {isEditing && (
          <button
            onClick={updateProfile}
            className="mt-2 w-full py-2 bg-green-500 text-white rounded"
          >
            Update Price 💰
          </button>
        )}
      </div>

      {/* PROFILE EDIT */}
      <div className="mt-4 space-y-2">

        <input
          type="text"
          placeholder="Bio"
          value={tutor.bio || ""}
          onChange={(e) =>
            updateField("bio", e.target.value)
          }
          disabled={!isEditing}
          className="w-full p-2 border rounded dark:bg-black"
        />

        <input
          type="text"
          placeholder="Experience"
          value={tutor.experience || ""}
          onChange={(e) =>
            updateField("experience", e.target.value)
          }
          disabled={!isEditing}
          className="w-full p-2 border rounded dark:bg-black"
        />

        <input
          type="text"
          placeholder="Expertise"
          value={tutor.expertise || ""}
          onChange={(e) =>
            updateField("expertise", e.target.value)
          }
          disabled={!isEditing}
          className="w-full p-2 border rounded dark:bg-black"
        />

        {/* BUTTONS */}
        <div className="flex gap-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 py-2 bg-blue-500 text-white rounded"
            >
              Edit ✏️
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  saveProfile();
                  setIsEditing(false);
                }}
                className="flex-1 py-2 bg-green-500 text-white rounded"
              >
                Save ✅
              </button>

              <button
                onClick={() => {
                  fetchTutor();
                  setIsEditing(false);
                }}
                className="flex-1 py-2 bg-gray-500 text-white rounded"
              >
                Cancel ❌
              </button>
            </>
          )}
        </div>

      </div>
    </div>

    {/* BOOKINGS */}
    {dashboard && (
      <div>
        <h3 className="text-xl font-bold mb-3">
          Student Bookings
        </h3>

        {dashboard.bookings.map((b) => (
          <div key={b._id} className="p-3 mb-2 border rounded">
            <p><b>Student:</b> {b.student?.name}</p>
            <p><b>Email:</b> {b.student?.email}</p>
            <p><b>Date:</b> {new Date(b.date).toLocaleDateString()}</p>
            <p><b>Time:</b> {b.time}</p>
          </div>
        ))}
      </div>
    )}

    <Link
      to="/earnings"
      className="inline-block mt-6 px-4 py-2 bg-green-500 text-white rounded"
    >
      Earnings 💰
    </Link>

  </div>
);
}

export default TutorDashboard;
