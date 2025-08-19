

// BUZZ KILL JavaScript App
class BuzzKillApp {
    constructor() {
        // App State
        this.currentScreen = 'home';
        this.batteryPercentage = 61;
        this.isCharging = false;
        this.isPlugged = false;
        
        // Settings
        this.settings = {
            alertsEnabled: true,
            funSounds: false,
            lowBatteryThreshold: 30,
            criticalBatteryThreshold: 10
        };

        // Initialize app
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateBatteryDisplay();
        this.startBatterySimulation();
        this.updateSettingsDisplay();
    }

    setupEventListeners() {
        // Navigation
        const navButtons = document.querySelectorAll('.nav-button');
        navButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const screen = e.target.dataset.screen;
                this.navigateToScreen(screen);
            });
        });

        // Settings shortcut from analytics
        document.getElementById('settings-shortcut').addEventListener('click', () => {
            this.navigateToScreen('settings');
        });

        // Control buttons
        document.getElementById('plug-button').addEventListener('click', () => {
            this.togglePlugged();
        });

        document.getElementById('charge-button').addEventListener('click', () => {
            this.toggleCharging();
        });

        // Settings toggles
        const toggles = document.querySelectorAll('.toggle-switch');
        toggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                const setting = e.target.dataset.setting;
                if (setting) {
                    this.toggleSetting(setting);
                }
            });
        });

    
  navigator.getBattery().then(function(battery) {
    console.log("Battery level:", battery.level * 100 + "%");
  });



        // Settings sliders
        document.getElementById('low-threshold').addEventListener('input', (e) => {
            this.updateThreshold('lowBatteryThreshold', parseInt(e.target.value));
        });

        document.getElementById('critical-threshold').addEventListener('input', (e) => {
            this.updateThreshold('criticalBatteryThreshold', parseInt(e.target.value));
        });
    }

    navigateToScreen(screenName) {
        // Hide all screens
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => screen.classList.remove('active'));

        // Show target screen
        const targetScreen = document.getElementById(`${screenName}-screen`);
        if (targetScreen) {
            targetScreen.classList.add('active');
        }

        // Update navigation
        const navButtons = document.querySelectorAll('.nav-button');
        navButtons.forEach(button => {
            button.classList.remove('active');
            if (button.dataset.screen === screenName) {
                button.classList.add('active');
            }
        });

        this.currentScreen = screenName;
    }

    togglePlugged() {
        this.isPlugged = !this.isPlugged;
        
        // Update button text
        const plugButton = document.getElementById('plug-button');
        plugButton.textContent = this.isPlugged ? 'Unplug' : 'Plug In';
        
        // Update charge button state
        const chargeButton = document.getElementById('charge-button');
        chargeButton.disabled = !this.isPlugged;
        
        // Reset charging if unplugged
        if (!this.isPlugged) {
            this.isCharging = false;
            chargeButton.textContent = 'Start Charging';
        }
        
        this.updateBatteryDisplay();
        this.updateQuickStatus();
    }

    toggleCharging() {
        if (!this.isPlugged) return;
        
        this.isCharging = !this.isCharging;
        
        // Update button text
        const chargeButton = document.getElementById('charge-button');
        chargeButton.textContent = this.isCharging ? 'Stop Charging' : 'Start Charging';
        
        this.updateBatteryDisplay();
        this.updateQuickStatus();
    }

    toggleSetting(settingName) {
        this.settings[settingName] = !this.settings[settingName];
        this.updateSettingsDisplay();
        this.updateQuickStatus();
    }

    updateThreshold(settingName, value) {
        this.settings[settingName] = value;
        this.updateSettingsDisplay();
        this.updateQuickStatus();
    }

    updateBatteryDisplay() {
        const batteryCircle = document.getElementById('battery-circle');
        const batteryText = document.getElementById('battery-percentage');
        const batteryStatus = document.getElementById('battery-status');
        const statusIndicator = document.getElementById('status-indicator');
        const statusDot = document.getElementById('status-dot');
        const statusText = document.getElementById('status-text');
        const currentLevel = document.getElementById('current-level');

        // Update percentage
        batteryText.textContent = `${this.batteryPercentage}%`;
        if (currentLevel) {
            currentLevel.textContent = `${this.batteryPercentage}%`;
        }

        // Get colors based on battery level
        const { color, glowColor } = this.getBatteryColors();

        // Update circle progress
        const progressDegrees = (this.batteryPercentage / 100) * 360;
        batteryCircle.style.background = `conic-gradient(from 0deg, ${color} ${progressDegrees}deg, #333 ${progressDegrees}deg)`;
        batteryCircle.style.boxShadow = `0 0 30px ${glowColor}, inset 0 0 30px ${glowColor}`;

        // Update text color and glow
        batteryText.style.color = color;
        batteryText.style.textShadow = `0 0 20px ${color}, 0 0 40px ${color}`;

        // Update status text
        let status = 'BATTERY';
        if (this.isCharging) {
            status = 'CHARGING';
        } else if (this.isPlugged) {
            status = 'PLUGGED';
        }
        batteryStatus.textContent = status;

        // Update status indicator
        if (this.isPlugged) {
            statusIndicator.style.display = 'flex';
            const indicatorColor = this.isCharging ? '#00ff00' : '#ff8000';
            statusDot.style.backgroundColor = indicatorColor;
            statusDot.style.boxShadow = `0 0 10px ${indicatorColor}`;
            statusText.textContent = this.isCharging ? 'Charging' : 'Plugged - Not Charging';
            statusText.className = this.isCharging ? 'status-text' : 'status-text';
        } else {
            statusIndicator.style.display = 'none';
        }
    }

    getBatteryColors() {
        if (this.batteryPercentage <= 10) {
            return {
                color: '#ff0040',
                glowColor: 'rgba(255, 0, 64, 0.8)'
            };
        } else if (this.batteryPercentage <= 30) {
            return {
                color: '#ff8000',
                glowColor: 'rgba(255, 128, 0, 0.8)'
            };
        } else {
            return {
                color: '#00ff00',
                glowColor: 'rgba(0, 255, 0, 0.8)'
            };
        }
    }

    updateQuickStatus() {
        const quickStatus = document.getElementById('quick-status');
        let statusHtml = '';

        if (this.settings.alertsEnabled && this.batteryPercentage <= this.settings.criticalBatteryThreshold) {
            statusHtml = '<div class="neon-red">❗ CRITICAL BATTERY - CHARGE NOW!</div>';
        } else if (this.settings.alertsEnabled && this.batteryPercentage > this.settings.criticalBatteryThreshold && this.batteryPercentage <= this.settings.lowBatteryThreshold) {
            statusHtml = '<div class="neon-orange">⚠️ LOW BATTERY - CHARGE SOON</div>';
        }

        if (this.isPlugged && !this.isCharging) {
            statusHtml = '<div class="neon-orange">🔌 PLUGGED BUT NOT CHARGING</div>';
        }

        quickStatus.innerHTML = statusHtml;
    }

    updateSettingsDisplay() {
        // Update toggles
        const alertsToggle = document.getElementById('alerts-toggle');
        const soundsToggle = document.getElementById('sounds-toggle');
        
        alertsToggle.classList.toggle('active', this.settings.alertsEnabled);
        soundsToggle.classList.toggle('active', this.settings.funSounds);

        // Update threshold sliders and displays
        const lowThresholdSlider = document.getElementById('low-threshold');
        const criticalThresholdSlider = document.getElementById('critical-threshold');
        const lowThresholdDisplay = document.getElementById('low-threshold-display');
        const criticalThresholdDisplay = document.getElementById('critical-threshold-display');

        lowThresholdSlider.value = this.settings.lowBatteryThreshold;
        criticalThresholdSlider.value = this.settings.criticalBatteryThreshold;
        lowThresholdDisplay.textContent = this.settings.lowBatteryThreshold;
        criticalThresholdDisplay.textContent = this.settings.criticalBatteryThreshold;

        // Update slider backgrounds
        const lowProgress = ((this.settings.lowBatteryThreshold - 15) / 35) * 100;
        const criticalProgress = ((this.settings.criticalBatteryThreshold - 5) / 20) * 100;

        lowThresholdSlider.style.background = `linear-gradient(to right, #ff8000 0%, #ff8000 ${lowProgress}%, #333 ${lowProgress}%, #333 100%)`;
        criticalThresholdSlider.style.background = `linear-gradient(to right, #ff0040 0%, #ff0040 ${criticalProgress}%, #333 ${criticalProgress}%, #333 100%)`;
    }

    startBatterySimulation() {
        setInterval(() => {
            // Simulate battery changes
            const change = Math.random() > 0.5 ? 1 : -1;
            const newValue = this.batteryPercentage + change;
            this.batteryPercentage = Math.max(0, Math.min(100, newValue));
            
            this.updateBatteryDisplay();
            this.updateQuickStatus();
        }, 3000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BuzzKillApp();
});

// Add some utility functions for enhanced functionality
function showNotification(message, type = 'info') {
    // Create a simple notification system
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        background: rgba(0, 0, 0, 0.9);
        border: 1px solid ${type === 'error' ? '#ff0040' : type === 'warning' ? '#ff8000' : '#00ffff'};
        color: white;
        border-radius: 8px;
        z-index: 1000;
        font-family: 'Iceberg', sans-serif;
        box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
        animation: slideIn 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS for notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);