import { useParams, Link, useNavigate, useLocation } from "react-router";
import { useContext, useEffect, useState } from "react";
import { getPlaceById, deletePlace } from "../../api/placesApi";
import { getCommentsByPlace, createComment } from "../../api/commentsApi";
import { getUserById } from "../../api/userApi";
import { AuthContext } from "../../contexts/AuthContext";

function formatRelativeTime(timestamp) {
  const diff = Date.now() - timestamp;
  const sec = Math.floor(diff / 1000);
  const min = Math.floor(sec / 60);
  const hrs = Math.floor(min / 60);
  const days = Math.floor(hrs / 24);

  if (sec < 60) return "just now";
  if (min < 60) return `${min} minute${min !== 1 ? "s" : ""} ago`;
  if (hrs < 24) return `${hrs} hour${hrs !== 1 ? "s" : ""} ago`;
  return `${days} day${days !== 1 ? "s" : ""} ago`;
}

export default function DetailsPage() {
  const { id } = useParams();
  const { user, isAuthenticated } = useContext(AuthContext);

  const [place, setPlace] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;

  const isOwner = user?.id === place?.ownerId;

  useEffect(() => {
    async function loadData() {
      try {
        const [placeData, commentsData] = await Promise.all([
          getPlaceById(id),
          getCommentsByPlace(id),
        ]);

        const processedComments = await Promise.all(
          commentsData.map(async (c) => {
            let authorName = "Unknown user";
            try {
              const author = await getUserById(c.authorId);
              authorName =
                author.fullName && author.fullName.trim() !== ""
                  ? author.fullName
                  : author.email.split("@")[0];
            } catch (err) {
              //
            }

            return { ...c, authorName };
          })
        );

        setPlace(placeData);
        setComments(processedComments);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !user) return;

    try {
      const newComment = await createComment(id, commentText, user);

      const authorName =
        user.fullName && user.fullName.trim() !== ""
          ? user.fullName
          : user.email.split("@")[0];

      setComments((prev) => [
        ...prev,
        { ...newComment, authorName }
      ]);

      setCommentText("");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete: ${place.title}?`)) return;
    await deletePlace(id, user.accessToken);
    navigate("/places");
  };

  if (loading) return <h1 className="details-notfound">Loading...</h1>;
  if (!place) return <h1 className="details-notfound">Not Found</h1>;

  return (
    <div className="details-wrapper">
      <div className="details-card">

        <img className="details-image" src={place.imageUrl} alt={place.title} />
        <h1 className="details-title">{place.title}</h1>
        <p className="details-extra">{place.longDescription}</p>

        <div className="details-category-box">
          <span className="details-category-label">Category:</span>
          <span className="details-category-value">{place.category}</span>
        </div>

        <div className="details-actions">
          <button
            className="details-btn back"
            onClick={() => navigate(from === "home" ? "/" : "/places")}
          >
            {from === "home" ? "Back to Home" : "Back to Catalog"}
          </button>

          {isAuthenticated && isOwner && (
            <>
              <Link to={`/places/${id}/edit`} className="details-btn edit">Edit</Link>
              <button className="details-btn delete" onClick={handleDelete}>Delete</button>
            </>
          )}
        </div>

        <section className="details-comments-box">
          <h3 className="details-comments-title">Comments</h3>

          {comments.length === 0 && (
            <p className="details-no-comments">No comments yet.</p>
          )}

          <ul className="details-comments-list">
            {comments.map((c) => (
              <li key={c.id} className="details-comment-item">
                <span className="details-comment-author">{c.authorName}:</span>{" "}
                {c.text}

                {c.createdAt && (
                  <span className="details-comment-date">
                    • {formatRelativeTime(c.createdAt)}
                  </span>
                )}
              </li>
            ))}
          </ul>

          {!isAuthenticated && (
            <p className="details-login-msg">
              <Link to="/login" className="details-login-link">Login</Link>{" "}
              to post comments or like this place.
            </p>
          )}

          {isAuthenticated && !isOwner && (
            <form className="details-comment-form" onSubmit={handleCommentSubmit}>
              <input
                className="details-comment-input"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button className="details-comment-btn">Post</button>
            </form>
          )}

          {isAuthenticated && isOwner && (
            <p className="details-owner-msg">
              You can’t comment on your own place.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
