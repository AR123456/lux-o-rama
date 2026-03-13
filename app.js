// vars
let sensor = null;
let readings = [];
let minLux = Infinity,
  maxLux = -Infinity,
  sumLux = 0;
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
  val.textContent - lux < 10 ? lex.toFixed(1) : Math.round(lux);
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
}
