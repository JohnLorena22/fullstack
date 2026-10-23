const API_URL = `${import.meta.env.VITE_API_URL}/support-tickets`;

async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error(
      `The server returned an invalid response (HTTP ${response.status}).`
    );
  }

  if (!response.ok) {
    const validationErrors = Object.values(data.errors || {})
      .flat()
      .join("\n");

    throw new Error(
      validationErrors || data.message || "The request failed."
    );
  }

  return data;
}

export async function getSupportTickets() {
  const result = await request(API_URL);
  return result.data;
}

export async function createSupportTicket(ticket) {
  const result = await request(API_URL, {
    method: "POST",
    body: JSON.stringify(ticket),
  });

  return result.data;
}

export async function updateSupportTicket(id, ticket) {
  const result = await request(`${API_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(ticket),
  });

  return result.data;
}

export async function deleteSupportTicket(id) {
  return request(`${API_URL}/${id}`, {
    method: "DELETE",
  });
}