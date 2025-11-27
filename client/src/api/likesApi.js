const baseUrl = "http://localhost:3030/data/likes";

async function handleResponse(res) {
  if (!res.ok) {
    let message = "Server error";
    try {
      const error = await res.json();
      if (error?.message) message = error.message;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }
  return res.json();
}

export async function getLikes(placeId) {
  const res = await fetch(`${baseUrl}?placeId=${placeId}`);
  const data = await handleResponse(res);
  return data.count; 
}

export async function checkUserLike(placeId, userId) {
  if (!userId) return { liked: false, likeId: null };

  const res = await fetch(
    `${baseUrl}/check?placeId=${placeId}&userId=${userId}`
  );
  return handleResponse(res); 
}

export async function likePlace(placeId, userId) {
  return handleResponse(
    await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ placeId, userId }),
    })
  );
}

export async function unlikePlace(likeId) {
  return handleResponse(
    await fetch(`${baseUrl}/${likeId}`, { method: "DELETE" })
  );
}
