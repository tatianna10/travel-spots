import { useState } from "react";
import { useNavigate, Link } from "react-router";


export default function CreateSpotPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        img: "",
        desc: "",
        longDesc: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("New Spot Data:", formData);
        // later: send POST to backend here

        navigate("/catalog");
    };

    return (
        <div className="create-spot-wrapper">
            {/* Navigation */}
            <header className="create-spot-header">
                <h1 className="create-spot-logo">Create Spot</h1>

                <nav className="create-spot-nav">
                    <Link to="/" className="create-spot-nav-link">Home</Link>
                    <Link to="/places" className="create-spot-nav-link">Catalog</Link>
                    <Link to="/places/create" className="create-spot-nav-link">Create Spote</Link>
                    <Link to="/logout" className="create-spot-nav-link">Logout</Link>
                    <Link to="/login" className="create-spot-nav-link">Login</Link>
                    <Link to="/register" className="create-spot-nav-link">Register</Link>
                </nav>
            </header>

            {/* Main content */}
            <main className="create-spot-main">
                <div className="create-spot-form-wrapper">
                    <form className="create-spot-card" onSubmit={handleSubmit}>
                        <h2 className="create-spot-title">Add New Travel Spot</h2>

                        <label className="create-spot-label">
                            <span>Title</span>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="create-spot-input"
                                placeholder="Enter a name..."
                            />
                        </label>

                        <label className="create-spot-label">
                            <span>Image URL</span>
                            <input
                                type="text"
                                name="img"
                                value={formData.img}
                                onChange={handleChange}
                                required
                                className="create-spot-input"
                                placeholder="Paste an image URL..."
                            />
                        </label>

                        <label className="create-spot-label">
                            <span>Short Description</span>
                            <input
                                type="text"
                                name="desc"
                                value={formData.desc}
                                onChange={handleChange}
                                required
                                className="create-spot-input"
                                placeholder="Short description..."
                            />
                        </label>

                        <label className="create-spot-label">
                            <span>Long Description</span>
                            <textarea
                                name="longDesc"
                                value={formData.longDesc}
                                onChange={handleChange}
                                required
                                rows="4"
                                className="create-spot-textarea"
                                placeholder="Full details about the place..."
                            ></textarea>
                        </label>

                        <button
                            type="submit"
                            className="create-spot-btn"
                        >
                            Add Spot
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}
