import { useParams, Link, useNavigate, useLocation } from "react-router";
import { useContext, useEffect, useState, useMemo } from "react";

import { getPlaceById, deletePlace } from "../../api/placesApi";
import { getCommentsByPlace, createComment } from "../../api/commentsApi";
import { getLikes, checkUserLike, likePlace, unlikePlace } from "../../api/likesApi";
import { getUserById } from "../../api/userApi";
import { AuthContext } from "../../contexts/AuthContext";

function getDisplayName(user) {
  if (!user) return "Unknown user";
  if (user.fullName?.trim()) return user.fullName;
  if (user.email?.includes("@")) return user.email.split("@")[0];
  return "Unknown user";
}

function formatRelativeTime(timestamp) {
  if (!timestamp) return "";
  const diff = Date.now() - timestamp;
  const min = Math.floor(diff / 60000);
  const hr = Math.floor(min / 60);
  const day = Math.floor(hr / 24);
  if (min < 1) return "just now";
  if (min < 60) return `${min} minute${min !== 1 ? "s" : ""} ago`;
  if (hr < 24) return `${hr} hour${hr !== 1 ? "s" : ""} ago`;
  return `${day} day${day !== 1 ? "s" : ""} ago`;
}

export default function DetailsPage() {
  const { id } = useParams();
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from ?? "catalog";

  
  const [place, setPlace] = useState(null);
  const [comments, setComments] = useState([]);
  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeId, setLikeId] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);

  const isOwner = useMemo(() => place && user?.id === place.ownerId, [place, user]);

  const loadComments = async () => {
    const data = await getCommentsByPlace(id);
    const mapped = await Promise.all(
      data.map(async (c) => {
        try {
          const u = await getUserById(c.authorId);
          return { ...c, authorName: getDisplayName(u) };
        } catch {
          return { ...c, authorName: "Unknown user" };
        }
      })
    );
    setComments(mapped);
  };

  const loadLikes = async () => {
    const count = await getLikes(id);
    setLikesCount(count);

    if (user) {
      const status = await checkUserLike(id, user.id);
      setLiked(status.liked);
      setLikeId(status.likeId);
    } else {
      setLiked(false);
      setLikeId(null);
    }
  };

  useEffect(() => {
    async function load() {
      try {
        const p = await getPlaceById(id);
        setPlace(p);
        await Promise.all([loadComments(), loadLikes()]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleLikeClick = async () => {
    if (!isAuthenticated) return alert("Please login first!");
    if (isOwner) return;

    try {
      liked && likeId ? await unlikePlace(likeId) : await likePlace(id, user.id);
      await loadLikes();
    } catch (err) {
      alert(err.message || "Error updating like");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    await createComment(id, commentText, user);
    setCommentText("");
    await loadComments();
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete: ${place.title}?`)) return;
    await deletePlace(id, user.accessToken);
    navigate("/");
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

          <button
            className={`details-like-btn ${liked ? "liked" : ""}`}
            onClick={handleLikeClick}
            disabled={!isAuthenticated || isOwner}
          >
            {isOwner
              ? `❤️ ${likesCount} Like${likesCount !== 1 ? "s" : ""}`
              : liked
                ? `💔 Dislike ${likesCount}`
                : `👍 Like ${likesCount}`}
          </button>

          {isAuthenticated && isOwner && (
            <>
              <Link className="details-btn edit" to={`/places/${id}/edit`} state={{ from }}>
                Edit
              </Link>
              <button className="details-btn delete" onClick={handleDelete}>
                Delete
              </button>
            </>
          )}
        </div>

        <section className="details-comments-box">
          <h3 className="details-comments-title">Comments</h3>

          {!comments.length && <p className="details-no-comments">No comments yet.</p>}

          <ul className="details-comments-list">
            {comments.map((c) => (
              <li key={c.id} className="details-comment-item">
                <strong>{c.authorName}:</strong> {c.text}
                <span className="details-comment-date">• {formatRelativeTime(c.createdAt)}</span>
              </li>
            ))}
          </ul>

          {!isAuthenticated && (
            <p className="details-login-msg">
              <Link to="/login" className="details-login-link">
                Login
              </Link>{" "}
              to post comments or like this place.
            </p>

          )}

          {isAuthenticated && !isOwner && (
            <form className="details-comment-form" onSubmit={handleCommentSubmit}>
              <input
                className="details-comment-input"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
              />
              <button className="details-comment-btn">Post</button>
            </form>
          )}

          {isAuthenticated && isOwner && (
            <p className="details-owner-msg">You can’t comment on your own place.</p>
          )}
        </section>
      </div>
    </div>
  );
}
