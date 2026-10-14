import { useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./services/productApi";
import ProductForm from "./components/ProductForm";

function App() {
  const [names, setNames] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load names from Laravel API
  async function loadNames() {
    try {
      setError("");

      const data = await getProducts();
      setNames(data);
    } catch (err) {
      setError(err.message || "Failed to load.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNames();
  }, []);

  // Clear the form
  function resetForm() {
    setName("");
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
      description: description.trim() || null,
    };

    try {
      if (editingId !== null) {
        await updateProduct(editingId, product);
        setSuccess("Updated successfully!");
      } else {
        await createProduct(product);
        setSuccess("Added successfully!");
      }

      resetForm();
      await loadProducts();
    } catch (err) {
      setError(err.message || "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  // Load product details into the form
  function handleEdit(product) {
    setName(product.name);s
    setDescription(product.description || "");
    setEditingId(product.id);

    setError("");
    setSuccess("");
  }

  // Delete a product
  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this ?"
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await deleteProduct(id);
      setSuccess("Deleted successfully!");
      await loadProducts();
    } catch (err) {
      setError(err.message || "Failed to delete.");
    }
  }

  return (
    <main style={styles.container}>
      <header>
        <h1>System Management</h1>
        <p>Manage names efficiently</p>
      </header>

      {/* Name Form */}
      <section style={styles.card}>
        <ProductForm
          name={name}
          setName={setName}
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

      {/* Name List */}
      <section style={styles.card}>
        <h2>Name List</h2>

        {loading ? (
          <p>Loading names...</p>
        ) : names.length === 0 ? (
          <p>No names yet. Add your first name above!</p>
        ) : (
          <div style={styles.list}>
            {names.map((name) => (
              <article key={name.id} style={styles.product}>
                <div>
                  <h3>{name.name}</h3>

                  {name.description && (
                    <p>{name.description}</p>
                  )}
                </div>

                <div style={styles.actions}>
                  <button
                    type="button"
                    onClick={() => handleEdit(name)}
                    style={styles.editButton}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(name.id)}
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
