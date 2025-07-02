// utils/startExpiryNotifier.js
import axios from "../axios";

// 🔧 Normalize date to remove time
const cleanDate = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

export function startExpiryNotifier() {
  const notifyUser = async () => {
    try {
      if (!("Notification" in window)) {
        console.warn("❌ This browser does not support notifications.");
        return;
      }

      // ✅ Request permission once
      if (Notification.permission !== "granted") {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          console.log("🔕 Notification permission denied");
          return;
        }
      }

      const res = await axios.get("/items");
      const today = cleanDate(new Date());

      res.data.forEach((item) => {
        const expiry = cleanDate(new Date(item.expiryDate));
        const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

        const notifyDays = [7, 6, 4, 3, 2, 1, 0];
        if (!notifyDays.includes(diffDays)) return;

        const messages = {
          7: "will expire in 1 week!",
          6: "will expire in 6 days!",
          4: "will expire in 4 days!",
          3: "will expire in 3 days!",
          2: "will expire in 2 days!",
          1: "will expire tomorrow!",
          0: "is expiring today!",
        };

        const message = `${item.name} ${messages[diffDays]}`;

        // ✅ Send notification
        new Notification("⚠️ Expiry Reminder", {
          body: message,
          icon: "/icons/pwa-icon-192.png", // ✅ this must exist in public/icons/
        });

        console.log("✅ Notification sent:", message);
      });
    } catch (err) {
      console.error("🔴 Notification error:", err.message);
    }
  };

  // ✅ Run once on start
  notifyUser();

  // ✅ Run every 2 hours (recommended)
  setInterval(() => {
    if (document.visibilityState === "hidden") {
      notifyUser();
    }
  }, 2 * 60 * 60 * 1000);

  // ✅ For testing — remove in production!
  if (import.meta.env.DEV) {
    setInterval(notifyUser, 15000); // every 15 sec
  }
}
