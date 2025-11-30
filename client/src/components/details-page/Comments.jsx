import { Link } from "react-router";
import { useState } from "react";

export default function Comments({
  comments,
  isAuthenticated,
  isOwner,
  onCreateComment,
}) {
  const [text, setText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await onCreateComment(text);
    setText("");
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

      {!isAuthenticated && (
        <p className="details-login-msg">
          <Link to="/login" className="details-login-link">Login</Link> to comment.
        </p>
      )}

      {isAuthenticated && !isOwner && (
        <form className="details-comment-form" onSubmit={handleSubmit}>
          <input
            className="details-comment-input"
            placeholder="Add a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
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
