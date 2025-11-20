const baseWeatherUrl = "http://localhost:3030/weather";

/**
 * Handles weather API responses safely.
 * @param {Response} res
 * @returns {Promise<any>}
 */
async function handleResponse(res) {
  if (!res.ok) {
    let error;
    try {
      error = await res.json();
    } catch {
      error = { message: "Server error" };
    }
    throw new Error(error.message || "Weather request failed");
  }
  return res.json();
}

/**
 * Fetch 3-day weather forecast from backend proxy
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} days - Number of forecast days
 * @returns {Promise<Array<{date: string, temp: number, code: number}>>}
 */
export async function getWeather(lat, lng, days = 3) {
  const params = new URLSearchParams({
    lat: String(lat),
    lng: String(lng),
    days: String(days),
  });

  const res = await fetch(`${baseWeatherUrl}?${params.toString()}`);
  const data = await handleResponse(res);

  if (!data.daily) {
    throw new Error("Invalid weather response");
  }

  const result = [];
  const count = Math.min(days, data.daily.time.length);

  for (let i = 0; i < count; i++) {
    result.push({
      date: data.daily.time[i],
      temp: data.daily.temperature_2m_max[i],
      code: data.daily.weathercode[i],
    });
  }

  return result;
}
