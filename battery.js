async function startMonitoring() {
  const statusEl = document.getElementById("status");

  if (!navigator.getBattery) {
    statusEl.textContent = "❌ Battery API not supported in this browser.";
    return;
  }

  const battery = await navigator.getBattery();

  function updateStatus() {
    statusEl.textContent = `Charging: ${battery.charging}, Level: ${(battery.level * 100).toFixed(0)}%`;
  }

  // Show initial status
  updateStatus();

  // Event listeners
  battery.addEventListener("chargingchange", () => {
    if (battery.charging) {
      alert("🔌 Charger Plugged In");
      setTimeout(() => {
        if (!battery.charging) {
          alert("⚠ Plugged in but NOT charging! Check charger.");
        }
      }, 5000);
    } else {
      alert("❌ Charger Unplugged");
    }
    updateStatus();
  });

  battery.addEventListener("levelchange", updateStatus);
}

startMonitoring();
