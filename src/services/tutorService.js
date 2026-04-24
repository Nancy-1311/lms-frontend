import axios from "axios";

const API = "https://lms-backend-2r7y.onrender.com/api/tutors";

export const getTutors = async () => {
  const res = await axios.get(API);
  return res.data;
};