import { useEffect, useState } from "react";
import { getAllPlaces } from "../../api/placesApi";
import PlaceCard from "../place-card/PlaceCard";
import ScrollToTop from "../scrolltotop/ScrollToTop.jsx";
import Header from "../header/Header";

export default function CatalogPage() {
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    getAllPlaces()
      .then((data) => {
        if (!Array.isArray(data)) {
          setError("Server returned invalid data format");
          setLoading(false);
          return;
        }

        setPlaces(data);
        setFilteredPlaces(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load catalog");
        setLoading(false);
      });
  }, []);

  // FILTER LOGIC
  useEffect(() => {
    if (!Array.isArray(places)) return;

    let result = [...places];

    if (search.trim() !== "") {
      const s = search.trim().toLowerCase();
      result = result.filter((p) => p.title?.toLowerCase().includes(s));
    }

    if (category !== "") {
      result = result.filter((p) => p.category === category);
    }

    setFilteredPlaces(result);
  }, [search, category, places]);

  return (
    <div className="catalog-wrapper">
      <div className="catalog-inner">


        <Header />

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
              <option value="beach">Beach</option>
              <option value="historic">Historic</option>
              <option value="culture">Culture</option>
              <option value="modern">Modern</option>
              <option value="nightlife">Nightlife</option>
              <option value="romantic">Romantic</option>
              <option value="tropical">Tropical</option>
              <option value="nature">Nature</option>
              <option value="desert">Desert</option>
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

        <ScrollToTop />
      </div>
    </div>
  );
}
