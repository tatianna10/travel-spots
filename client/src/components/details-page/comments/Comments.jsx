import { useState } from "react";

export default function Comments({
  comments,
  isAuthenticated,
  isOwner,
  onCreateComment,
}) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(""); 

    if (!text.trim()) {
      setError("Comment cannot be empty.");
      return;
    }

    try {
      await onCreateComment(text);
      setText("");
    } catch (err) {
      setError(err.message || "Failed to post comment.");
    }
  };

  return (
    <section className="details-comments-box">
      <h3 className="details-comments-title">Comments</h3>

      {!comments.length && <p className="details-no-comments">No comments yet.</p>}

      <ul className="details-comments-list">
        {comments.map((c) => (
          <li key={c.id} className="details-comment-item">
            <strong>{c.authorName}:</strong> {c.text}
            <span className="details-comment-date">• {c.createdAtFormatted}</span>
          </li>
        ))}
      </ul>

      {error && <p className="details-error-msg">{error}</p>}

      {isAuthenticated && !isOwner && (
        <form className="details-comment-form" onSubmit={handleSubmit}>
          <input
            className="details-comment-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment..."
          />
          <button className="details-comment-btn">Post</button>
        </form>
      )}

      {isAuthenticated && isOwner && (
        <p className="details-owner-msg">You can’t comment on your own place.</p>
      )}
    </section>
  );
}
