import { useParams, Link, useNavigate, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { getPlaceById, deletePlace } from "../../api/placesApi";
import { getWeather } from "../../api/weatherApi";   // ⬅ NEW import

export default function DetailsPage() {
  const { id } = useParams();

  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [weather, setWeather] = useState(null);        // ⬅ NEW
  const [weatherError, setWeatherError] = useState(""); // ⬅ NEW

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;

  /* ===========================
        WEATHER ICON LOGIC
     =========================== */
  function getWeatherIcon(code) {
    if ([0].includes(code)) return "☀️";
    if ([1, 2].includes(code)) return "⛅";
    if ([3].includes(code)) return "☁️";
    if ([45, 48].includes(code)) return "🌫️";
    if ([51, 53, 55].includes(code)) return "🌦️";
    if ([61, 63, 65, 80, 81, 82].includes(code)) return "🌧️";
    if ([71, 73, 75].includes(code)) return "❄️";
    if ([95, 96, 99].includes(code)) return "⛈️";
    return "🌡️";
  }

  /* ===========================
         DELETE BUTTON
     =========================== */
  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete: ${place.title}?`
    );
    if (!confirmed) return;

    try {
      await deletePlace(id);
      navigate("/places");
    } catch (err) {
      alert("Unable to delete place: " + err.message);
    }
  };

  /* ===========================
          BACK BUTTON
     =========================== */
  const handleBack = () => {
    if (from === "home") navigate("/");
    else navigate("/places");
  };

  /* ===========================
      FETCH PLACE DETAILS
     =========================== */
  useEffect(() => {
    getPlaceById(id)
      .then((data) => {
        setPlace(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Could not load place");
        setLoading(false);
      });
  }, [id]);

  /* ===========================
       FETCH WEATHER (via API)
     =========================== */
  useEffect(() => {
    if (!place || !place.lat || !place.lng) return;

    setWeather(null);
    setWeatherError("");

    getWeather(place.lat, place.lng, 3)
      .then((days) => {
        setWeather(days);
      })
      .catch(() => {
        setWeatherError("Weather unavailable");
      });
  }, [place]);

  /* ===========================
       LOADING / ERROR STATES
     =========================== */
  if (loading) {
    return (
      <div className="details-notfound">
        <h1>Loading...</h1>
      </div>
    );
  }

  if (error || !place) {
    return (
      <div className="details-notfound">
        <h1>Location Not Found</h1>
        <Link to="/" className="back-home">
          Back to Home
        </Link>
      </div>
    );
  }

  /* ===========================
            RENDER PAGE
     =========================== */
  return (
    <div className="details-wrapper">
      <div className="details-card">
        {/* IMAGE */}
        <img
          src={place.imageUrl}
          alt={place.title}
          className="details-image"
        />

        {/* TITLE */}
        <h1 className="details-title">{place.title}</h1>

        {/* WEATHER STRIP */}
        <div className="weather-strip">
          {weather ? (
            <>
              {weather[0] && (
                <div className="weather-box">
                  <div className="weather-day">Today</div>
                  <div className="weather-icon">
                    {getWeatherIcon(weather[0].code)}
                  </div>
                  <div className="weather-temp">
                    {Math.round(weather[0].temp)}°
                  </div>
                </div>
              )}
              {weather[1] && (
                <div className="weather-box">
                  <div className="weather-day">Tomorrow</div>
                  <div className="weather-icon">
                    {getWeatherIcon(weather[1].code)}
                  </div>
                  <div className="weather-temp">
                    {Math.round(weather[1].temp)}°
                  </div>
                </div>
              )}
              {weather[2] && (
                <div className="weather-box">
                  <div className="weather-day">+2 Days</div>
                  <div className="weather-icon">
                    {getWeatherIcon(weather[2].code)}
                  </div>
                  <div className="weather-temp">
                    {Math.round(weather[2].temp)}°
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="weather-box">
              {weatherError ? (
                weatherError
              ) : (
                <div className="weather-loading">
                  <div className="weather-spinner" />
                  <span>Loading weather...</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* DESCRIPTION */}
        <div className="details-extra">
          <p>{place.longDescription}</p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="details-actions">
          <button onClick={handleBack} className="details-btn back">
            {from === "home" ? "Back to Home" : "Back to Catalog"}
          </button>

          {from !== "home" && (
            <>
              <button className="details-btn like">Like ⭐</button>
              <button className="details-btn comment">Add Comment 💬</button>

              <Link to={`/places/${id}/edit`} className="details-btn edit">
                Edit
              </Link>

              <button className="details-btn delete" onClick={handleDelete}>
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
