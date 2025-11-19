import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getAllPlaces } from "../../api/placesApi.js";
import PlaceCard from "../place-card/PlaceCard.jsx";

export default function CatalogPage() {
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  // FETCH PLACES
  useEffect(() => {
    getAllPlaces()
      .then((data) => {
        if (!Array.isArray(data)) {
          console.error("Backend returned something else:", data);
          setError("Server returned invalid data format");
          setLoading(false);
          return;
        }

        setPlaces(data);
        setFilteredPlaces(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(err.message || "Failed to load catalog");
        setLoading(false);
      });
  }, []);

  // FILTER LOGIC
  useEffect(() => {
    if (!Array.isArray(places)) return;

    let result = [...places];

    // SEARCH FILTER
    const s = search.trim().toLowerCase();
    if (s !== "") {
      result = result.filter((place) =>
        place.title?.toLowerCase().includes(s)
      );
    }

    // CATEGORY FILTER (tags)
    if (category !== "") {
      result = result.filter((place) =>
        Array.isArray(place.tags) && place.tags.includes(category)
      );
    }

    setFilteredPlaces(result);
  }, [search, category, places]);

  return (
    <div className="catalog-wrapper">
      <div className="catalog-inner">

        <header className="catalog-header">
          <h1 className="catalog-title">Catalog</h1>

          <nav className="catalog-nav">
            <Link to="/" className="catalog-nav-link">Home</Link>
            <Link to="/places" className="catalog-nav-link">Catalog</Link>
            <Link to="/login" className="catalog-nav-link">Login</Link>
            <Link to="/register" className="catalog-nav-link">Register</Link>
          </nav>
        </header>

        <main className="catalog-main">

          <h2 className="catalog-main-title">All Travel Spots</h2>

          {/* FILTERS */}
          <div className="catalog-filters">
            <input
              type="text"
              placeholder="Search..."
              className="catalog-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="catalog-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All categories</option>
              <option value="city">City</option>
              <option value="beach">Beach</option>
              <option value="historic">Historic</option>
              <option value="culture">Culture</option>
              <option value="modern">Modern</option>
              <option value="nightlife">Nightlife</option>
              <option value="romantic">Romantic</option>
              <option value="tropical">Tropical</option>
            </select>
          </div>

          {/* STATUS */}
          {loading && <p className="catalog-loading">Loading...</p>}
          {error && !loading && <p className="catalog-error">{error}</p>}
          {!loading && !error && filteredPlaces.length === 0 && (
            <p className="catalog-empty">No places match your filters.</p>
          )}

          {/* GRID */}
          <div className="catalog-grid">
            {filteredPlaces.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
