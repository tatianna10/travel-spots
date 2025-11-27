import { useEffect, useState, useContext } from "react";
import { Link } from "react-router";
import Header from "../header/Header";
import { AuthContext } from "../../contexts/AuthContext";
import { getAllPlaces, deletePlace } from "../../api/placesApi";

export default function MyPlaces() {
    const { user } = useContext(AuthContext);
    const [places, setPlaces] = useState([]);

    useEffect(() => {
        async function load() {
            const all = await getAllPlaces();
            setPlaces(all.filter(p => p.ownerId === user.id));
        }
        load();
    }, [user.id]);

    async function handleDelete(id) {
        if (!confirm("Delete this place?")) return;
        await deletePlace(id, user.accessToken);
        setPlaces(prev => prev.filter(p => p.id !== id));
    }

    return (
        <div className="myplaces-wrapper">
            <Header />

            <div className="myplaces-container">
                <h2 className="myplaces-title">My Places</h2>

                {places.length === 0 && <p className="myplaces-empty">You have not created any places yet.</p>}

                <div className="myplaces-grid">
                    {places.map((place) => (
                        <div key={place.id} className="place-card">
                            <img src={place.imageUrl} alt={place.title} className="place-img" />
                            <div className="place-content">
                                <h3 className="place-title">{place.title}</h3>
                                <p className="place-desc">{place.description}</p>

                                <div className="place-actions">
                                    <Link
                                        to={`/places/${place.id}/edit`}
                                        state={{ from: "myplaces" }}
                                        className="btn-edit"
                                    >
                                        Edit
                                    </Link>

                                    <button className="btn-delete" onClick={() => handleDelete(place.id)}>Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
