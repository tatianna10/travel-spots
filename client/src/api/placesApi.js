const baseUrl = "http://localhost:3030/data/places";

// Handle fetch errors
async function handleResponse(res) {
  if (!res.ok) {
    let error;
    try {
      error = await res.json();
    } catch {
      error = { message: "Server error" };
    }
    throw new Error(error.message || "Request failed");
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
// MUST include token and ownerId
export async function createPlace(placeData, token) {
  const res = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Authorization": token
    },
    body: JSON.stringify(placeData),
  });
  return handleResponse(res);
}

// ============= UPDATE =============
export async function updatePlace(id, placeData, token) {
  const res = await fetch(`${baseUrl}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Authorization": token
    },
    body: JSON.stringify(placeData),
  });
  return handleResponse(res);
}

// ============= DELETE =============
export async function deletePlace(id, token) {
  const res = await fetch(`${baseUrl}/${id}`, {
    method: "DELETE",
    headers: {
      "X-Authorization": token
    }
  });

  await handleResponse(res);
  return true;
}
