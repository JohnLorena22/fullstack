
import { useEffect, useState } from "react";
import { apiRequest } from "./services/api";
import "./App.css";

function App() {
  const [message, setMessage] = useState("Connecting...");
  const [error, setError] = useState("");

  useEffect(() => {
    async function checkBackend() {
      try {
        const data = await apiRequest("/health");
        setMessage(data.message);
      } catch (err) {
        setError(err.message);
        setMessage("");
      }
    }

    checkBackend();
  }, []);

  return (
    <main className="app">
      <h1>Fullstack Boilerplate</h1>
      <p>React Frontend + Laravel Backend</p>

      <section className="status-card">
        <h2>Backend Connection</h2>

        {error ? (
          <p className="error">Connection failed: {error}</p>
        ) : (
          <p className="success">{message}</p>
        )}
      </section>
    </main>
  );
}

export default App;
