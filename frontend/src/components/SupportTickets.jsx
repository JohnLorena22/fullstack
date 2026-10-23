import { useEffect, useMemo, useState } from "react";
import {
  getSupportTickets,
  createSupportTicket,
  updateSupportTicket,
  deleteSupportTicket,
} from "../services/supportTicketApi";

const emptyForm = {
  requester_name: "",
  requester_email: "",
  subject: "",
  description: "",
  category: "Hardware",
  priority: "Medium",
  assigned_to: "",
};

const categories = [
  "Hardware",
  "Software",
  "Network",
  "Account Access",
  "Other",
];

const priorities = ["Low", "Medium", "High", "Urgent"];

const statuses = ["Open", "In Progress", "Resolved", "Closed"];

function getErrorMessage(error) {
  return error?.message || "Something went wrong. Please try again.";
}

export default function SupportTickets({ employees = [] }) {
  const [tickets, setTickets] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadTickets() {
    setLoading(true);
    setError("");

    try {
      const data = await getSupportTickets();
      setTickets(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTickets();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await createSupportTicket({
        ...form,
        assigned_to: form.assigned_to || null,
      });

      setForm(emptyForm);
      setSuccess("Support ticket created successfully.");
      await loadTickets();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleTicketUpdate(id, changes) {
    setError("");
    setSuccess("");

    try {
      await updateSupportTicket(id, changes);
      setSuccess("Ticket updated successfully.");
      await loadTickets();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function handleDelete(ticket) {
    const confirmed = window.confirm(
      `Delete ticket ${ticket.ticket_number}? This cannot be undone.`
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await deleteSupportTicket(ticket.id);
      setTickets((previous) =>
        previous.filter((item) => item.id !== ticket.id)
      );
      setSuccess("Ticket deleted successfully.");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  const filteredTickets = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return tickets.filter((ticket) => {
      const matchesStatus =
        statusFilter === "All" || ticket.status === statusFilter;

      const searchableText = [
        ticket.ticket_number,
        ticket.requester_name,
        ticket.requester_email,
        ticket.subject,
        ticket.description,
        ticket.category,
        ticket.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesStatus && searchableText.includes(keyword);
    });
  }, [tickets, search, statusFilter]);

  const counts = {
    total: tickets.length,
    open: tickets.filter((ticket) => ticket.status === "Open").length,
    inProgress: tickets.filter(
      (ticket) => ticket.status === "In Progress"
    ).length,
    resolved: tickets.filter(
      (ticket) =>
        ticket.status === "Resolved" || ticket.status === "Closed"
    ).length,
  };

  function getEmployeeName(employee) {
    if (!employee) return "";

    return `${employee.first_name || ""} ${
      employee.last_name || ""
    }`.trim();
  }

  function getAssignedName(ticket) {
    if (ticket.assigned_employee) {
      return getEmployeeName(ticket.assigned_employee);
    }

    const employee = employees.find(
      (item) => Number(item.id) === Number(ticket.assigned_to)
    );

    return employee ? getEmployeeName(employee) : "Unassigned";
  }

  return (
    <section className="support-page">
      <div className="support-heading">
        <div>
          <h2>IT Support</h2>
          <p>Manage technical issues and employee support requests.</p>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={loadTickets}
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="support-message error-message" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="support-message success-message" role="status">
          {success}
        </div>
      )}

      <div className="support-stats">
        <div className="support-stat">
          <span>Total Tickets</span>
          <strong>{counts.total}</strong>
        </div>

        <div className="support-stat">
          <span>Open</span>
          <strong>{counts.open}</strong>
        </div>

        <div className="support-stat">
          <span>In Progress</span>
          <strong>{counts.inProgress}</strong>
        </div>

        <div className="support-stat">
          <span>Resolved / Closed</span>
          <strong>{counts.resolved}</strong>
        </div>
      </div>

      <div className="content-card">
        <div className="support-section-heading">
          <div>
            <h2>Create Support Ticket</h2>
            <p>Record a technical problem or service request.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="support-form">
          <div className="form-group">
            <label htmlFor="requester_name">Requester Name *</label>
            <input
              id="requester_name"
              name="requester_name"
              value={form.requester_name}
              onChange={handleChange}
              maxLength={255}
              required
              placeholder="Enter employee or customer name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="requester_email">Requester Email *</label>
            <input
              id="requester_email"
              name="requester_email"
              type="email"
              value={form.requester_email}
              onChange={handleChange}
              maxLength={255}
              required
              placeholder="name@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="subject">Subject *</label>
            <input
              id="subject"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              maxLength={255}
              required
              placeholder="Briefly describe the issue"
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority *</label>
            <select
              id="priority"
              name="priority"
              value={form.priority}
              onChange={handleChange}
              required
            >
              {priorities.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="assigned_to">Assign Employee</label>
            <select
              id="assigned_to"
              name="assigned_to"
              value={form.assigned_to}
              onChange={handleChange}
            >
              <option value="">Unassigned</option>

              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {getEmployeeName(employee)}
                </option>
              ))}
            </select>

            {employees.length === 0 && (
              <small>Add employees in Employee Management first.</small>
            )}
          </div>

          <div className="form-group form-group-full">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              required
              placeholder="Explain the problem and any relevant details."
            />
          </div>

          <div className="form-group-full">
            <button
              type="submit"
              className="primary-button"
              disabled={saving}
            >
              {saving ? "Creating Ticket..." : "Create Ticket"}
            </button>
          </div>
        </form>
      </div>

      <div className="content-card">
        <div className="support-section-heading">
          <div>
            <h2>Support Requests</h2>
            <p>Search, assign, and update existing tickets.</p>
          </div>
        </div>

        <div className="support-filters">
          <input
            className="search-input"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search ticket number, requester, or subject..."
            aria-label="Search support tickets"
          />

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter tickets by status"
          >
            <option value="All">All Statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="support-empty">Loading support tickets...</p>
        ) : filteredTickets.length === 0 ? (
          <div className="support-empty">
            <h3>No support tickets found</h3>
            <p>
              Create a ticket above, or change your search and filters.
            </p>
          </div>
        ) : (
          <div className="support-ticket-list">
            {filteredTickets.map((ticket) => (
              <article className="support-ticket" key={ticket.id}>
                <div className="ticket-main">
                  <div className="ticket-title-row">
                    <span className="ticket-number">
                      {ticket.ticket_number}
                    </span>

                    <span
                      className={`ticket-priority priority-${(
                        ticket.priority || "medium"
                      ).toLowerCase()}`}
                    >
                      {ticket.priority}
                    </span>
                  </div>

                  <h3>{ticket.subject}</h3>

                  <p className="ticket-description">
                    {ticket.description}
                  </p>

                  <div className="ticket-meta">
                    <span>{ticket.category}</span>
                    <span>{ticket.requester_name}</span>
                    <span>{ticket.requester_email}</span>
                  </div>

                  <p className="ticket-assignee">
                    <strong>Assigned to:</strong> {getAssignedName(ticket)}
                  </p>

                  {ticket.resolution_notes && (
                    <p className="ticket-resolution">
                      <strong>Resolution:</strong> {ticket.resolution_notes}
                    </p>
                  )}

                  <small className="ticket-date">
                    Created:{" "}
                    {ticket.created_at
                      ? new Date(ticket.created_at).toLocaleString()
                      : "Unknown"}
                  </small>
                </div>

                <div className="ticket-controls">
                  <div className="form-group">
                    <label htmlFor={`status-${ticket.id}`}>Status</label>
                    <select
                      id={`status-${ticket.id}`}
                      value={ticket.status}
                      onChange={(event) =>
                        handleTicketUpdate(ticket.id, {
                          status: event.target.value,
                        })
                      }
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor={`priority-${ticket.id}`}>
                      Priority
                    </label>
                    <select
                      id={`priority-${ticket.id}`}
                      value={ticket.priority}
                      onChange={(event) =>
                        handleTicketUpdate(ticket.id, {
                          priority: event.target.value,
                        })
                      }
                    >
                      {priorities.map((priority) => (
                        <option key={priority} value={priority}>
                          {priority}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor={`assignee-${ticket.id}`}>
                      Assigned Employee
                    </label>
                    <select
                      id={`assignee-${ticket.id}`}
                      value={ticket.assigned_to || ""}
                      onChange={(event) =>
                        handleTicketUpdate(ticket.id, {
                          assigned_to: event.target.value || null,
                        })
                      }
                    >
                      <option value="">Unassigned</option>
                      {employees.map((employee) => (
                        <option key={employee.id} value={employee.id}>
                          {getEmployeeName(employee)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="ticket-actions">
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => {
                        const notes = window.prompt(
                          "Enter resolution notes:",
                          ticket.resolution_notes || ""
                        );

                        if (notes !== null) {
                          handleTicketUpdate(ticket.id, {
                            resolution_notes: notes,
                          });
                        }
                      }}
                    >
                      Resolution Notes
                    </button>

                    <button
                      type="button"
                      className="danger-button"
                      onClick={() => handleDelete(ticket)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}