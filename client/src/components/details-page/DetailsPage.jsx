import { useParams, Link } from "react-router";
import { useEffect, useState } from "react";
import { getPlaceById } from "../../api/placesApi";

export default function DetailsPage() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getPlaceById(id)
      .then(data => {
        setPlace(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || "Could not load place");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="details-notfound"><h1>Loading...</h1></div>;
  }

  if (error || !place) {
    return (
      <div className="details-notfound">
        <h1>Location Not Found</h1>
        <Link to="/" className="back-home">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="details-wrapper">
      <div className="details-card">
        <img src={place.imageUrl} alt={place.title} className="details-image" />

        <h1 className="details-title">{place.title}</h1>

        <p className="details-desc">{place.description}</p>

        <div className="details-actions">
          <Link to="/places" className="details-btn blue">Back to Catalog</Link>
          <button className="details-btn green">Like ⭐</button>
          <button className="details-btn yellow">Add Comment 💬</button>
        </div>
      </div>
    </div>
  );
}
