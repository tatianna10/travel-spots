const baseUrl = "http://localhost:3030/data/places";

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

export async function getAllPlaces() {
  const res = await fetch(baseUrl);
  return handleRes(res);
}

export async function getPlaceById(id) {
  const res = await fetch(`${baseUrl}/${id}`);
  return handleRes(res);
}

export async function updatePlace(id, data) {
  const res = await fetch(`${baseUrl}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleRes(res);
}
