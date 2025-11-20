import { useParams, Link, useNavigate, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { getPlaceById, deletePlace } from "../../api/placesApi";

export default function DetailsPage() {
    const { id } = useParams();

    const [place, setPlace] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [weather, setWeather] = useState(null);   // ← NEW
    const [weatherError, setWeatherError] = useState(""); // ← NEW

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from;

    /* ===========================
          WEATHER ICON LOGIC
       =========================== */
    const getWeatherIcon = (code) => {
        if ([0].includes(code)) return "☀️";
        if ([1, 2].includes(code)) return "⛅";
        if ([3].includes(code)) return "☁️";
        if ([51, 53, 55].includes(code)) return "🌦️";
        if ([61, 63, 65].includes(code)) return "🌧️";
        if ([71, 73, 75].includes(code)) return "❄️";
        if ([80, 81, 82].includes(code)) return "🌧️";
        return "🌡️";
    };

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
        FETCH WEATHER (Open-Meteo)
       =========================== */
    useEffect(() => {
        if (!place || !place.lat || !place.lng) return;

        const url =
            `https://api.open-meteo.com/v1/forecast` +
            `?latitude=${place.lat}` +
            `&longitude=${place.lng}` +
            `&daily=weathercode,temperature_2m_max` +
            `&forecast_days=3` +
            `&timezone=auto`;

        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                if (!data.daily) throw new Error("No weather data");
                setWeather({
                    today: {
                        temp: data.daily.temperature_2m_max[0],
                        icon: getWeatherIcon(data.daily.weathercode[0])
                    },
                    tomorrow: {
                        temp: data.daily.temperature_2m_max[1],
                        icon: getWeatherIcon(data.daily.weathercode[1])
                    },
                    dayAfter: {
                        temp: data.daily.temperature_2m_max[2],
                        icon: getWeatherIcon(data.daily.weathercode[2])
                    },
                });
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
                <Link to="/" className="back-home">Back to Home</Link>
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
                <img src={place.imageUrl} alt={place.title} className="details-image" />

                {/* TITLE */}
                <h1 className="details-title">{place.title}</h1>

                {/* WEATHER STRIP */}
                <div className="weather-strip">
                    {weather ? (
                        <>
                            <div className="weather-box">
                                Today: {weather.today.icon} {weather.today.temp}°
                            </div>
                            <div className="weather-box">
                                Tomorrow: {weather.tomorrow.icon} {weather.tomorrow.temp}°
                            </div>
                            <div className="weather-box">
                                +2 Days: {weather.dayAfter.icon} {weather.dayAfter.temp}°
                            </div>
                        </>
                    ) : (
                        <div className="weather-box">
                            {weatherError || "Loading weather..."}
                        </div>
                    )}
                </div>

                {/* DESCRIPTION */}
                <p className="details-desc">{place.longDescription}</p>

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
