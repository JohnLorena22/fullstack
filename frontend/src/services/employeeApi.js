const API_URL = `${import.meta.env.VITE_API_URL}/employees`;

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(
      data.message || "Something went wrong."
    );

    error.status = response.status;
    error.errors = data.errors || {};
    throw error;
  }

  return data;
}

export function getEmployees() {
  return request(API_URL);
}

export function createEmployee(employee) {
  return request(API_URL, {
    method: "POST",
    body: JSON.stringify(employee),
  });
}

export function updateEmployee(id, employee) {
  return request(`${API_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(employee),
  });
}

export function deleteEmployee(id) {
  return request(`${API_URL}/${id}`, {
    method: "DELETE",
  });
}