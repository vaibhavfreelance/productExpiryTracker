import { useEffect } from "react";
import axios from "../axios";
import { useAuth } from "../context/AuthContext";

export default function NotificationManager() {
  const { token } = useAuth();

  useEffect(() => {
    if (!("Notification" in window)) return;

    Notification.requestPermission();

    const checkExpiringItems = async () => {
      try {
        const res = await axios.get("/items");
        const items = res.data;

        const now = new Date();
        const filtered = items.filter((item) => {
          const expiry = new Date(item.expiryDate);
          const diffDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
          return diffDays === 7 || diffDays === 4 || diffDays === 1;
        });

        filtered.forEach((item) => {
          const expiry = new Date(item.expiryDate);
          const diffDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));

          const message = `Item "${item.name}" will expire in ${diffDays} day${
            diffDays > 1 ? "s" : ""
          }.`;

          if (Notification.permission === "granted") {
            new Notification("Expiry Reminder", {
              body: message,
              icon: "/favicon.ico",
            });
          }
        });
      } catch (err) {
        console.error("Notification error:", err);
      }
    };

    checkExpiringItems();
    const interval = setInterval(checkExpiringItems, 2 * 60 * 60 * 1000); // every 2 hours

    return () => clearInterval(interval);
  }, [token]);

  return null;
}
