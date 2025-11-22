import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { createPlace } from "../../api/placesApi";

export default function CreatePlace() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        city: "",
        country: "",
        imageUrl: "",
        description: "",
        longDescription: "",
        category: ""
    });

    const [submitting, setSubmitting] = useState(false);

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    function generateRandomRating() {
        return Number((Math.random() * 1.5 + 3.5).toFixed(1));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (submitting) return;

        setSubmitting(true);

        const city = formData.city.trim();
        const country = formData.country.trim();

        const newSpot = {
            title: `${city}, ${country}`,
            city,
            country,
            description: formData.description.trim(),
            longDescription: formData.longDescription.trim(),
            imageUrl: formData.imageUrl.trim(),
            rating: generateRandomRating(),
            category: formData.category,
            ownerId: "anonymous",
            likes: [],
            comments: [],
            createdAt: Date.now()
        };

        try {
            await createPlace(newSpot);
            navigate("/places");
        } catch (err) {
            alert("Failed to create spot: " + err.message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <>
            <header className="create-header">
                <h1 className="create-header-title">Create Spot</h1>
                <nav className="create-nav">
                    <Link to="/" className="create-nav-link">Home</Link>
                    <Link to="/places" className="create-nav-link">Catalog</Link>
                    <Link to="/login" className="create-nav-link">Login</Link>
                    <Link to="/register" className="create-nav-link">Register</Link>
                </nav>
            </header>

            <div className="create-wrapper">
                <form className="create-form" onSubmit={handleSubmit}>
                    <h2 className="create-title">Add New Travel Spot</h2>

                    <label className="create-label">
                        City:
                        <input type="text" name="city" value={formData.city} onChange={handleChange} className="create-input" required />
                    </label>

                    <label className="create-label">
                        Country:
                        <input type="text" name="country" value={formData.country} onChange={handleChange} className="create-input" required />
                    </label>

                    <label className="create-label">
                        Image URL:
                        <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="create-input" required />
                    </label>

                    <label className="create-label">
                        Short Description:
                        <input type="text" name="description" value={formData.description} onChange={handleChange} className="create-input" required />
                    </label>

                    <label className="create-label">
                        Long Description:
                        <textarea name="longDescription" value={formData.longDescription} onChange={handleChange} className="create-textarea" rows="4" required />
                    </label>

                    <label className="create-label">
                        Category:
                        <select name="category" value={formData.category} onChange={handleChange} className="create-select" required>
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

                    <button type="submit" className="create-btn" disabled={submitting}>
                        {submitting ? "Adding..." : "Add Spot"}
                    </button>
                </form>
            </div>
        </>
    );
}
