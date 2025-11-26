const baseUrl = "http://localhost:3030/data/comments";

async function handleRes(res) {
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Request failed");
  }
  return res.json();
}

export async function getCommentsByPlace(placeId) {
  const res = await fetch(`${baseUrl}?placeId=${encodeURIComponent(placeId)}`);
  return handleRes(res);
}

export async function createComment(placeId, text, user) {
  const res = await fetch(baseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      placeId,
      text: text.trim(),
      authorId: user.id, 
    }),
  });

  return handleRes(res);
}
