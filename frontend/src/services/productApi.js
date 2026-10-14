import { apiRequest } from "./api";

export function getProducts() {
  return apiRequest("/names");
}

export function createProduct(product) {
  return apiRequest("/names", {
    method: "POST",
    body: JSON.stringify(product),
  });
}

export function updateProduct(id, product) {
  return apiRequest(`/names/${id}`, {
    method: "PUT",
    body: JSON.stringify(product),
  });
}

export function deleteProduct(id) {
  return apiRequest(`/names/${id}`, {
    method: "DELETE",
  });
}