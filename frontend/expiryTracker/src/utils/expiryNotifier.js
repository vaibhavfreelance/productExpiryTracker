import axios from "../axios";

// ✅ Helper: Normalize time (set time to midnight)
const cleanDate = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0); // remove hours, minutes, seconds
  return d;
};

// ✅ Start expiry reminder
export function startExpiryNotifier() {
  const notifyUser = async () => {
    try {
      // ✅ Ask notification permission (only once)
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

        // ✅ Trigger days: 7, 6, 4, 3, 2, 1, 0
        const notifyDays = [7, 6, 4, 3, 2, 1, 0];

        if (notifyDays.includes(diffDays)) {
          let message = "";

          switch (diffDays) {
            case 7:
              message = `${item.name} will expire in 1 week!`;
              break;
            case 6:
              message = `${item.name} will expire in 6 days!`;
              break;
            case 4:
              message = `${item.name} will expire in 4 days!`;
              break;
            case 3:
              message = `${item.name} will expire in 3 days!`;
              break;
            case 2:
              message = `${item.name} will expire in 2 days!`;
              break;
            case 1:
              message = `${item.name} will expire tomorrow!`;
              break;
            case 0:
              message = `${item.name} is expiring today!`;
              break;
          }

          // ✅ Show notification
          new Notification("⚠️ Expiry Reminder", {
            body: message,
            icon: "/icon-192x192.png", // make sure this exists in /public
          });

          console.log("✅ Notification sent:", message);
        }
      });
    } catch (err) {
      console.error("🔴 Error while checking expiry:", err.message);
    }
  };

  // ✅ Run once on start
  notifyUser();

  // ✅ Run every 2 hours
  setInterval(notifyUser, 1000 * 60 * 60 * 2);

  // 🔁 For testing only — remove in production!
  setInterval(notifyUser, 15000); // every 15 seconds
}
