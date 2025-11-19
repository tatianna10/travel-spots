import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getAllPlaces } from "../../api/placesApi";
import PlaceCard from "../place-card/PlaceCard";

export default function Catalog() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    getAllPlaces()
      .then((data) => {
        setPlaces(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || "Failed to load catalog");
        setLoading(false);
      });
  }, []);

  const filtered = places.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.country.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = category ? p.category === category : true;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="catalog-wrapper">
      <div className="catalog-inner">
        <header className="catalog-header">
          <h1 className="catalog-title">Catalog</h1>

          <nav className="catalog-nav">
            <Link to="/" className="catalog-nav-link">
              Home
            </Link>
            <Link to="/places" className="catalog-nav-link">
              Catalog
            </Link>
            <Link to="/login" className="catalog-nav-link">
              Login
            </Link>
            <Link to="/register" className="catalog-nav-link">
              Register
            </Link>
          </nav>
        </header>

        <main className="catalog-main">
          <h2 className="catalog-main-title">All Travel Spots</h2>

          {/* Search + Category filter */}
          <div className="catalog-filters">
            <input
              type="text"
              placeholder="Search by title or country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="catalog-search"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="catalog-category"
            >
              <option value="">All categories</option>
              <option value="city">City</option>
              <option value="beach">Beach</option>
              <option value="nature">Nature</option>
              <option value="historic">Historic</option>
              <option value="romantic">Romantic</option>
              <option value="desert">Desert</option>
            </select>
          </div>

          {loading && <p className="catalog-loading">Loading...</p>}

          {error && !loading && (
            <p className="catalog-error">{error}</p>
          )}

          {!loading && !error && filtered.length === 0 && (
            <p className="catalog-empty">
              No travel spots match your search.
            </p>
          )}

          <div className="catalog-grid">
            {filtered.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
