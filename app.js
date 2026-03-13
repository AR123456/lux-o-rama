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
