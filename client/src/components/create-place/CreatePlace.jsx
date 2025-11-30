import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router";
import { createPlace } from "../../api/placesApi";
import { AuthContext } from "../../contexts/AuthContext";
import Header from "../header/Header.jsx";

export default function CreatePlace() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        city: "",
        country: "",
        imageUrl: "",
        description: "",
        longDescription: "",
        category: ""
    });

    const [submitting, setSubmitting] = useState(false);

    if (!user) {
        return (
            <div className="create-wrapper">
                <Header />
                <div className="create-inner">
                    <h2 className="create-title">You must be logged in to create a spot.</h2>
                    <Link to="/login" className="create-btn">Go to Login</Link>
                </div>
            </div>
        );
    }

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (submitting) return;

        const newSpot = {
            title: `${formData.city}, ${formData.country}`,
            ...formData,
            ownerId: user.id,
            likes: [],
            comments: [],
            createdAt: Date.now()
        };

        setSubmitting(true);

        try {
            await createPlace(newSpot, user.accessToken);
            navigate("/places/my-places");
        } catch (err) {
            alert("Failed to create spot: " + err.message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="create-wrapper">
            <Header />

            <div className="create-inner">
                <form className="create-form" onSubmit={handleSubmit}>
                    <h2 className="create-title">Add New Travel Spot</h2>

                    <label className="create-label">City:
                        <input className="create-input" name="city" onChange={handleChange} required />
                    </label>

                    <label className="create-label">Country:
                        <input className="create-input" name="country" onChange={handleChange} required />
                    </label>

                    <label className="create-label">Image URL:
                        <input className="create-input" name="imageUrl" onChange={handleChange} required />
                    </label>

                    <label className="create-label">Short Description:
                        <input className="create-input" name="description" onChange={handleChange} required />
                    </label>

                    <label className="create-label">Long Description:
                        <textarea className="create-textarea" name="longDescription" rows="4" onChange={handleChange} required />
                    </label>

                    <label className="create-label">
                        Category:
                        <select className="create-select" name="category" onChange={handleChange} required>
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
                        {submitting ? "Adding..." : "Add Spot"}
                    </button>
                </form>
            </div>
        </div>
    );
}
