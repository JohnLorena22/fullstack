
import { useState } from "react";
import "./App.css";

const menuItems = [
  { id: "dashboard", icon: "▦", label: "Dashboard" },
  { id: "employees", icon: "♙", label: "Employees" },
  { id: "positions", icon: "▤", label: "Company Positions" },
  { id: "tickets", icon: "▧", label: "IT Help Desk" },
  { id: "reports", icon: "▥", label: "Reports" },
];

const sampleEmployees = [
  { id: 1, name: "Alex Morgan", department: "IT Department", position: "IT Support", status: "Active" },
  { id: 2, name: "Jamie Lee", department: "Human Resources", position: "HR Manager", status: "Active" },
  { id: 3, name: "Taylor Cruz", department: "Finance", position: "Accountant", status: "Active" },
];

const sampleTickets = [
  { id: "HD-001", subject: "Computer cannot connect to Wi-Fi", requester: "Alex Morgan", priority: "High", status: "Open" },
  { id: "HD-002", subject: "Request for software installation", requester: "Jamie Lee", priority: "Normal", status: "In Progress" },
  { id: "HD-003", subject: "Printer connection issue", requester: "Taylor Cruz", priority: "Normal", status: "Resolved" },
];

function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [search, setSearch] = useState("");

  const pageTitle =
    menuItems.find((item) => item.id === activePage)?.label || "Dashboard";

  const filteredEmployees = sampleEmployees.filter((employee) =>
    `${employee.name} ${employee.department} ${employee.position}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">IT</div>
          <div>
            <strong>HelpDesk</strong>
            <span>Information System</span>
          </div>
        </div>

        <p className="menu-heading">WORKSPACE</p>

        <nav className="navigation">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activePage === item.id ? "active" : ""}`}
              onClick={() => {
                setActivePage(item.id);
                setSearch("");
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="avatar">AD</div>
          <div>
            <strong>Administrator</strong>
            <span>System Admin</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="breadcrumb">Workspace / {pageTitle}</p>
            <h1>{pageTitle}</h1>
          </div>
          <div className="topbar-status">
            <span className="status-dot" />
            IT Management Portal
          </div>
        </header>

        <div className="page-content">
          {activePage === "dashboard" && (
            <>
              <section className="welcome-panel">
                <div>
                  <p className="eyebrow">INFORMATION MANAGEMENT</p>
                  <h2>Welcome to your workspace</h2>
                  <p>
                    Manage company employees, positions, and IT support requests
                    in one place.
                  </p>
                </div>
                <div className="welcome-art">IT</div>
              </section>

              <section className="stats-grid">
                <StatCard label="Total Employees" value="03" detail="Sample records" icon="♙" />
                <StatCard label="Open Tickets" value="01" detail="Needs attention" icon="▧" />
                <StatCard label="In Progress" value="01" detail="Being handled" icon="◷" />
                <StatCard label="Resolved Tickets" value="01" detail="Completed" icon="✓" />
              </section>

              <section className="panel">
                <div className="panel-header">
                  <div>
                    <h2>Recent IT Requests</h2>
                    <p>Example tickets for the initial interface</p>
                  </div>
                  <button
                    className="secondary-button"
                    onClick={() => setActivePage("tickets")}
                  >
                    View all
                  </button>
                </div>
                <TicketTable tickets={sampleTickets.slice(0, 3)} />
              </section>
            </>
          )}

          {activePage === "employees" && (
            <section className="panel">
              <div className="panel-header">
                <div>
                  <h2>Employee Directory</h2>
                  <p>Company personnel and their assigned positions</p>
                </div>
                <button
                  className="primary-button"
                  onClick={() =>
                    alert("We will build the Add Employee form in the next step.")
                  }
                >
                  + Add Employee
                </button>
              </div>

              <input
                className="search-input"
                placeholder="Search employees, departments, or positions..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>EMPLOYEE</th>
                      <th>DEPARTMENT</th>
                      <th>POSITION</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map((employee) => (
                      <tr key={employee.id}>
                        <td><strong>{employee.name}</strong></td>
                        <td>{employee.department}</td>
                        <td>{employee.position}</td>
                        <td><span className="pill resolved">{employee.status}</span></td>
                      </tr>
                    ))}
                    {filteredEmployees.length === 0 && (
                      <tr>
                        <td colSpan="4">No matching employees found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activePage === "positions" && (
            <section className="panel">
              <div className="panel-header">
                <div>
                  <h2>Company Positions</h2>
                  <p>Positions must exist before assigning them to employees.</p>
                </div>
                <button
                  className="primary-button"
                  onClick={() =>
                    alert("We will build position management in a later step.")
                  }
                >
                  + Add Position
                </button>
              </div>
              <div className="notice">
                <strong>Position validation</strong>
                <p>
                  The backend will verify that an employee's selected position
                  exists in the company positions database.
                </p>
              </div>
              <ul className="position-list">
                {["IT Support", "HR Manager", "Accountant"].map((position) => (
                  <li key={position}>
                    <span className="position-symbol">▤</span>
                    <strong>{position}</strong>
                    <span className="position-tag">Sample position</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {activePage === "tickets" && (
            <section className="panel">
              <div className="panel-header">
                <div>
                  <h2>IT Support Tickets</h2>
                  <p>Track technical issues and service requests.</p>
                </div>
                <button
                  className="primary-button"
                  onClick={() =>
                    alert("We will build the ticket form in a later step.")
                  }
                >
                  + New Ticket
                </button>
              </div>
              <TicketTable tickets={sampleTickets} />
            </section>
          )}

          {activePage === "reports" && (
            <section className="panel">
              <h2>Reports Overview</h2>
              <p className="muted">
                Reports will summarize employee records, ticket statuses, and
                IT support activity after the database is connected.
              </p>
              <div className="notice">
                These dashboard figures are examples, not saved database records.
              </div>
            </section>
          )}

          <footer className="page-footer">
            <span>IT Help Desk & Information Management</span>
            <span>Development Preview</span>
          </footer>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, detail, icon }) {
  return (
    <article className="stat-card">
      <div className="stat-top">
        <span>{label}</span>
        <span className="stat-icon">{icon}</span>
      </div>
      <strong className="stat-value">{value}</strong>
      <span className="stat-detail">{detail}</span>
    </article>
  );
}

function TicketTable({ tickets }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>TICKET</th>
            <th>SUBJECT</th>
            <th>REQUESTER</th>
            <th>PRIORITY</th>
            <th>STATUS</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td><strong>{ticket.id}</strong></td>
              <td>{ticket.subject}</td>
              <td>{ticket.requester}</td>
              <td>
                <span className={`pill ${ticket.priority === "High" ? "high" : "normal"}`}>
                  {ticket.priority}
                </span>
              </td>
              <td>
                <span
                  className={`pill ${
                    ticket.status === "Resolved"
                      ? "resolved"
                      : ticket.status === "In Progress"
                        ? "progress"
                        : "open"
                  }`}
                >
                  {ticket.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
