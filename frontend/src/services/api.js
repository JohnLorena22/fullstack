const API_URL = import.meta.env.VITE_API_URL;

export async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const text = await response.text();

  let data;

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(
      `Server returned invalid JSON (HTTP ${response.status}).`
    );
  }

  if (!response.ok) {
    const error = new Error(
      data.message || `Request failed (HTTP ${response.status}).`
    );
    error.status = response.status;
    error.errors = data.errors || {};
    throw error;
  }

  return data;
}