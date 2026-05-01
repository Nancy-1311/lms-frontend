import { useState } from "react";
import axios from "axios";
import { startPayment } from "../../services/paymentService";

const BookingModal = ({ tutor, onClose }) => {
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(false);

  const formatTime = (time) => {
  if (time.includes("AM") || time.includes("PM")) {
    return time;
  }

  const [hour, minute] = time.split(":");
  let h = parseInt(hour);

  const suffix = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;

  return `${h}:${minute} ${suffix}`;
};


const handlePayment = async () => {
  if (!selectedSlot || !selectedDate) {
    alert("Please select date & time");
    return;
  }

  // DATE VALIDATION FIRST
  const selectedDateObj = new Date(selectedDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDateObj < today) {
    alert("❌ You cannot book a past date");
    return;
  }

const now = new Date();

// combine date + time directly
const selectedDateTime = new Date(`${selectedDate} ${selectedSlot}`);

console.log("NOW:", now);
console.log("SELECTED:", selectedDateTime);

if (selectedDateTime < now) {
  alert("❌ You cannot book past time");
  return;
}

  try {
    setLoading(true); // moved here

    // CREATE BOOKING FIRST
    const bookingRes = await axios.post(
      "https://lms-backend-2r7y.onrender.com/api/bookings",
      {
        tutorId: tutor._id,
        // student: user._id,
        tutorName: tutor.name,
        subject: tutor.subject,
        date: selectedDate,
        time: selectedSlot,
        price: tutor.price,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const booking = bookingRes.data;

    // CREATE PAYMENT SESSION
    const paymentRes = await axios.post(
      "https://lms-backend-2r7y.onrender.com/api/payment/create-checkout-session",
      {
        name: tutor.name,
        price: tutor.price,
        bookingId: booking._id,
        tutorId: tutor._id,
      }
    );

    window.location.href = paymentRes.data.url;

  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Booking failed ❌");;
    setLoading(false);
  }
};

  const isPastTime = (date, time) => {
  if (!date || !time) return false;

  const now = new Date();

  // combine date + time safely
  const selectedDateTime = new Date(`${date} ${time}`);

  return selectedDateTime < now;
};
  

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="w-[420px] p-6 rounded-2xl 
        bg-white dark:bg-gray-900 
        text-black dark:text-white
        border border-gray-200 dark:border-gray-700 shadow-xl"
      >
        <h2 className="text-2xl font-bold mb-4">
          Book Lesson
        </h2>

        <p className="mb-4">
          <span className="font-semibold">{tutor.name}</span> -{" "}
          {tutor.subject}
        </p>

        {/* DATE */}
        <input
          type="date"
          value={selectedDate}
           min={new Date().toISOString().split("T")[0]}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full mb-4 p-2 rounded-lg border 
          dark:bg-gray-700 dark:text-white"
        />

        {/* AVAILABILITY */}
        <h3 className="mb-2 font-semibold">
          Available Slots
        </h3>

        {tutor.availability && tutor.availability.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 mb-6">
            {tutor.availability.map((slot) => (
            <button
  key={slot}
  onClick={() => setSelectedSlot(slot)}
  disabled={isPastTime(selectedDate, slot)}   
  className={`p-2 rounded-lg border transition 
  ${
    isPastTime(selectedDate, slot)
      ? "bg-gray-300 cursor-not-allowed text-gray-500"
      : selectedSlot === slot
      ? "bg-purple-500 text-white border-purple-500"
      : "border-gray-300 dark:border-gray-600 hover:bg-purple-500 hover:text-white"
  }`}
>
   {formatTime(slot)}
</button>
              // <button
              //   key={slot}
              //   onClick={() => setSelectedSlot(slot)}
              //    disabled={isPastTime(selectedDate, slot)}  
              //   className={`p-2 rounded-lg border transition 
              //   ${
              //     selectedSlot === slot
              //       ? "bg-purple-500 text-white border-purple-500"
              //       : "border-gray-300 dark:border-gray-600 hover:bg-purple-500 hover:text-white"
              //   }`}
              // >
              //   {slot}
              // </button>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 mb-4">
            No availability available
          </p>
        )}

        {/* BUTTONS */}
        <div className="flex justify-between gap-3">
          <button
            onClick={onClose}
            className="w-1/2 py-2 rounded-lg 
            bg-gray-300 dark:bg-gray-700"
          >
            Cancel
          </button>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-1/2 py-2 rounded-lg 
            bg-gradient-to-r from-purple-500 to-blue-500 text-white
            disabled:opacity-50"
          >
            {loading ? "Redirecting..." : `Pay ₹${tutor.price}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
