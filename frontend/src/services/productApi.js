import { apiRequest } from "./api";

export function getProducts() {
  return apiRequest("/products");
}

export function createProduct(product) {
  return apiRequest("/products", {
    method: "POST",
    body: JSON.stringify(product),
  });
}

export function updateProduct(id, product) {
  return apiRequest(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(product),
  });
}

export function deleteProduct(id) {
  return apiRequest(`/products/${id}`, {
    method: "DELETE",
  });
}