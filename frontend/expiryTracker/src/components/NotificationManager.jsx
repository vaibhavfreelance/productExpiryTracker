// src/components/NotificationManager.jsx
import { useEffect } from "react";
import axios from "../axios";
import { useAuth } from "../context/AuthContext";

export default function NotificationManager() {
  const { token } = useAuth();

  useEffect(() => {
    // ✅ Ensure browser supports Notification API
    if (!("Notification" in window)) {
      console.warn("❌ This browser does not support notifications.");
      return;
    }

    // ✅ Ask permission (once)
    if (Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        if (permission !== "granted") {
          console.warn("🔕 Notification permission denied.");
        }
      });
    }

    // ✅ Function to check expiring items
    const checkExpiringItems = async () => {
      try {
        const res = await axios.get("/items");
        const now = new Date();

        res.data.forEach((item) => {
          const expiry = new Date(item.expiryDate);
          const diffDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));

          // ✅ Trigger only for specific days
          const notifyDays = [7, 4, 1];
          if (!notifyDays.includes(diffDays)) return;

          const message = `🧾 Item "${
            item.name
          }" will expire in ${diffDays} day${
            diffDays > 1 ? "s" : ""
          }. Please use it soon.`;

          // ✅ Show notification
          if (Notification.permission === "granted") {
            new Notification("⚠️ Expiry Reminder", {
              body: message,
              icon: "/icons/pwa-icon-192.png", // ✅ Make sure this icon exists in /public/icons
            });

            console.log("✅ Notification sent:", message);
          }
        });
      } catch (err) {
        console.error("❌ Error while checking expiry items:", err.message);
      }
    };

    // ✅ First time call + repeat every 2 hours
    checkExpiringItems();
    const interval = setInterval(checkExpiringItems, 2 * 60 * 60 * 1000); // every 2 hours

    return () => clearInterval(interval); // Cleanup on unmount
  }, [token]);

  return null; // ✅ No UI needed
}
