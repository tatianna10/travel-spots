import { useState } from "react";

export default function Likes({
  likesCount,
  liked,
  isOwner,
  isAuthenticated,
  onLikeToggle,
}) {
  const [error, setError] = useState(null);

  if (!isAuthenticated) return null;

  const handleClick = async () => {
    try {
      setError(null);
      await onLikeToggle();
    } catch (err) {
      setError(err.message || "Failed to update like status");
    }
  };

  return (
    <div className="details-like-wrapper">
      <button
        className={`details-like-btn ${liked ? "liked" : ""}`}
        onClick={handleClick}
        disabled={isOwner}
      >
        {isOwner
          ? `❤️ ${likesCount} Like${likesCount !== 1 ? "s" : ""}`
          : liked
          ? `💔 Dislike ${likesCount}`
          : `👍 Like ${likesCount}`}
      </button>

      {error && <p className="details-like-error">{error}</p>}
    </div>
  );
}
