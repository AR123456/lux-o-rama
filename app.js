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
}
