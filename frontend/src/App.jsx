import { useState, useEffect } from "react";
import "./App.css";

function App() {
  // ==========================================
  // LOGIN
  // ==========================================
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ==========================================
  // STATION FORM
  // ==========================================
  const [showAddStation, setShowAddStation] = useState(false);
  const [editingStation, setEditingStation] = useState(null);

  // ==========================================
  // STATIONS
  // ==========================================
  const [stations, setStations] = useState([]);

  // ==========================================
  // FORM FIELDS
  // ==========================================
  const [stationName, setStationName] = useState("");
  const [tier, setTier] = useState("");
  const [rate, setRate] = useState("");
  const [status, setStatus] = useState("Available");
  const [formError, setFormError] = useState("");

  // ==========================================
  // GET ALL STATIONS
  // ==========================================
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/stations")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch stations.");
        }

        return response.json();
      })
      .then((data) => {
        setStations(data);
      })
      .catch((error) => {
        console.error("Error fetching stations:", error);
      });
  }, []);

  // ==========================================
  // LOGIN
  // ==========================================
  const handleLogin = (e) => {
    e.preventDefault();

    if (
      username === "admin" &&
      password === "password"
    ) {
      setError("");
      setIsLoggedIn(true);
    } else {
      setError("Invalid username or password.");
    }
  };

  // ==========================================
  // ADD STATION
  // ==========================================
  const handleAddStation = async (e) => {
    e.preventDefault();

    if (!stationName || !tier || !rate || !status) {
      setFormError("Please fill in all fields.");
      return;
    }

    if (Number(rate) <= 0) {
      setFormError("Hourly rate must be greater than 0.");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/stations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: stationName,
            tier: tier,
            rate: Number(rate),
            status: status,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add station.");
      }

      const newStation = await response.json();

      setStations((currentStations) => [
        ...currentStations,
        newStation,
      ]);

      clearForm();
    } catch (error) {
      console.error("Error adding station:", error);
      setFormError("Failed to add station.");
    }
  };

  // ==========================================
  // UPDATE STATION
  // ==========================================
  const handleUpdateStation = async (e) => {
    e.preventDefault();

    if (!stationName || !tier || !rate || !status) {
      setFormError("Please fill in all fields.");
      return;
    }

    if (Number(rate) <= 0) {
      setFormError("Hourly rate must be greater than 0.");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/stations/${editingStation.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: stationName,
            tier: tier,
            rate: Number(rate),
            status: status,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update station.");
      }

      const updatedStation = await response.json();

      setStations((currentStations) =>
        currentStations.map((station) =>
          station.id === updatedStation.id
            ? updatedStation
            : station
        )
      );

      clearForm();
    } catch (error) {
      console.error("Error updating station:", error);
      setFormError("Failed to update station.");
    }
  };

  // ==========================================
  // DELETE STATION
  // ==========================================
  const handleDeleteStation = async (stationId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this station?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/stations/${stationId}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete station.");
      }

      setStations((currentStations) =>
        currentStations.filter(
          (station) => station.id !== stationId
        )
      );
    } catch (error) {
      console.error("Error deleting station:", error);
      alert("Failed to delete station.");
    }
  };

  // ==========================================
  // CLEAR FORM
  // ==========================================
  const clearForm = () => {
    setStationName("");
    setTier("");
    setRate("");
    setStatus("Available");
    setFormError("");
    setShowAddStation(false);
    setEditingStation(null);
  };

  // ==========================================
  // OPEN ADD STATION FORM
  // ==========================================
  const openAddStation = () => {
    setEditingStation(null);
    setStationName("");
    setTier("");
    setRate("");
    setStatus("Available");
    setFormError("");
    setShowAddStation(true);
  };

  // ==========================================
  // OPEN EDIT STATION FORM
  // ==========================================
  const openEditStation = (station) => {
    setEditingStation(station);
    setStationName(station.name);
    setTier(station.tier);
    setRate(station.rate);
    setStatus(station.status);
    setFormError("");
  };

  // ==========================================
  // GET STATUS CLASS
  // ==========================================
  const getStatusClass = (stationStatus) => {
    if (stationStatus === "Available") {
      return "available";
    }

    if (stationStatus === "In Use") {
      return "in-use";
    }

    if (stationStatus === "Maintenance") {
      return "maintenance";
    }

    return "unknown";
  };

  // ==========================================
  // LOGIN PAGE
  // ==========================================
  if (!isLoggedIn) {
    return (
      <div className="login-page">
        <div className="login-card">
          <h1>IT System Management</h1>

          <p className="subtitle">
            Ticket Management System
          </p>

          <form onSubmit={handleLogin}>
            <label htmlFor="username">
              Username
            </label>

            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              placeholder="Enter username"
            />

            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter password"
            />

            {error && (
              <p className="error-message">
                {error}
              </p>
            )}

            <button type="submit">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // ADD / EDIT STATION PAGE
  // ==========================================
  if (showAddStation || editingStation) {
    return (
      <div className="station-page">
        <header className="station-header">
          <div>
            <h1>IT System Management</h1>

            <p>
              Ticket Management System
            </p>
          </div>
        </header>

        <main className="station-content">
          <div className="form-card">
            <h2>
              {editingStation
                ? "Edit Station"
                : "Add Station"}
            </h2>

            <p className="form-description">
              {editingStation
                ? "Update the ticket information."
                : "Add a new ticket ."}
            </p>

            <form
              onSubmit={
                editingStation
                  ? handleUpdateStation
                  : handleAddStation
              }
            >
              {/* STATION NAME */}
              <label htmlFor="stationName">
                 Name 
              </label>

              <input
                id="stationName"
                type="text"
                value={stationName}
                onChange={(e) =>
                  setStationName(e.target.value)
                }
                placeholder="Example: PC-04"
              />

              {/* TIER */}
              <label htmlFor="tier">
                 Category
              </label>

              <select
                id="tier"
                value={tier}
                onChange={(e) =>
                  setTier(e.target.value)
                }
              >
                <option value="">
                  Select a tier
                </option>

                <option value="Regular">
                  Regular
                </option>

                <option value="Premium">
                  Premium
                </option>

                <option value="VIP">
                  VIP
                </option>
              </select>

              {/* STATUS */}
              <label htmlFor="status">
                Status
              </label>

              <select
                id="status"
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
              >
                <option value="Single">
                  Single
                </option>

                <option value="Taken">
                  Taken
                </option>

                <option value="Prefer not to say">
                 Prefer not to say
                </option>
              </select>

              {/* remove time*/}

              {/* ERROR */}
              {formError && (
                <p className="error-message">
                  {formError}
                </p>
              )}

              {/* BUTTONS */}
              <div className="form-buttons">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={clearForm}
                >
                  Cancel
                </button>

                <button type="submit">
                  {editingStation
                    ? "Update "
                    : "Save "}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    );
  }

  // ==========================================
  // STATION LIST PAGE
  // ==========================================
  return (
    <div className="station-page">
      <header className="station-header">
        <div>
          <h1>IT System Management</h1>

          <p>
            Manage tickets
          </p>
        </div>

        <button
          className="logout-button"
          onClick={() => {
            setIsLoggedIn(false);
            setUsername("");
            setPassword("");
          }}
        >
          Logout
        </button>
      </header>

      <main className="station-content">
        <div className="station-title">
          <div>
            <h2>Station List</h2>

            <p>
              serve customers and manage tickets
            </p>
          </div>

          <button
            className="add-button"
            onClick={openAddStation}
          >
            +
          </button>
        </div>

        <div className="station-list">
          {stations.length === 0 ? (
            <p>Not found.</p>
          ) : (
            stations.map((station) => (
              <div
                className="station-card"
                key={station.id}
              >
                <div className="station-info">
                  <h3>{station.name}</h3>

                  <p>
                    Tier: {station.tier}
                  </p>

                  <p>
                    Hourly Rate: ₱{station.rate}
                  </p>

                  {/* STATUS */}
                  <div className="station-status">
                    <span
                      className={`status-dot ${getStatusClass(
                        station.status
                      )}`}
                    ></span>

                    <span
                      className={`status-text ${getStatusClass(
                        station.status
                      )}`}
                    >
                      {station.status}
                    </span>
                  </div>
                </div>

                <div className="station-actions">
                  {/* EDIT */}
                  <button
                    className="details-button"
                    onClick={() =>
                      openEditStation(station)
                    }
                  >
                    Edit
                  </button>

                  {/* DELETE */}
                  <button
                    className="delete-button"
                    onClick={() =>
                      handleDeleteStation(station.id)
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
