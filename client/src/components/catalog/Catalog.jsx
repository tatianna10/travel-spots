import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getAllPlaces } from "../../api/placesApi.js";
import PlaceCard from "../place-card/PlaceCard.jsx";

export default function CatalogPage() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAllPlaces()
      .then(data => {
        setPlaces(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message || "Failed to load catalog");
        setLoading(false);
      });
  }, []);

  return (
    <div className="catalog-page">
      <div className="catalog-wrapper">

        {/* Header */}
        <header className="catalog-header">
          <h1 className="catalog-title">Catalog</h1>

          <nav className="catalog-nav">
            <Link to="/">Home</Link>
            <Link to="/catalog">Catalog</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </nav>
        </header>

        {/* Main */}
        <main className="catalog-main">
          <h2 className="catalog-heading">All Travel Spots</h2>

          {loading && <p className="catalog-loading">Loading...</p>}

          {error && !loading && (
            <p className="catalog-error">{error}</p>
          )}

          {!loading && !error && places.length === 0 && (
            <p className="catalog-empty">No travel spots yet. Be the first to create one!</p>
          )}

          <div className="catalog-grid">
            {places.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        </main>

      </div>
    </div>
  );
}
