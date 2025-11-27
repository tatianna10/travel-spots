const baseUrl = "http://localhost:3030/data/likes";

async function handleResponse(res) {
  if (!res.ok) {
    let err;
    try {
      err = await res.json();
    } catch {
      err = { message: "Server error" };
    }
    throw new Error(err.message || "Request failed");
  }

  return res.json();
}

export async function getLikesCount(placeId) {
  const res = await fetch(`${baseUrl}?placeId=${encodeURIComponent(placeId)}`);
  return handleResponse(res);
}

export async function checkUserLike(placeId, userId) {
  const res = await fetch(
    `${baseUrl}/check?placeId=${encodeURIComponent(
      placeId
    )}&userId=${encodeURIComponent(userId)}`
  );
  return handleResponse(res); 
}

// POST /data/likes
export async function likePlace(placeId, userId) {
  const res = await fetch(baseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ placeId, userId }),
  });
  return handleResponse(res); // returns like object with id
}

// DELETE /data/likes/:id
export async function unlikePlace(likeId) {
  const res = await fetch(`${baseUrl}/${likeId}`, {
    method: "DELETE",
  });
  return handleResponse(res);
}
