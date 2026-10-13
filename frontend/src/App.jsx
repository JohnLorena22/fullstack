import { useEffect, useState } from "react";
import { apiRequest } from "./services/api";

function App() {
  const [message, setMessage] = useState("Connecting...");
  const [error, setError] = useState("");

  useEffect(() => {
    async function testConnection() {
      try {
        const data = await apiRequest("/health");
        setMessage(JSON.stringify(data, null, 2));
      } catch (err) {
        setError(err.message);
      }
    }

    testConnection();
  }, []);

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>Fullstack Boilerplate</h1>
      <h2>React + Laravel Connection Test</h2>

      {error ? (
        <p style={{ color: "red" }}>
          Connection failed: {error}
        </p>
      ) : (
        <pre>{message}</pre>
      )}
    </div>
  );
}

export default App;