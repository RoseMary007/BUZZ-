// Check if browser supports Battery API
if ("getBattery" in navigator) {
  navigator.getBattery().then(function(battery) {
    
    // Function to check charging status
    function checkChargingStatus() {
      if (battery.charging === false) {
        // Pop up notification
        if (Notification.permission === "granted") {
          new Notification("⚠️ Charging Issue", {
            body: "Your phone is plugged in, but it's not charging.",
            icon: "https://cdn-icons-png.flaticon.com/512/565/565296.png" // optional icon
          });
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission().then(permission => {
            if (permission === "granted") {
              new Notification("⚠️ Charging Issue", {
                body: "Your phone is plugged in, but it's not charging."
              });
            }
          });
        }
      }
    }

    // Listen for charging change
    battery.addEventListener("chargingchange", function() {
      checkChargingStatus();
    });

    // Initial check
    checkChargingStatus();
  });
} else {
  alert("Battery API not supported on this browser.");
}

