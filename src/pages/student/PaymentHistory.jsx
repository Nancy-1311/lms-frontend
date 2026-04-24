import { useEffect, useState } from "react";
import axios from "axios";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await axios.get(
        "https://lms-backend-2r7y.onrender.com/api/payment/my-payments",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

     const formatted = res.data.map((p) => ({
  _id: p._id,

  tutorName: p.tutorName,
  subject: p.subject,

  price: p.price,
  date: p.date,
  time: p.time,

  isPaid: p.status === "paid",
  status: p.status,

  transactionId: p.transactionId,
  paymentMethod: p.paymentMethod,
}));

      setPayments(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredPayments = payments.filter((p) => {
    const matchName =
      p.tutorName?.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      status === ""
        ? true
        : status === "paid"
        ? p.isPaid
        : !p.isPaid;

    const matchSubject =
      subject === ""
        ? true
        : p.subject?.toLowerCase().includes(subject.toLowerCase());

    const matchDate =
      date === ""
        ? true
        : p.date &&
          new Date(p.date).toLocaleDateString() ===
            new Date(date).toLocaleDateString();

    return matchName && matchStatus && matchSubject && matchDate;
  });

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">
        Payment History 💳
      </h2>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by Tutor"
          className="p-2 border rounded text-black"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          type="text"
          placeholder="Search by Subject"
          className="p-2 border rounded text-black"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <select
          className="p-2 border rounded text-black"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
        </select>

        <input
          type="date"
          className="p-2 border rounded text-black"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {filteredPayments.length === 0 ? (
        <p className="text-gray-400">
          No payments found
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {filteredPayments.map((p) => (
            <div
              key={p._id}
              className="p-5 rounded-2xl bg-white dark:bg-gray-900 border"
            >
              {/* Tutor */}
              <h3 className="text-xl font-semibold">
                {p.tutorName}
              </h3>

              {/* Subject */}
              <p className="text-gray-400 text-sm mt-1">
                {p.subject}
              </p>

              {/* Amount */}
              <p className="text-green-500 font-bold mt-2">
                ₹{p.price}
              </p>

              {/* Date */}
              <p className="text-gray-400 text-sm mt-1">
                {p.date
                  ? new Date(p.date).toLocaleDateString()
                  : "No Date"}
              </p>

              {/* Time */}
              <p className="text-gray-400 text-sm">
                {p.time || "No Time"}
              </p>

              {/* Status */}
              <p
                className={`mt-2 font-semibold ${
                  p.isPaid
                    ? "text-green-500"
                    : "text-yellow-500"
                }`}
              >
                {p.status === "paid"
  ? "Paid ✅"
  : p.status === "pending"
  ? "Pending ⏳"
  : "Failed ❌"}
              </p>

              <p className="text-xs text-gray-500 mt-2">
                TXN: {p.transactionId}
              </p>

              <p className="text-xs text-gray-500">
                Method: {p.paymentMethod}
              </p>

              <p className="text-xs text-gray-500">
  Status: {p.status}
</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;