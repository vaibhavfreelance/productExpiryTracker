// utils/startExpiryNotifier.js
import axios from "../axios";

// 🔧 Normalize date to remove time
const cleanDate = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

export function startExpiryNotifier() {
  let permissionAsked = false;

  const requestPermission = async () => {
    if (!("Notification" in window)) {
      console.warn("❌ This browser does not support notifications.");
      return false;
    }

    if (Notification.permission === "granted") return true;

    if (!permissionAsked) {
      permissionAsked = true; // avoid spamming
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }

    return false;
  };

  const notifyUser = async () => {
    try {
      const allowed = await requestPermission();
      if (!allowed) {
        console.log("🔕 Notification permission denied or not granted yet");
        return;
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

        // ✅ Show notification
        new Notification("⚠️ Expiry Reminder", {
          body: message,
          icon: "/icons/pwa-icon-192.png", // must exist in public/icons/
        });

        console.log("✅ Notification sent:", message);
      });
    } catch (err) {
      console.error("🔴 Notification error:", err.message);
    }
  };

  // ✅ Ask permission when user first interacts (click/tap)
  window.addEventListener(
    "click",
    async () => {
      if (await requestPermission()) {
        console.log("✅ Notification permission granted after click");
      }
    },
    { once: true }
  );

  // ✅ Run once on start (only if permission already granted)
  if (Notification.permission === "granted") {
    notifyUser();
  }

  // ✅ Run every 2 hours (only if tab is hidden)
  setInterval(() => {
    if (document.visibilityState === "hidden") {
      notifyUser();
    }
  }, 2 * 60 * 60 * 1000);

  // ✅ Dev mode: run every 15 sec
  if (import.meta.env.DEV) {
    setInterval(notifyUser, 15000);
  }
}
