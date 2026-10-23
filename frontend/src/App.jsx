import { useEffect, useState } from "react";
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "./services/employeeApi";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;

const emptyForm = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  position_id: "",
};

async function getCollection(endpoint) {
  const response = await fetch(`${API_URL}/${endpoint}`, {
    headers: { Accept: "application/json" },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Unable to load ${endpoint}.`);
  }

  return data;
}

function App() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const [employeeData, departmentData, positionData] =
        await Promise.all([
          getEmployees(),
          getCollection("departments"),
          getCollection("positions"),
        ]);

      setEmployees(employeeData);
      setDepartments(departmentData);
      setPositions(positionData);
    } catch (err) {
      setError(err.message || "Unable to load management data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
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
      const employeeData = {
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        position_id: Number(form.position_id),
      };

      if (!employeeData.position_id) {
        throw new Error("Please select a valid employee position.");
      }

      if (editingId !== null) {
        await updateEmployee(editingId, employeeData);
        setSuccess("Employee updated successfully.");
      } else {
        await createEmployee(employeeData);
        setSuccess("Employee added successfully.");
      }

      resetForm();
      await loadData();
    } catch (err) {
      if (err.errors) {
        setError(Object.values(err.errors).flat().join(" "));
      } else {
        setError(err.message || "Unable to save employee.");
      }
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(employee) {
    setForm({
      first_name: employee.first_name || "",
      last_name: employee.last_name || "",
      email: employee.email || "",
      phone: employee.phone || "",
      position_id: String(
        employee.position_id ?? employee.position?.id ?? ""
      ),
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
      await loadData();
    } catch (err) {
      setError(err.message || "Unable to delete employee.");
    }
  }

  function getDepartmentName(employee) {
    return (
      employee.position?.department?.name ||
      "—"
    );
  }

  function getPositionName(employee) {
    return employee.position?.name || "—";
  }

  const filteredEmployees = employees.filter((employee) => {
    const searchableText = [
      employee.first_name,
      employee.last_name,
      employee.email,
      employee.phone,
      getDepartmentName(employee),
      getPositionName(employee),
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

        <div className="nav-item active">
          <span>▦</span>
          Dashboard
        </div>

        <div className="nav-item selected">
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
            type="button"
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
            <h2>{departments.length}</h2>
            <span>Registered company departments</span>
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
            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        {success && (
          <div className="alert success-alert" role="status">
            {success}
            <button
              type="button"
              onClick={() => setSuccess("")}
              aria-label="Dismiss message"
            >
              ×
            </button>
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
                <label htmlFor="department-display">Department</label>
                <input
                  id="department-display"
                  value={
                    positions.find(
                      (position) =>
                        String(position.id) === String(form.position_id)
                    )?.department?.name || "Select a position first"
                  }
                  readOnly
                  aria-describedby="department-help"
                />
                <small id="department-help">
                  The department comes from the selected position.
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="position_id">Position *</label>
                <select
                  id="position_id"
                  name="position_id"
                  value={form.position_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a position</option>

                  {positions.map((position) => (
                    <option key={position.id} value={position.id}>
                      {position.name}
                      {position.department?.name
                        ? ` — ${position.department.name}`
                        : ""}
                    </option>
                  ))}
                </select>

                {positions.length === 0 && (
                  <small>
                    No positions found. Add a department and position first.
                  </small>
                )}
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
                disabled={saving || positions.length === 0}
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
                            {employee.first_name?.charAt(0)}
                            {employee.last_name?.charAt(0)}
                          </div>
                          <strong>
                            {employee.first_name} {employee.last_name}
                          </strong>
                        </div>
                      </td>

                      <td>{employee.email}</td>
                      <td>{getDepartmentName(employee)}</td>

                      <td>
                        <span className="position-badge">
                          {getPositionName(employee)}
                        </span>
                      </td>

                      <td>{employee.phone || "—"}</td>

                      <td>
                        <div className="table-actions">
                          <button
                            type="button"
                            className="edit-button"
                            onClick={() => handleEdit(employee)}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
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