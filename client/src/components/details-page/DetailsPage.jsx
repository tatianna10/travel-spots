import { useParams, Link, useNavigate, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { getPlaceById, deletePlace } from "../../api/placesApi";
import { getWeather } from "../../api/weatherApi";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png?url";
import markerIcon from "leaflet/dist/images/marker-icon.png?url";
import markerShadow from "leaflet/dist/images/marker-shadow.png?url";

function getMarkerIcon(weatherType, emoji) {
  const colors = {
    sunny: "#facc15",
    cloudy: "#94a3b8",
    rain: "#38bdf8",
    drizzle: "#38bdf8",
    snow: "#e0f2fe",
    storm: "#a78bfa",
    fog: "#cbd5e1",
    default: "#ffffff"
  };

  const glow = colors[weatherType] || colors.default;

  return L.divIcon({
    className: "weather-map-marker",
    html: `
      <div class="weather-marker-inner" 
           style="--marker-glow: ${glow}">
        <span class="weather-marker-emoji">${emoji || ""}</span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
}



const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -32],
});

L.Marker.prototype.options.icon = DefaultIcon;

function DraggableMarker({ lat, lng, weatherType, icon }) {
  const [position, setPosition] = useState([lat, lng]);

  return (
    <Marker
      draggable={true}
      position={position}
      icon={getMarkerIcon(weatherType, icon)}
      eventHandlers={{
        dragend: (e) => {
          const newLatLng = e.target.getLatLng();
          setPosition([newLatLng.lat, newLatLng.lng]);
        },
      }}
    />
  );
}


export default function DetailsPage() {
  const { id } = useParams();

  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;

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

  function getWeatherType(code) {
    if ([0].includes(code)) return "sunny";
    if ([1, 2, 3].includes(code)) return "cloudy";
    if ([45, 48].includes(code)) return "fog";
    if ([51, 53, 55].includes(code)) return "drizzle";
    if ([61, 63, 65, 80, 81, 82].includes(code)) return "rain";
    if ([71, 73, 75].includes(code)) return "snow";
    if ([95, 96, 99].includes(code)) return "storm";
    return "default";
  }

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

  const handleBack = () => {
    if (from === "home") navigate("/");
    else navigate("/places");
  };

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

  useEffect(() => {
    if (!place || !place.lat || !place.lng) return;

    setWeather(null);
    setWeatherError("");

    getWeather(place.lat, place.lng, 3)
      .then((days) => setWeather(days))
      .catch(() => setWeatherError("Weather unavailable"));
  }, [place]);

  useEffect(() => {
    if (!weather) return;

    const boxNodes = Array.from(document.querySelectorAll(".weather-box-anim"));
    const iconNodes = Array.from(
      document.querySelectorAll(".weather-icon-anim")
    );

    let frameId;
    const start = performance.now();

    const animate = (now) => {
      const t = (now - start) / 1000;

      boxNodes.forEach((box, index) => {
        const floatOffset = Math.sin(t * 0.9 + index) * 4;
        box.style.transform = "translateY(" + floatOffset + "px)";
      });

      iconNodes.forEach((icon) => {
        const type = icon.getAttribute("data-weather-type");
        const baseFloat = Math.sin(t * 1.1) * 2;
        let transform = "";

        if (type === "sunny") {
          const rotateDeg = (t * 12) % 360;
          const scale = 1 + 0.04 * Math.sin(t * 2.2);
          transform =
            "translateY(" +
            baseFloat +
            "px) rotate(" +
            rotateDeg +
            "deg) scale(" +
            scale +
            ")";
        } else if (type === "cloudy") {
          const driftX = Math.sin(t * 0.7) * 4;
          transform = "translate(" + driftX + "px, " + baseFloat + "px)";
        } else if (type === "rain" || type === "drizzle") {
          const bounce = Math.abs(Math.sin(t * 2.2)) * 6;
          transform = "translateY(" + (baseFloat + bounce) + "px)";
        } else if (type === "storm") {
          const jitterX = Math.sin(t * 6.0) * 1.5;
          const jitterY = Math.cos(t * 5.3) * 1.5;
          transform =
            "translate(" + jitterX + "px, " + (baseFloat + jitterY) + "px)";
        } else if (type === "snow") {
          const driftX = Math.sin(t * 0.6) * 2.5;
          transform = "translate(" + driftX + "px, " + baseFloat + "px)";
        } else {
          transform = "translateY(" + baseFloat + "px)";
        }

        icon.style.transform = transform;
      });

      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    return () => frameId && cancelAnimationFrame(frameId);
  }, [weather]);

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

  return (
    <div className="details-wrapper">
      <div className="details-card">
        <img src={place.imageUrl} alt={place.title} className="details-image" />

        <h1 className="details-title">{place.title}</h1>

        <div className="weather-strip">
          {weather ? (
            <>
              {weather[0] && (
                <WeatherBox
                  label="Today"
                  dayData={weather[0]}
                  getWeatherIcon={getWeatherIcon}
                  getWeatherType={getWeatherType}
                />
              )}
              {weather[1] && (
                <WeatherBox
                  label="Tomorrow"
                  dayData={weather[1]}
                  getWeatherIcon={getWeatherIcon}
                  getWeatherType={getWeatherType}
                />
              )}
              {weather[2] && (
                <WeatherBox
                  label="+2 Days"
                  dayData={weather[2]}
                  getWeatherIcon={getWeatherIcon}
                  getWeatherType={getWeatherType}
                />
              )}
            </>
          ) : (
            <div className="weather-box weather-box-fallback">
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

        <div className="details-extra">
          <p>{place.longDescription}</p>
        </div>

        <div className="details-map-wrapper" style={{ height: "250px", marginTop: "1.5rem" }}>
          {place.lat && place.lng ? (
            <MapContainer
              center={[place.lat, place.lng]}
              zoom={11}
              scrollWheelZoom={false}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "1rem",
                overflow: "hidden",
              }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <DraggableMarker
                lat={place.lat}
                lng={place.lng}
                weatherType={weather ? getWeatherType(weather[0].code) : "default"}
                icon={weather ? getWeatherIcon(weather[0].code) : ""}
              />
            </MapContainer>
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "1rem",
                background: "rgba(30, 41, 59, 0.6)",
                backdropFilter: "blur(8px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#cbd5e1",
                fontSize: "1rem",
                border: "1px solid rgba(148,163,184,0.4)",
              }}
            >
              No map available for this location.
            </div>
          )}
        </div>

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

function WeatherBox({ label, dayData, getWeatherIcon, getWeatherType }) {
  const type = getWeatherType(dayData.code);
  const icon = getWeatherIcon(dayData.code);

  return (
    <div className={"weather-box weather-box-anim " + type}>
      <div className="weather-day">{label}</div>
      <div
        className="weather-icon weather-icon-anim"
        data-weather-type={type}
        aria-label={type}
      >
        {icon}
      </div>
      <div className="weather-temp">{Math.round(dayData.temp)}°</div>
    </div>
  );
}
