class BuzzKillApp {
    constructor() {
        this.batteryLevel = 100;
        this.isCharging = false;
        this.threshold = 20;
        this.checkInterval = 1000;
        this.batteryDrainRate = 0.1;
        this.animationFrame = null;

        this.init();
    }

    init() {
        this.cacheElements();
        this.setupEventListeners();
        this.updateBatteryDisplay();
    }

    cacheElements() {
        this.batteryLevelEl = document.getElementById("battery-level");
        this.batteryFillEl = document.getElementById("battery-fill");
        this.statusEl = document.getElementById("status-el"); // added for real-time status
        this.startBtn = document.getElementById("start-btn");
        this.stopBtn = document.getElementById("stop-btn");
        this.thresholdSlider = document.getElementById("threshold-slider");
        this.intervalSlider = document.getElementById("interval-slider");
    }

    setupEventListeners() {
        this.startBtn.addEventListener("click", () => this.startMonitoring());
        this.stopBtn.addEventListener("click", () => this.stopMonitoring());

        this.thresholdSlider.addEventListener("input", (e) => {
            this.threshold = parseInt(e.target.value);
        });

        this.intervalSlider.addEventListener("input", (e) => {
            this.checkInterval = parseInt(e.target.value);
        });
    }

    async updateBatteryDisplay() {
        // Check if browser supports Battery API
        if (navigator.getBattery) {
            try {
                const battery = await navigator.getBattery();

                // Update status text
                this.statusEl.textContent =
                    `Charging: ${battery.charging ? "Yes" : "No"}, Level: ${(battery.level * 100).toFixed(0)}%`;

                // Update visuals
                this.batteryLevel = battery.level * 100;
                this.isCharging = battery.charging;

                this.batteryLevelEl.textContent = `${this.batteryLevel.toFixed(0)}%`;
                this.batteryFillEl.style.width = `${this.batteryLevel}%`;
                this.batteryFillEl.style.backgroundColor =
                    this.batteryLevel > this.threshold ? "#4caf50" : "#f44336";

                // Listen for changes only once
                battery.onchargingchange = () => this.updateBatteryDisplay();
                battery.onlevelchange = () => this.updateBatteryDisplay();

                return;
            } catch (e) {
                console.warn("Battery API error, falling back to simulation:", e);
            }
        }

        // ---- Fallback simulation if Battery API not supported ----
        if (!this.isCharging) {
            this.batteryLevel = Math.max(0, this.batteryLevel - this.batteryDrainRate);
        } else {
            this.batteryLevel = Math.min(100, this.batteryLevel + this.batteryDrainRate * 2);
        }

        this.batteryLevelEl.textContent = `${this.batteryLevel.toFixed(0)}%`;
        this.batteryFillEl.style.width = `${this.batteryLevel}%`;
        this.batteryFillEl.style.backgroundColor =
            this.batteryLevel > this.threshold ? "#4caf50" : "#f44336";
    }

    startMonitoring() {
        if (!this.animationFrame) {
            const loop = () => {
                this.updateBatteryDisplay();
                this.animationFrame = setTimeout(loop, this.checkInterval);
            };
            loop();
        }
    }

    stopMonitoring() {
        clearTimeout(this.animationFrame);
        this.animationFrame = null;
    }
}

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
    new BuzzKillApp();
});
