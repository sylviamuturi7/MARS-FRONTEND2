import React, { useState } from "react";
import apiClient from "../api/client";

const TestConnection = () => {
  const [message, setMessage] = useState("Waiting...");

  const handleTest = async () => {
    try {
      const response = await apiClient.get("/test-link");
      setMessage("Success: " + response.data.message);
    } catch (error) {
      setMessage("Error: Check console.");
    }
  };

  return (
    <div style={{ padding: "50px" }}>
      <button onClick={handleTest}>Ping Backend</button>
      <p>{message}</p>
    </div>
  );
};

export default TestConnection;
