const baseUrl = 'http://localhost:3030/data/likes';

async function handleResponse(res) {
  if (!res.ok) {
    let message = 'Server error';
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
  const res = await fetch(`${baseUrl}?placeId=${encodeURIComponent(placeId)}`);
  const data = await handleResponse(res);
  return data.count;
}

// user is the object from AuthContext (contains accessToken)
export async function checkUserLike(placeId, user) {
  if (!user?.accessToken) return { liked: false, likeId: null };

  const res = await fetch(`${baseUrl}/check?placeId=${encodeURIComponent(placeId)}`, {
    headers: {
      Authorization: `Bearer ${user.accessToken}`,
    },
  });

  return handleResponse(res);
}

export async function likePlace(placeId, user) {
  if (!user?.accessToken) throw new Error('Missing access token');

  const res = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user.accessToken}`,
    },
    body: JSON.stringify({ placeId }),
  });

  return handleResponse(res);
}

export async function unlikePlace(likeId, user) {
  if (!user?.accessToken) throw new Error('Missing access token');

  const res = await fetch(`${baseUrl}/${likeId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${user.accessToken}`,
    },
  });

  return handleResponse(res);
}
