import { useEffect, useState } from "react";
import { getCommentsByPlace, createComment } from "../../api/commentsApi";

export default function Comments({ placeId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCommentsByPlace(placeId)
      .then((data) => {
        setComments(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [placeId]);

  const submit = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    try {
      const newComment = await createComment(placeId, trimmed, "Guest");
      setComments((prev) => [...prev, newComment]);
      setText("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="details-comments">
      <h3>Comments</h3>

      {loading && <p className="comments-empty">Loading comments...</p>}

      {!loading && comments.length === 0 && (
        <p className="comments-empty">No comments yet. Be the first!</p>
      )}

      <ul className="comments-list">
        {comments.map((c) => (
          <li key={c.id} className="comment-item">
            <div className="comment-header">
              <span className="comment-author">{c.user || "User"}</span>
              <span className="comment-date">
                {c.createdAt
                  ? new Date(c.createdAt).toLocaleString()
                  : ""}
              </span>
            </div>
            <p className="comment-text">{c.text}</p>
          </li>
        ))}
      </ul>

      <form className="comment-form" onSubmit={submit}>
        <textarea
          placeholder="Write your comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit">Post Comment</button>
      </form>
    </section>
  );
}
