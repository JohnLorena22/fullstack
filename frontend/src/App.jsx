import { useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./services/productApi";
import ProductForm from "./components/ProductForm";

function App() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load products from Laravel API
  async function loadProducts() {
    try {
      setError("");

      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  // Clear the form
  function resetForm() {
    setName("");
    setPrice("");
    setDescription("");
    setEditingId(null);
  }

  // Add or update a product
  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);

    const product = {
      name: name.trim(),
      price: Number(price),
      description: description.trim() || null,
    };

    try {
      if (editingId !== null) {
        await updateProduct(editingId, product);
        setSuccess("Product updated successfully!");
      } else {
        await createProduct(product);
        setSuccess("Product added successfully!");
      }

      resetForm();
      await loadProducts();
    } catch (err) {
      setError(err.message || "Failed to save product.");
    } finally {
      setSaving(false);
    }
  }

  // Load product details into the form
  function handleEdit(product) {
    setName(product.name);
    setPrice(String(product.price));
    setDescription(product.description || "");
    setEditingId(product.id);

    setError("");
    setSuccess("");
  }

  // Delete a product
  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await deleteProduct(id);
      setSuccess("Product deleted successfully!");
      await loadProducts();
    } catch (err) {
      setError(err.message || "Failed to delete product.");
    }
  }

  return (
    <main style={styles.container}>
      <header>
        <h1>System Management</h1>
        <p>Manage your products efficiently</p>
      </header>

      {/* Product Form */}
      <section style={styles.card}>
        <ProductForm
          name={name}
          setName={setName}
          price={price}
          setPrice={setPrice}
          description={description}
          setDescription={setDescription}
          editingId={editingId}
          saving={saving}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />
      </section>

      {/* Error Message */}
      {error && (
        <p role="alert" style={styles.error}>
          {error}
        </p>
      )}

      {/* Success Message */}
      {success && (
        <p role="status" style={styles.success}>
          {success}
        </p>
      )}

      {/* Product List */}
      <section style={styles.card}>
        <h2>Product List</h2>

        {loading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p>No products yet. Add your first product above!</p>
        ) : (
          <div style={styles.list}>
            {products.map((product) => (
              <article key={product.id} style={styles.product}>
                <div>
                  <h3>{product.name}</h3>

                  <p>
                    Price: ₱{Number(product.price).toFixed(2)}
                  </p>

                  {product.description && (
                    <p>{product.description}</p>
                  )}
                </div>

                <div style={styles.actions}>
                  <button
                    type="button"
                    onClick={() => handleEdit(product)}
                    style={styles.editButton}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(product.id)}
                    style={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}


const styles = {
  container: {
    width: "100%",
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "clamp(12px, 3vw, 32px)",
    boxSizing: "border-box",
    fontFamily: "Arial, sans-serif",
    color: "#292524",
  },
  card: {
    width: "100%",
    minWidth: 0,
    boxSizing: "border-box",
    padding: "clamp(16px, 3vw, 28px)",
    marginTop: "24px",
    border: "1px solid #e7e5e4",
    borderRadius: "12px",
    background: "#ffffff",
  },
  error: {
    padding: "12px",
    background: "#fee2e2",
    color: "#991b1b",
    borderRadius: "6px",
    overflowWrap: "anywhere",
  },
  success: {
    padding: "12px",
    background: "#dcfce7",
    color: "#166534",
    borderRadius: "6px",
    overflowWrap: "anywhere",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    width: "100%",
  },
  product: {
    padding: "16px",
    border: "1px solid #e7e5e4",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "12px",
    minWidth: 0,
    overflowWrap: "anywhere",
  },
  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  editButton: {
    padding: "8px 12px",
    cursor: "pointer",
  },
  deleteButton: {
    padding: "8px 12px",
    color: "#b91c1c",
    cursor: "pointer",
  },
};

export default App;