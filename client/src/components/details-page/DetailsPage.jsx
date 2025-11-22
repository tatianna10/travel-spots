import { useParams, Link, useNavigate, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { getPlaceById, deletePlace } from "../../api/placesApi";

export default function DetailsPage() {
  const { id } = useParams();

  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;

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

  const handleBack = () => {
    if (from === "home") navigate("/");
    else navigate("/places");
  };

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

  return (
    <div className="details-wrapper">
      <div className="details-card">

        {/* IMAGE */}
        <img src={place.imageUrl} alt={place.title} className="details-image" />

        {/* TITLE */}
        <h1 className="details-title">{place.title}</h1>

        {/* LONG DESCRIPTION */}
        <div className="details-extra">
          <p>{place.longDescription}</p>
        </div>

        {/* CATEGORY BOX */}
        <div className="details-category-box">
          <span className="details-category-label">Category:</span>
          <span className="details-category-value">{place.category}</span>
        </div>

        {/* BUTTONS */}
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
