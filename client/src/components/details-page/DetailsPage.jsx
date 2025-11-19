import { useParams, Link } from "react-router";
import { useEffect, useState } from "react";
import { getPlaceById, updatePlace } from "../../api/placesApi";
import Comments from "../comments/Comments";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function DetailsPage() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // simple fake user id for likes
  const userId = "demo-user-id";

  useEffect(() => {
    getPlaceById(id)
      .then((data) => {
        // ensure likes array exists
        if (!Array.isArray(data.likes)) {
          data.likes = [];
        }
        setPlace(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Could not load place");
        setLoading(false);
      });
  }, [id]);

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

  const hasLiked = place.likes.includes(userId);

  const handleLike = async () => {
    try {
      const updatedLikes = hasLiked
        ? place.likes.filter((id) => id !== userId)
        : [...place.likes, userId];

      setPlace((prev) => ({ ...prev, likes: updatedLikes }));

      // try to persist to backend
      await updatePlace(place.id, { likes: updatedLikes });
    } catch (err) {
      console.error(err);
    }
  };

  const coords = place.coordinates;

  return (
    <div className="details-wrapper">
      <div className="details-card">
        <img
          src={place.imageUrl}
          alt={place.title}
          className="details-image"
        />

        <h1 className="details-title">{place.title}</h1>

        <p className="details-desc">
          {place.longDescription || place.description}
        </p>

        <div className="details-extra">
          <p>
            <strong>Country:</strong> {place.country}
          </p>
          <p>
            <strong>City:</strong> {place.city}
          </p>
          <p>
            <strong>Price:</strong>{" "}
            {place.price ? `$${place.price.toLocaleString()}` : "N/A"}
          </p>
          <p>
            <strong>Weather:</strong> {place.weather}
          </p>
          <p>
            <strong>Seasons:</strong>{" "}
            {place.seasons && place.seasons.length > 0
              ? place.seasons.join(", ")
              : "N/A"}
          </p>
          <p>
            <strong>Rating:</strong> ⭐ {place.rating}
          </p>
          {place.category && (
            <p>
              <strong>Category:</strong> {place.category}
            </p>
          )}
          <p>
            <strong>Likes:</strong> {place.likes.length}
          </p>

          {place.tags && place.tags.length > 0 && (
            <p>
              <strong>Tags:</strong> {place.tags.join(", ")}
            </p>
          )}
        </div>

        {/* MAP */}
        {coords && coords.lat && coords.lng && (
          <div className="details-map-section">
            <h3>Location on map</h3>
            <MapContainer
              center={[coords.lat, coords.lng]}
              zoom={11}
              scrollWheelZoom={false}
              className="details-map"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[coords.lat, coords.lng]}>
                <Popup>{place.title}</Popup>
              </Marker>
            </MapContainer>
          </div>
        )}

        {/* BUTTONS */}
        <div className="details-actions">
          <Link to="/places" className="details-btn blue">
            Back to Catalog
          </Link>
          <button
            className="details-btn green"
            onClick={handleLike}
          >
            {hasLiked ? "Unlike" : "Like"} ⭐ ({place.likes.length})
          </button>
        </div>

        {/* COMMENTS */}
        <Comments placeId={place.id} />
      </div>
    </div>
  );
}
