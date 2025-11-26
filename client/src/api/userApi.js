const baseUrl = "http://localhost:3030/data/users";

async function handleRes(res) {
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Request failed");
  }
  return res.json();
}

export async function getUserById(id) {
  const res = await fetch(`${baseUrl}/${id}`);
  return handleRes(res);
}
