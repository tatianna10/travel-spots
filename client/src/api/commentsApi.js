const baseUrl = "http://localhost:3030/data/comments";

async function handleRes(res) {
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Request failed");
  }
  return res.json();
}


export async function getCommentsByPlace(placeId) {
  const query = `?where=placeId%3D%22${placeId}%22`;
  const res = await fetch(baseUrl + query);
  return handleRes(res);
}


export async function createComment(placeId, text) {
  const commentData = {
    placeId,
    text,
    createdAt: new Date().toISOString(),
  };

  const res = await fetch(baseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(commentData),
  });

  return handleRes(res);
}
