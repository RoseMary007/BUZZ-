let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let oscillator = null;
let interval = null;

// Start alarm (beeping sound)
function startAlarm() {
  if (!interval) {
    interval = setInterval(() => {
      // Create a short beep
      let osc = audioCtx.createOscillator();
      osc.type = "sine";  // sound type
      osc.frequency.setValueAtTime(800, audioCtx.currentTime); // pitch
      osc.connect(audioCtx.destination);
      osc.start();

      // Stop this beep after 300ms
      setTimeout(() => {
        osc.stop();
        osc.disconnect();
      }, 300);
    }, 1000); // repeat every 1 second
  }
}

// Stop alarm completely
function stopAlarm() {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
}