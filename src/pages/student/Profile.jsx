import { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [originalUser, setOriginalUser] = useState(null);
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
    profilePic: "", 
  });

  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const [passwords, setPasswords] = useState({
  currentPassword: "",
  newPassword: "",
});

const handlePasswordChange = async () => {
  try {
    await axios.put(
      "https://lms-backend-2r7y.onrender.com/api/auth/change-password",
      passwords,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    alert("Password updated successfully ✅");

    setPasswords({
      currentPassword: "",
      newPassword: "",
    });

  } catch (err) {
    alert(err.response?.data?.message || "Error updating password");
  }
};

const handleCancel = () => {
  setUser(originalUser); 
  setEditing(false);
};

const startEditing = () => {
  setOriginalUser(user);
  setEditing(true);
};

  const fetchProfile = async () => {
    const res = await axios.get(
      "https://lms-backend-2r7y.onrender.com/api/auth/me",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    setUser(res.data);
    setOriginalUser(res.data);
  };
  
  const handleSave = async () => {
  try {
    await axios.put(
      "https://lms-backend-2r7y.onrender.com/api/auth/me",
      {
        name: user.name,
        profilePic: user.profilePic,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    setEditing(false);
    setOriginalUser(user); 

    alert("Profile updated ✅");
  } catch (err) {
    alert("Update failed ❌");
  }
};
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setUser((prev) => ({
        ...prev,
        profilePic: reader.result, 
      }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">
        My Profile 👤
      </h2>

      <div className="p-6 rounded-2xl 
      bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">

        {/* PROFILE HEADER */}
        <div className="flex items-center gap-4 mb-6">
        
          <div className="w-16 h-16 rounded-full overflow-hidden bg-purple-500 flex items-center justify-center text-white text-xl">
            {user.profilePic ? (
              <img
                src={user.profilePic}
                alt="profile"
                className="w-full h-full object-cover"
              />
            ) : (
              user.name?.charAt(0)
            )}
          </div>

          <div>
            <p className="text-lg font-semibold">{user.name}</p>
            <span className="text-sm px-2 py-1 bg-gray-700 rounded-lg">
              {user.role}
            </span>
          </div>
        </div>

        {editing && (
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mb-4"
          />
        )}
        
        {editing ? (
  <input
    type="text"
    value={user.name}
    onChange={(e) =>
      setUser({ ...user, name: e.target.value })
    }
    className="w-full p-3 mb-3 rounded-lg border dark:bg-gray-800 dark:text-white"
  />
) : (
  <div className="w-full p-3 mb-3 rounded-lg border bg-gray-100 dark:bg-gray-800">
    {user.name}
  </div>
)}

        <input
          type="text"
          value={user.email}
          disabled
          className="w-full p-3 mb-4 rounded-lg border 
          dark:bg-gray-800 dark:text-white"
        />

        {/* CHANGE PASSWORD */}
<div className="mt-6 border-t pt-4">
  <h3 className="text-lg font-semibold mb-2">Change Password 🔒</h3>

  <input
  type="password"
  placeholder="Current Password"
  value={passwords.currentPassword}
  disabled={!editing}   // ✅ ADD THIS
  onChange={(e) =>
    setPasswords({ ...passwords, currentPassword: e.target.value })
  }
  className={`w-full p-3 mb-2 rounded-lg border 
    dark:bg-gray-800 dark:text-white 
    ${!editing ? "opacity-50 cursor-not-allowed" : ""}`}
/>

  <input
  type="password"
  placeholder="New Password"
  value={passwords.newPassword}
  disabled={!editing}   // ✅ ADD
  onChange={(e) =>
    setPasswords({ ...passwords, newPassword: e.target.value })
  }
  className={`w-full p-3 mb-2 rounded-lg border 
    dark:bg-gray-800 dark:text-white 
    ${!editing ? "opacity-50 cursor-not-allowed" : ""}`}
/>

 <button
  onClick={handlePasswordChange}
  disabled={!editing}   // ✅ ADD
  className={`w-full py-2 text-white rounded-lg 
    ${editing ? "bg-red-500" : "bg-gray-500 cursor-not-allowed"}`}
>
  Update Password
</button>
</div>

        {/* ROLE BASED SECTION */}
        {user.role === "student" && (
          <div className="mb-4 p-4 rounded-lg bg-gray-800 text-sm">
            🎓 You are enrolled as a student.
          </div>
        )}

        {user.role === "tutor" && (
          <div className="mb-4 p-4 rounded-lg bg-gray-800 text-sm">
            👨‍🏫 You are a tutor.
          </div>
        )}

        {user.role === "admin" && (
          <div className="mb-4 p-4 rounded-lg bg-gray-800 text-sm">
            👨‍💼 Admin access enabled.
          </div>
        )}

        {/* BUTTON */}
        {editing ? (
  <div className="flex gap-3">
    <button
      onClick={handleSave}
      className="w-1/2 py-3 rounded-xl bg-green-500 text-white"
    >
      Save Changes ✅
    </button>

    <button
      onClick={handleCancel}
      className="w-1/2 py-3 rounded-xl bg-gray-500 text-white"
    >
      Cancel ❌
    </button>
  </div>
) : (
  <button
    onClick={startEditing}
    className="w-full py-3 rounded-xl 
    bg-gradient-to-r from-purple-500 to-blue-500 text-white"
  >
    Edit Profile ✏️
  </button>
)}
      </div>
    </div>
  );
};

export default Profile;






