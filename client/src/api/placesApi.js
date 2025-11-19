const baseUrl = "http://localhost:3030/data/places";

export async function getAllPlaces() {
  const res = await fetch(baseUrl);

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to load places");
  }

  return res.json(); // returns array of all places
}

export async function getPlaceById(id) {
  const places = await getAllPlaces();
  return places.find(p => p.id === id) || null;
}
