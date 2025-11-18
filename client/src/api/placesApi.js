const baseUrl = 'http://localhost:3030/data/places';

export async function getAllPlaces() {
  const res = await fetch(baseUrl);

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to load places');
  }

  return res.json();
}
