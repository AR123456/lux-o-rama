// vars
let sensor = null;
let readings = [];
let minLux = Infinity,
  maxLux = -Infinity,
  sumLux = 0;
let countLux = 0;
const MAX_HISTORY = 120;
const ENV_LABELS = ["DARK", "DIM", "INDOOR", "BRIGHT", "OUTDOOR", "DIRECT SUN"];

function getLuxLabel(lux) {
  if (lux < 1) return "DARK";
  if (lux < 50) return "DIM";
  if (lux < 500) return "INDOOR";
  if (lux < 5000) return "BRIGHT INDOOR";
  if (lux < 50000) return "OUTDOOR";
  return "DIRECT SUNLIGHT";
}
function getDialOffset(lux) {
  // Log scale: 0 lux → 0%, 100000+ lux → 100%
  if (lux <= 0) return 565;
  const pct = Math.min(Math.log10(lux + 1) / Math.log10(100001), 1);
  return 565 * (1 - pct);
}

function getDialColor(lux) {
  if (lux < 50) return "#00ffe7";
  if (lux < 5000) return "#ffe600";
  return "#ff4d00";
}
function updateDisplay(lux) {
  const val = document.getElementById("luxValue");
  const label = document.getElementById("luxLabel");
  const dial = document.getElementById("dialFill");
  val.textContent = lux < 10 ? lex.toFixed(1) : Math.round(lux);
  label.textContent = getLuxLabel(lux);
  const color = getDialColor(lux);
  val.style.color = color;
  val.style.textShadow = `0 0 30px ${color}, 0 0 80px ${color}33`;
  dial.style.strokeDashoffset = getDialOffset(lux);
  dial.style.stroke = color;
  dial.style.filter = `drop-shadow(0 0 8px ${color})`;
  // Update stats
  minLux = Math.min(minLux, lux);
  maxLux = Math.max(maxLux, lux);
  sumLux += lux;
  countLux++;

  document.getElementById("minVal").textContent =
    minLux < 10 ? minLux.toFixed(1) : Math.round(minLux);
  document.getElementById("maxVal").textContent =
    maxLux < 10 ? maxLux.toFixed(1) : Math.round(maxLux);
  document.getElementById("avgVal").textContent =
    sumLux / countLux < 10
      ? (sumLux / countLux).toFixed(1)
      : Math.round(sumLux / countLux);
  // History
  readings.push(lux);
  if (readings.length > MAX_HISTORY) readings.shift();
  document.getElementById("sampleCount").textContent =
    `${readings.length} samples`;
  updateSparkline();
  updateEnvBar(lux);
}
function updateSparkline() {
  if (readings.length < 2) return;
  const w = 300,
    h = 50;
  const maxV = Math.max(...readings) || 1;
  const minV = Math.min(...readings);
  const range = maxV - minV || 1;
  const pts = readings.map((v, i) => {
    const x = (i / (readings.length - 1)) * w;
    const y = h - ((v - minV) / range) * (h - 6) - 3;
    return `${x},${y}`;
  });
  const d = "M" + pts.join("L");
  const area = d + `L${w},${h} L0,${h}Z`;
  document.getElementById("sparkPath").setAttribute("d", d);
  document.getElementById("sparkArea").setAttribute("d", area);
}
function updateEnvBar(lux) {
  let activeIdx = 0;
  if (lux >= 50000) activeIdx = 5;
  else if (lux >= 5000) activeIdx = 4;
  else if (lux >= 500) activeIdx = 3;
  else if (lux >= 50) activeIdx = 2;
  else if (lux >= 1) activeIdx = 1;
  else activeIdx = 0;

  for (let i = 0; i < 6; i++) {
    const seg = document.getElementById(`seg${i}`);
    seg.classList.toggle("active", i <= activeIdx);
  }
}
function setStatus(msg, active) {
  document.getElementById("status").innerHTML =
    `<span class="dot${active ? " active" : ""}"></span>${msg}`;
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

async function startSensor() {
  if (!("AmbientLightSensor" in window)) {
    setStatus(
      "AmbientLightSensor API NOT SUPPORTED ON THIS BROWSER/DEVICE",
      false,
    );
    document.getElementById("luxLabel").textContent = "UNSUPPORTED";
    return;
  }

  try {
    // Request permission
    const result = await navigator.permissions.query({
      name: "ambient-light-sensor",
    });
    if (result.state === "denied") {
      setStatus("PERMISSION DENIED — CHECK SITE SETTINGS", false);
      return;
    }

    sensor = new AmbientLightSensor({ frequency: 5 });

    sensor.addEventListener("reading", () => {
      updateDisplay(sensor.illuminance);
    });

    sensor.addEventListener("error", (e) => {
      setStatus(`SENSOR ERROR: ${e.error.name}`, false);
      stopSensor();
    });

    sensor.start();
    setStatus("READING AMBIENT LIGHT SENSOR...", true);
    document.getElementById("startBtn").style.display = "none";
    document.getElementById("stopBtn").style.display = "";
  } catch (e) {
    setStatus(`ERROR: ${e.message}`, false);
  }
}

function resetStats() {
  minLux = Infinity;
  maxLux = -Infinity;
  sumLux = 0;
  countLux = 0;
  readings = [];
  document.getElementById("minVal").textContent = "---";
  document.getElementById("maxVal").textContent = "---";
  document.getElementById("avgVal").textContent = "---";
  document.getElementById("sampleCount").textContent = "0 samples";
  document.getElementById("sparkPath").setAttribute("d", "");
  document.getElementById("sparkArea").setAttribute("d", "");
  for (let i = 0; i < 6; i++)
    document.getElementById(`seg${i}`).classList.remove("active");
}
