import { useEffect, useState } from "react";
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "./services/employeeApi";
import "./App.css";

const emptyForm = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  department: "",
  position: "",
};

function App() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadEmployees() {
    setLoading(true);
    setError("");

    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (err) {
      setError(err.message || "Unable to load employees.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let ignore = false;

    getEmployees()
      .then((data) => {
        if (!ignore) setEmployees(data);
      })
      .catch((err) => {
        if (!ignore) setError(err.message || "Unable to load employees.");
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (editingId !== null) {
        await updateEmployee(editingId, form);
        setSuccess("Employee updated successfully.");
      } else {
        await createEmployee(form);
        setSuccess("Employee added successfully.");
      }

      resetForm();
      await loadEmployees();
    } catch (err) {
      if (err.errors) {
        const messages = Object.values(err.errors).flat();
        setError(messages.join(" "));
      } else {
        setError(err.message || "Unable to save employee.");
      }
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(employee) {
    setForm({
      first_name: employee.first_name,
      last_name: employee.last_name,
      email: employee.email,
      phone: employee.phone || "",
      department: employee.department,
      position: employee.position,
    });

    setEditingId(employee.id);
    setError("");
    setSuccess("");

    document
      .getElementById("employee-form")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  async function handleDelete(employee) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${employee.first_name} ${employee.last_name}?`
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await deleteEmployee(employee.id);

      if (editingId === employee.id) {
        resetForm();
      }

      setSuccess("Employee deleted successfully.");
      await loadEmployees();
    } catch (err) {
      setError(err.message || "Unable to delete employee.");
    }
  }

  const filteredEmployees = employees.filter((employee) => {
    const searchableText = [
      employee.first_name,
      employee.last_name,
      employee.email,
      employee.department,
      employee.position,
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(search.toLowerCase());
  });

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">IT</div>
          <div>
            <h2>IT Manager</h2>
            <p>Management System</p>
          </div>
        </div>

        <p className="nav-heading">WORKSPACE</p>

        <div className="nav-item">
          <span>▦</span>
          Dashboard
        </div>

        <div className="nav-item active" aria-current="page">
          <span>♙</span>
          Employees
        </div>

        <div className="nav-item">
          <span>▤</span>
          IT Support
        </div>

        <div className="nav-item">
          <span>▥</span>
          Reports
        </div>

        <div className="sidebar-bottom">
          <div className="profile-avatar">A</div>
          <div>
            <strong>Administrator</strong>
            <p>Local workspace</p>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="breadcrumb">Workspace / Employees</p>
            <h1>Employee Management</h1>
            <p className="page-subtitle">
              Manage your company's employee information.
            </p>
          </div>

          <button
            className="primary-button"
            onClick={() => {
              resetForm();
              setError("");
              setSuccess("");
              document
                .getElementById("employee-form")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            + Add Employee
          </button>
        </header>

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon purple">♙</div>
            <p>Total Employees</p>
            <h2>{employees.length}</h2>
            <span>Registered employee records</span>
          </div>

          <div className="stat-card">
            <div className="stat-icon blue">▤</div>
            <p>Departments</p>
            <h2>
              {new Set(
                employees.map((employee) => employee.department)
              ).size}
            </h2>
            <span>Departments represented</span>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">✓</div>
            <p>Search Results</p>
            <h2>{filteredEmployees.length}</h2>
            <span>Employees matching your search</span>
          </div>
        </section>

        {error && (
          <div className="alert error-alert" role="alert">
            {error}
            <button onClick={() => setError("")}>×</button>
          </div>
        )}

        {success && (
          <div className="alert success-alert" role="status">
            {success}
            <button onClick={() => setSuccess("")}>×</button>
          </div>
        )}

        <section className="content-card" id="employee-form">
          <div className="section-heading">
            <div>
              <h2>
                {editingId !== null ? "Edit Employee" : "Add New Employee"}
              </h2>
              <p>
                {editingId !== null
                  ? "Update the employee's information below."
                  : "Enter the employee's information below."}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="first_name">First Name *</label>
                <input
                  id="first_name"
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  maxLength={255}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="last_name">Last Name *</label>
                <input
                  id="last_name"
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  maxLength={255}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="employee@company.com"
                  maxLength={255}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  maxLength={255}
                />
              </div>

              <div className="form-group">
                <label htmlFor="department">Department *</label>
                <input
                  id="department"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  placeholder="e.g. Information Technology"
                  maxLength={255}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="position">Position *</label>
                <input
                  id="position"
                  name="position"
                  value={form.position}
                  onChange={handleChange}
                  placeholder="e.g. IT Support Specialist"
                  maxLength={255}
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              {editingId !== null && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={resetForm}
                  disabled={saving}
                >
                  Cancel
                </button>
              )}

              <button
                type="submit"
                className="primary-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId !== null
                    ? "Save Changes"
                    : "Save Employee"}
              </button>
            </div>
          </form>
        </section>

        <section className="content-card">
          <div className="section-heading employee-list-heading">
            <div>
              <h2>Employee Directory</h2>
              <p>View and manage registered employees.</p>
            </div>

            <input
              className="search-input"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search employees..."
              aria-label="Search employees"
            />
          </div>

          {loading ? (
            <div className="empty-state">Loading employees...</div>
          ) : filteredEmployees.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">♙</div>
              <h3>
                {search ? "No matching employees" : "No employees yet"}
              </h3>
              <p>
                {search
                  ? "Try a different search term."
                  : "Add your first employee using the form above."}
              </p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="employee-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Position</th>
                    <th>Phone</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.id}>
                      <td>
                        <div className="employee-name">
                          <div className="employee-avatar">
                            {employee.first_name.charAt(0)}
                            {employee.last_name.charAt(0)}
                          </div>
                          <strong>
                            {employee.first_name} {employee.last_name}
                          </strong>
                        </div>
                      </td>
                      <td>{employee.email}</td>
                      <td>{employee.department}</td>
                      <td>
                        <span className="position-badge">
                          {employee.position}
                        </span>
                      </td>
                      <td>{employee.phone || "—"}</td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="edit-button"
                            onClick={() => handleEdit(employee)}
                          >
                            Edit
                          </button>
                          <button
                            className="delete-button"
                            onClick={() => handleDelete(employee)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer className="page-footer">
          IT Management System · Employee Management
        </footer>
      </main>
    </div>
  );
}

export default App;
