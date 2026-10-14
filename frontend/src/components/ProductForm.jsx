function ProductForm({
  name,
  setName,

  description,
  setDescription,
  editingId,
  saving,
  onSubmit,
  onCancel,
}) {
  return (
    <>
      <h2>{editingId !== null ? "Edit Product" : "Add Product"}</h2>

      <form onSubmit={onSubmit} style={styles.form}>
        <label htmlFor="name">Product Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Enter product name"
          maxLength={255}
          style={styles.input}
          required
        />

        <label htmlFor="price">Price</label>
        <input
          id="price"
          type="number"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          placeholder="Enter price"
          min="0"
          step="0.01"
          style={styles.input}
          required
        />

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Enter product description (optional)"
          rows={3}
          style={styles.textarea}
        />

        <button
          type="submit"
          disabled={saving}
          style={styles.button}
        >
          {saving
            ? "Saving..."
            : editingId !== null
              ? "Update"
              : "Add "}
        </button>

        {editingId !== null && (
          <button
            type="button"
            onClick={onCancel}
            style={styles.cancelButton}
          >
            Cancel Edit
          </button>
        )}
      </form>
    </>
  );
}

const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    width: "100%",
    minWidth: 0,
  },
  input: {
    width: "100%",
    maxWidth: "100%",
    boxSizing: "border-box",
    padding: "10px",
    border: "1px solid #d6d3d1",
    borderRadius: "6px",
    fontSize: "16px",
  },
  textarea: {
    width: "100%",
    maxWidth: "100%",
    boxSizing: "border-box",
    padding: "10px",
    border: "1px solid #d6d3d1",
    borderRadius: "6px",
    fontSize: "16px",
    resize: "vertical",
  },
  button: {
    padding: "12px",
    marginTop: "8px",
    background: "#44403c",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  cancelButton: {
    padding: "10px",
    background: "#e7e5e4",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default ProductForm;
