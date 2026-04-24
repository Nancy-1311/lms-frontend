import { useEffect, useState } from "react";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        "https://lms-backend-2r7y.onrender.com/api/admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  //DELETE USER
  const deleteUser = async (id) => {
    try {
      await axios.delete(
        `https://lms-backend-2r7y.onrender.com/api/admin/users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  // TOGGLE STATUS
  const toggleStatus = async (id) => {
    try {
      await axios.put(
        `https://lms-backend-2r7y.onrender.com/api/admin/users/${id}/toggle`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  //APPROVE TUTOR
  const approveTutor = async (id) => {
    try {
      await axios.put(
        `https://lms-backend-2r7y.onrender.com/api/admin/tutors/${id}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  // REJECT TUTOR
  const rejectTutor = async (id) => {
    try {
      await axios.put(
        `https://lms-backend-2r7y.onrender.com/api/admin/tutors/${id}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 dark:text-white">
        Users Management
      </h2>

      <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-xl shadow">
        <table className="w-full text-left">
          <thead className="bg-gray-100 dark:bg-gray-800 dark:text-white">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4">Tutor Approval</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody className="dark:text-white">
            {users.map((user) => (
              <tr key={user._id} className="border-b">
                {/* NAME */}
                <td className="p-4">{user.name}</td>

                {/* EMAIL */}
                <td className="p-4">{user.email}</td>

                {/* ROLE */}
                <td className="p-4 capitalize">{user.role}</td>

                {/* STATUS */}
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      user.isActive
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {user.isActive ? "Active" : "Blocked"}
                  </span>
                </td>

                {/* TUTOR APPROVAL */}
                <td className="p-4">
                  {user.role === "tutor" ? (
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        user.tutor?.approvalStatus === "approved"
                          ? "bg-green-200 text-green-800"
                          : user.tutor?.approvalStatus === "rejected"
                          ? "bg-red-200 text-red-800"
                          : "bg-yellow-200 text-yellow-800"
                      }`}
                    >
                      {user.tutor?.approvalStatus || "pending"}
                    </span>
                  ) : (
                    "-"
                  )}
                </td>

                {/* ACTIONS */}
                <td className="p-4">
                  <div className="flex flex-wrap gap-2">

                    <button
                      onClick={() => toggleStatus(user._id)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded"
                    >
                      Toggle
                    </button>

                    <button
                      onClick={() => deleteUser(user._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded"
                    >
                      Delete
                    </button>

                    {user.role === "tutor" && user.tutor && (
                      <>
                        <button
                          onClick={() => approveTutor(user.tutor._id)}
                          className="px-3 py-1 bg-green-500 text-white rounded text-xs"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => rejectTutor(user.tutor._id)}
                          className="px-3 py-1 bg-red-500 text-white rounded text-xs"
                        >
                          Reject
                        </button>
                      </>
                    )}

                  </div>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default Users;