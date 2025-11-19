import { Link } from "react-router";

export default function PlaceCard({ place }) {
    return (
        <div className="place-card">
            <img
                src={place.imageUrl}
                alt={place.title}
                className="place-card-image"
            />

            <div className="place-card-content">
                <h3 className="place-card-title">{place.title}</h3>

                <p className="place-card-desc">{place.description}</p>

                <Link to={`/places/${place.id}/details`} className="place-card-button">View Details</Link>
            </div>
        </div>
    );
}
