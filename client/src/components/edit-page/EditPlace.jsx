import { useState, useContext, useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router";
import { getPlaceById, updatePlace } from "../../api/placesApi";
import { AuthContext } from "../../contexts/AuthContext";
import Header from "../header/Header.jsx";

export default function EditPlace() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useContext(AuthContext);

    const cameFrom = location.state?.from; 

    const [formData, setFormData] = useState({
        city: "",
        country: "",
        imageUrl: "",
        description: "",
        longDescription: "",
        category: ""
    });

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        getPlaceById(id)
            .then(place => {
                if (place.ownerId !== user.id) {
                    alert("You are not allowed to edit this spot.");
                    navigate("/places");
                    return;
                }

                setFormData({
                    city: place.city,
                    country: place.country,
                    imageUrl: place.imageUrl,
                    description: place.description,
                    longDescription: place.longDescription,
                    category: place.category
                });

                setLoading(false);
            })
            .catch(err => {
                alert("Could not load this spot: " + err.message);
                navigate("/places");
            });
    }, [id, user.id, navigate]);

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (submitting) return;

        const updatedSpot = {
            title: `${formData.city}, ${formData.country}`,
            ...formData,
            ownerId: user.id
        };

        setSubmitting(true);

        try {
            await updatePlace(id, updatedSpot, user.accessToken);

            const redirectPath =
                cameFrom === "myplaces"
                    ? "/places/my-places"
                    : `/places/${id}/details`;

            navigate(redirectPath);
        } catch (err) {
            alert("Failed to update spot: " + err.message);
        } finally {
            setSubmitting(false);
        }
    }

    if (!user) {
        return (
            <div className="create-wrapper">
                <Header />
                <div className="create-inner">
                    <h2 className="create-title">You must be logged in to edit a spot.</h2>
                    <Link to="/login" className="create-btn">Go to Login</Link>
                </div>
            </div>
        );
    }

    if (loading) {
        return <h2 style={{ textAlign: "center", color: "white" }}>Loading...</h2>;
    }

    return (
        <div className="create-wrapper">
            <Header />

            <div className="create-inner">
                <form className="create-form" onSubmit={handleSubmit}>
                    <h2 className="create-title">Edit Travel Spot</h2>

                    <label className="create-label">City:
                        <input
                            className="create-input"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label className="create-label">Country:
                        <input
                            className="create-input"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label className="create-label">Image URL:
                        <input
                            className="create-input"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label className="create-label">Short Description:
                        <input
                            className="create-input"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label className="create-label">Long Description:
                        <textarea
                            className="create-textarea"
                            name="longDescription"
                            rows="4"
                            value={formData.longDescription}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label className="create-label">
                        Category:
                        <select
                            className="create-select"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select category...</option>
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
                    </label>

                    <button className="create-btn" disabled={submitting}>
                        {submitting ? "Saving..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
}
