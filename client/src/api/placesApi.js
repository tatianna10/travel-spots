const baseUrl = '${API_HOST}/api/data/places';

// Handle fetch errors
async function handleResponse(res) {
  if (!res.ok) {
    let error;
    try {
      error = await res.json();
    } catch {
      error = { message: 'Server error' };
    }
    throw new Error(error.message || 'Request failed');
  }
  return res.json();
}

// ============= GET ALL =============
export async function getAllPlaces() {
  const res = await fetch(baseUrl);
  return handleResponse(res);
}

// ============= GET BY ID ============
export async function getPlaceById(id) {
  const res = await fetch(`${baseUrl}/${id}`);
  return handleResponse(res);
}

// ============= CREATE =============
// ownerId is taken from JWT on the backend
export async function createPlace(placeData, user) {
  const res = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user.accessToken}`,
    },
    body: JSON.stringify(placeData),
  });

  return handleResponse(res);
}

// ============= UPDATE =============
export async function updatePlace(id, placeData, user) {
  const res = await fetch(`${baseUrl}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user.accessToken}`,
    },
    body: JSON.stringify(placeData),
  });

  return handleResponse(res);
}

// ============= DELETE =============
export async function deletePlace(id, user) {
  const res = await fetch(`${baseUrl}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${user.accessToken}`,
    },
  });

  await handleResponse(res);
  return true;
}
