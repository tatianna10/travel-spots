import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { createPlace } from "../../api/placesApi";


export default function CreateSpotPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    imageUrl: "",
    description: "",
    longDescription: "",
    category: "",
    tags: ""
  });

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const newSpot = {
      title: formData.title,
      imageUrl: formData.imageUrl,
      description: formData.description,
      longDescription: formData.longDescription,
      category: formData.category,
      tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
      likes: [],
      comments: []
    };

    try {
      await createPlace(newSpot);
      navigate("/catalog");
    } catch (err) {
      alert("Failed to create spot: " + err.message);
    }
  }

  return (
    <>
      {/* HEADER */}
      <header className="create-header">
        <h1 className="create-header-title">Create Spot</h1>

        <nav className="create-nav">
          <Link to="/" className="create-nav-link">Home</Link>
          <Link to="/catalog" className="create-nav-link">Catalog</Link>
          <Link to="/login" className="create-nav-link">Login</Link>
          <Link to="/register" className="create-nav-link">Register</Link>
        </nav>
      </header>

      {/* PAGE CONTENT */}
      <div className="create-wrapper">
        <form className="create-form" onSubmit={handleSubmit}>
          <h2 className="create-title">Add New Travel Spot</h2>

          {/* TITLE */}
          <label className="create-label">
            Title:
            <input
              type="text"
              name="title"
              className="create-input"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </label>

          {/* IMAGE */}
          <label className="create-label">
            Image URL:
            <input
              type="text"
              name="imageUrl"
              className="create-input"
              value={formData.imageUrl}
              onChange={handleChange}
              required
            />
          </label>

          {/* SHORT DESCRIPTION */}
          <label className="create-label">
            Short Description:
            <input
              type="text"
              name="description"
              className="create-input"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </label>

          {/* LONG DESCRIPTION */}
          <label className="create-label">
            Long Description:
            <textarea
              name="longDescription"
              className="create-textarea"
              value={formData.longDescription}
              onChange={handleChange}
              rows="4"
              required
            ></textarea>
          </label>

          {/* CATEGORY */}
          <label className="create-label">
            Category:
            <select
              name="category"
              className="create-select"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select category...</option>
              <option value="city">City</option>
              <option value="beach">Beach</option>
              <option value="historic">Historic</option>
              <option value="culture">Culture</option>
              <option value="modern">Modern</option>
              <option value="nightlife">Nightlife</option>
              <option value="romantic">Romantic</option>
              <option value="tropical">Tropical</option>
            </select>
          </label>

          {/* TAGS */}
          <label className="create-label">
            Tags (comma separated):
            <input
              type="text"
              name="tags"
              className="create-input"
              value={formData.tags}
              onChange={handleChange}
              placeholder="city, modern, nightlife..."
            />
          </label>

          <button type="submit" className="create-btn">
            Add Spot
          </button>
        </form>
      </div>
    </>
  );
}
