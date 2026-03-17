function startSensor() {
  let t = 0;
  sensor = setInterval(() => {
    const base = 300 + Math.sin(t * 0.05) * 250; // slowly drifting
    const noise = (Math.random() - 0.5) * 40;
    const lux = Math.max(0, base + noise);
    updateDisplay(lux);
    t++;
  }, 200);

  setStatus("SIMULATED SENSOR RUNNING...", true);
  document.getElementById("startBtn").style.display = "none";
  document.getElementById("stopBtn").style.display = "";
}

function stopSensor() {
  if (sensor) {
    clearInterval(sensor);
    sensor = null;
  }
  setStatus("SENSOR STOPPED", false);
  document.getElementById("startBtn").style.display = "";
  document.getElementById("stopBtn").style.display = "none";
}
