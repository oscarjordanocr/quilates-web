exports.handler = async function (event, context) {
  const API_KEY = "goldapi-0ad17722dea2a4b8d9f487fdc5147835-io";
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
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=1800",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        price_24k: parseFloat(g.toFixed(4)),
        price_22k: parseFloat((g * 0.9167).toFixed(4)),
        price_18k: parseFloat((g * 0.75).toFixed(4)),
        price_14k: parseFloat((g * 0.5833).toFixed(4)),
        price_per_oz: data.price,
        change_24h: data.ch || 0,
        currency: "USD",
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
