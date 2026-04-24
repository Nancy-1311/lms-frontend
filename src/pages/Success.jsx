import { useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Success = () => {
  const navigate = useNavigate();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const confirmPayment = async () => {
      try {
        const params = new URLSearchParams(window.location.search);

        const bookingId = params.get("bookingId");
        const session_id = params.get("session_id");

        if (!bookingId) {
          console.error("❌ No bookingId found");
          return;
        }

        await axios.post(
          "https://lms-backend-2r7y.onrender.com/api/payment/confirm",
          { bookingId, session_id},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        console.log("✅ Payment confirmed");

      } catch (err) {
        console.error("❌ Confirm error:", err);
      }

        setTimeout(() => {
          navigate("/lessons");
        }, 2000);
    };

    confirmPayment();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen text-center">
      <div>
        <h1 className="text-3xl font-bold text-green-500">
          Payment Successful 🎉
        </h1>

        <p className="mt-4 text-gray-400">
          Your lesson has been booked successfully!
        </p>

        <p className="mt-2 text-sm text-gray-500">
          Redirecting to your lessons...
        </p>
      </div>
    </div>
  );
};

export default Success;