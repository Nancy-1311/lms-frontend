import axios from "axios";

export const startPayment = async (data) => {
  try{
  const res = await axios.post(
    "https://lms-backend-2r7y.onrender.com/api/payment/checkout",
    {
      name: data.name,
      price: data.price,
      bookingId : data.bookingId,
      tutorId: data.tutorId,
    }
  );

  window.location.href = res.data.url;

} catch (err) {
  console.error("Payment error:", err);
}
};