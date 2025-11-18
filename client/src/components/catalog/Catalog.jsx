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
    <div
      className="min-h-screen bg-cover bg-center font-sans"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80')"
      }}
    >
      <div className="relative z-10">
    
        <header className="bg-white/20 backdrop-blur-md border-b border-white/30 py-4 px-6 flex justify-between items-center shadow-lg">
          <h1 className="text-2xl font-bold text-white drop-shadow-xl tracking-wide">
            Catalog
          </h1>
          <nav className="flex gap-6 text-white font-semibold drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            <Link to="/" className="hover:text-blue-300">Home</Link>
            <Link to="/catalog" className="hover:text-blue-300">Catalog</Link>
            <Link to="/login" className="hover:text-blue-300">Login</Link>
            <Link to="/register" className="hover:text-blue-300">Register</Link>
          </nav>
        </header>

        <main className="container mx-auto px-4 py-10">
          <h2 className="text-4xl font-bold text-white drop-shadow-2xl mb-8 text-center">
            All Travel Spots
          </h2>

          {loading && (
            <p className="text-center text-white text-lg drop-shadow-[0_0_6px_#000]">
              Loading...
            </p>
          )}

          {error && !loading && (
            <p className="text-center text-red-200 text-lg drop-shadow-[0_0_6px_#000]">
              {error}
            </p>
          )}

          {!loading && !error && places.length === 0 && (
            <p className="text-center text-white text-lg drop-shadow-[0_0_6px_#000]">
              No travel spots yet. Be the first to create one!
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {places.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
