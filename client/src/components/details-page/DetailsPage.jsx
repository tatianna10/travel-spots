import { useParams, Link, useNavigate, useLocation } from "react-router";
import { useContext, useEffect, useState, useMemo } from "react";

import { AuthContext } from "../../contexts/AuthContext";

import { getPlaceById, deletePlace } from "../../api/placesApi";
import { getCommentsByPlace, createComment } from "../../api/commentsApi";
import { getLikes, checkUserLike, likePlace, unlikePlace } from "../../api/likesApi";
import { getUserById } from "../../api/userApi";

import Likes from "./Likes";
import Comments from "./Comments";

import { getDisplayName } from "../../utils/formatters";


export default function DetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useContext(AuthContext);

  const from = location.state?.from ?? "catalog";

  const [place, setPlace] = useState(null);
  const [comments, setComments] = useState([]);
  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeId, setLikeId] = useState(null);
  const [loading, setLoading] = useState(true);

  const isOwner = useMemo(() => place && user?.id === place.ownerId, [place, user]);

  const loadComments = async () => {
    const data = await getCommentsByPlace(id);

    const result = await Promise.all(
      data.map(async (c) => {
        try {
          const creator = await getUserById(c.authorId);
          return { ...c, authorName: getDisplayName(creator) };
        } catch {
          return { ...c, authorName: "Unknown user" };
        }
      })
    );

    setComments(result);
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
    async function loadData() {
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

    loadData();
  }, [id]);

  const handleLikeToggle = async () => {
    if (!isAuthenticated) return alert("Please login first!");
    if (isOwner) return;

    liked && likeId
      ? await unlikePlace(likeId)
      : await likePlace(id, user.id);

    await loadLikes();
  };

  const handleCommentCreate = async (text) => {
    if (!text.trim()) return;
    await createComment(id, text, user);
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

          <Likes
            likesCount={likesCount}
            liked={liked}
            isOwner={isOwner}
            isAuthenticated={isAuthenticated}
            onLikeToggle={handleLikeToggle}
          />

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

        <Comments
          comments={comments}
          isOwner={isOwner}
          isAuthenticated={isAuthenticated}
          onCreateComment={handleCommentCreate}
        />

      </div>
    </div>
  );
}
