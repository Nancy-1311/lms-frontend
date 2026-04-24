import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const VideoRoom = () => {
  const { roomId } = useParams();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    try {
      const res = await axios.get(
        "https://lms-backend-2r7y.onrender.com/api/bookings",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const bookings = res.data;

      const hasAccess = bookings.some((b) => {
        const id = `${b.tutorName}-${b.time}`.replace(/\s+/g, "");
        return id === roomId;
      });

      setAllowed(hasAccess);

      if (hasAccess) {
        loadJitsi();
      }

    } catch (err) {
      console.error(err);
    }
  };

  const loadJitsi = () => {
    const script = document.createElement("script");
    script.src = "https://meet.jit.si/external_api.js";
    script.async = true;

    script.onload = () => {
      const domain = "meet.jit.si";

      new window.JitsiMeetExternalAPI(domain, {
        roomName: roomId,
        width: "100%",
        height: 600,
        parentNode: document.getElementById("jitsi-container"),
      });
    };

    document.body.appendChild(script);
  };

  if (!allowed) {
    return (
      <div className="p-6 text-red-500 font-bold">
        Access Denied 🚫
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        Live Class 🎥
      </h2>

      <div id="jitsi-container" className="w-full h-[600px]" />
    </div>
  );
};

export default VideoRoom;