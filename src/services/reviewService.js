import axios from "axios";

export const getReviewsByTutor = async (tutorId) => {
  const res = await axios.get(
    `https://lms-backend-2r7y.onrender.com/api/reviews/${tutorId}`
  );
  return res.data;
};