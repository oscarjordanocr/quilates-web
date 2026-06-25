const CACHE_DURATION_MS = 12 * 60 * 60 * 1000; // 12 horas

let cachedData = null;
let cacheTimestamp = null;

exports.handler = async function (event, context) {
  const API_KEY = process.env.GOLDAPI_KEY;

  const now = Date.now();
  if (cachedData && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION_MS) {
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(cachedData),
    };
  }

  try {
    const response = await fetch("https://www.goldapi.io/api/XAU/USD", {
      headers: {
        "x-access-token": API_KEY,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("GoldAPI error " + response.status);

    const data = await response.json();
    const g = data.price / 31.1035;

    cachedData = {
      price_24k: parseFloat(g.toFixed(4)),
      price_22k: parseFloat((g * 0.9167).toFixed(4)),
      price_18k: parseFloat((g * 0.75).toFixed(4)),
      price_14k: parseFloat((g * 0.5833).toFixed(4)),
      price_per_oz: data.price,
      change_24h: data.ch || 0,
      currency: "USD",
    };
    cacheTimestamp = now;

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(cachedData),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
