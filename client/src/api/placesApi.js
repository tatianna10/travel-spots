const baseUrl = "http://localhost:3030/data/places";


export async function getAllPlaces() {
  const res = await fetch(baseUrl);

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to load places");
  }

  const data = await res.json();

  return Object.values(data);
}

export async function getPlaceById(id) {
  const res = await fetch(`${baseUrl}/${id}`);

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to load place");
  }

  return res.json();
}


export async function createPlace(placeData) {
  const res = await fetch(baseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(placeData)
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create place");
  }

  return res.json();
}


export async function updatePlace(id, placeData) {
  const res = await fetch(`${baseUrl}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(placeData)
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to update place");
  }

  return res.json();
}


export async function deletePlace(id) {
  const res = await fetch(`${baseUrl}/${id}`, {
    method: "DELETE"
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to delete place");
  }

  return true;
}
