import { apiRequest } from "./api";

export function getEmployees() {
  return apiRequest("/employees");
}

export function createEmployee(employee) {
  return apiRequest("/employees", {
    method: "POST",
    body: JSON.stringify(employee),
  });
}

export function updateEmployee(id, employee) {
  return apiRequest(`/employees/${id}`, {
    method: "PUT",
    body: JSON.stringify(employee),
  });
}

export function deleteEmployee(id) {
  return apiRequest(`/employees/${id}`, {
    method: "DELETE",
  });
}
