export default function Likes({
  likesCount,
  liked,
  isOwner,
  isAuthenticated,
  onLikeToggle,
}) {
  return (
    <button
      className={`details-btn like details-like-btn ${liked ? "liked" : ""}`}
      onClick={onLikeToggle}
      disabled={!isAuthenticated || isOwner}
    >
      {isOwner
        ? `❤️ ${likesCount} Like${likesCount !== 1 ? "s" : ""}`
        : liked
        ? `💔 Dislike ${likesCount}`
        : `👍 Like ${likesCount}`}
    </button>
  );
}
