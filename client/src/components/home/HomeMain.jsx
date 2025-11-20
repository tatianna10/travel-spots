import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getAllPlaces } from "../../api/placesApi";

export default function HomeMain() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllPlaces()
      .then(data => {
        setPlaces(data.slice(0, ));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="home-title">Loading...</p>;
  }

  return (
    <main className="home-main">
      <section className="home-section">
        <h2 className="home-title">Explore Places</h2>

        <div className="home-grid">
          {places.map(place => (
            <div key={place.id} className="home-card">
              <img
                src={place.imageUrl}
                alt={place.title}
                className="home-image"
              />

              <h3 className="home-card-title">{place.title}</h3>

              <p className="home-card-desc">{place.description}</p>

              <Link to={`/places/${place.id}/details`} state={{ from: "home" }} className="home-button">
                View Details
              </Link>

            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
