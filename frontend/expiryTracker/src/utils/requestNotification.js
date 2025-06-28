export function requestNotificationPermission() {
  if (!("Notification" in window)) {
    console.warn("This browser does not support notifications.");
    return;
  }

  if (Notification.permission === "granted") {
    console.log("🔔 Notification permission already granted.");
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        console.log("🔔 Notification permission granted.");
      } else {
        console.warn("🔕 Notification permission denied.");
      }
    });
  }
}
