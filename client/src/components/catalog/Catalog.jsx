import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getAllPlaces } from "../../api/placesApi.js";
import PlaceCard from "../place-card/PlaceCard.jsx";

export default function CatalogPage() {
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    getAllPlaces()
      .then(data => {
        setPlaces(data);
        setFilteredPlaces(data); 
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message || "Failed to load catalog");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let result = [...places];

    // FILTER BY SEARCH (title)
    if (search.trim() !== "") {
      result = result.filter(place =>
        place.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // FILTER BY CATEGORY 
    if (category && category !== "") {
      result = result.filter(place =>
        place.tags && place.tags.includes(category)
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
              <option value="mountains">Mountains</option>
              <option value="culture">Culture</option>
              <option value="modern">Modern</option>
              <option value="nightlife">Nightlife</option>
              <option value="romantic">Romantic</option>
              <option value="tropical">Tropical</option>
            </select>
          </div>

      
          {loading && <p className="catalog-loading">Loading...</p>}
          {error && !loading && <p className="catalog-error">{error}</p>}
          {!loading && !error && filteredPlaces.length === 0 && (
            <p className="catalog-empty">No places match your filters.</p>
          )}

      
          <div className="catalog-grid">
            {filteredPlaces.map(place => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
