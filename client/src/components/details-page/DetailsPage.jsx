import { useParams, Link, useNavigate, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { getPlaceById } from "../../api/placesApi";

export default function DetailsPage() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();          
  const location = useLocation();          
  const from = location.state?.from;       

  const handleBack = () => {
    if (from === "home") navigate("/");
    else navigate("/places"); 
  };

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

        <div className="details-extra">
          <p><strong></strong> {place.longDescription}</p>
        </div>

        <div className="details-actions">
          <button onClick={handleBack} className="details-btn blue">
            {from === "home" ? "Back to Home" : "Back to Catalog"}
          </button>

          <button className="details-btn green">Like ⭐</button>
          <button className="details-btn yellow">Add Comment 💬</button>
        </div>

      </div>
    </div>
  );
}
