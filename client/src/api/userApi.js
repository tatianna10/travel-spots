// ===== USER API SERVICE =====

const baseUrl = "http://localhost:3030/data/users";

async function handleResponse(res) {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Server error" }));
    throw new Error(error.message || "Request failed");
  }
  return res.json();
}

export async function getUserById(id) {
  const res = await fetch(`${baseUrl}/${id}`);
  return handleResponse(res);
}
