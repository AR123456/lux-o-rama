// vars
let sensor = null;
let readings = [];
let minLux = Infinity,
  maxLux = -Infinity,
  sumLux = 0;
const MAX_HISTORY = 120;
