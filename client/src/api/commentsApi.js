const baseUrl = "http://localhost:3030/data/comments";

async function handleRes(res) {
  if (!res.ok) {
    let error;
    try {
      error = await res.json();
    } catch {
      throw new Error("Request failed");
    }
    throw new Error(error.message || "Request failed");
  }
  return res.json();
}

export async function getCommentsByPlace(placeId) {
  const res = await fetch(`${baseUrl}?where=placeId%3D%22${placeId}%22`);

  return handleRes(res);
}

export async function createComment(placeId, text, user = "Guest") {
  const res = await fetch(baseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      placeId,
      text,
      user,
      createdAt: new Date().toISOString(),
    }),
  });

  return handleRes(res);
}
