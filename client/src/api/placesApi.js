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

export async function getAllPlaces() {
  const res = await fetch(baseUrl);
  return handleResponse(res);   
}

export async function getPlaceById(id) {
  const res = await fetch(`${baseUrl}/${id}`);
  return handleResponse(res);
}

export async function createPlace(placeData) {
  const res = await fetch(baseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(placeData),
  });
  return handleResponse(res);
}

export async function updatePlace(id, placeData) {
  const res = await fetch(`${baseUrl}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(placeData),
  });
  return handleResponse(res);
}

export async function deletePlace(id) {
  const res = await fetch(`${baseUrl}/${id}`, {
    method: "DELETE",
  });
  await handleResponse(res);
  return true;
}
