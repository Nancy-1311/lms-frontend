import axios from "axios";

const API = "https://lms-backend-2r7y.onrender.com/api/bookings";

export const createBooking = async (data) => {
  const res = await axios.post(API, data);
  return res.data;
};

export const getBookings = async () => {
  const res = await axios.get(API);
  return res.data;
};