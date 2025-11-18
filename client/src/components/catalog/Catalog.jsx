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
    <div className="catalog-wrapper">
      <div className="catalog-inner">

        <header className="catalog-header">
          <h1 className="catalog-title">Catalog</h1>

          <nav className="catalog-nav">
            <Link to="/" className="catalog-nav-link">Home</Link>
            <Link to="/catalog" className="catalog-nav-link">Catalog</Link>
            <Link to="/login" className="catalog-nav-link">Login</Link>
            <Link to="/register" className="catalog-nav-link">Register</Link>
          </nav>
        </header>

        <main className="catalog-main">
          <h2 className="catalog-main-title">All Travel Spots</h2>

          {loading && (
            <p className="catalog-loading">Loading...</p>
          )}

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
