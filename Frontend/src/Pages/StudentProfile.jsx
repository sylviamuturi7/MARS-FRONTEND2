import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Imported to handle authenticated session fetch

function StudentProfile() {
  const { id } = useParams(); // Extracts the unique ID integer from the browser URL address line
  const navigate = useNavigate();
  const { fetchWithAuth } = useAuth(); // Extracted securely to pass JWT tokens automatically

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getProfileDetails = async () => {
      try {
        // Leverages your custom middleware wrapper to seamlessly query the authenticated endpoint
        const res = await fetchWithAuth(`/students/${id}`);
        if (res.ok) {
          const data = await res.json();
          setStudent(data);
        } else {
          throw new Error(`Profile query failed with status: ${res.status}`);
        }
      } catch (err) {
        console.error("Failed to extract record profiles:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getProfileDetails();
  }, [id, fetchWithAuth]);

  if (loading)
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
          fontFamily: "sans-serif",
          color: "#64748B",
        }}
      >
        Loading MARS Registry profile workspace...
      </div>
    );

  if (error || !student)
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
          fontFamily: "sans-serif",
          color: "#EF4444",
        }}
      >
        {error ? `Error: ${error}` : "Student profile record not found."}
      </div>
    );

  return (
    <div
      style={{
        padding: "40px",
        backgroundColor: "#F8F7F4",
        minHeight: "100vh",
        fontFamily: "sans-serif",
      }}
    >
      {/* Back Navigation Header */}
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: "20px",
          cursor: "pointer",
          background: "none",
          border: "none",
          color: "#4A5D4E",
          fontWeight: "bold",
        }}
      >
        ← Back to Registry List
      </button>

      {/* Profile Header Block */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            backgroundColor: "#D1C7BD",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "28px",
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          {student.first_name ? student.first_name[0] : ""}
          {student.last_name ? student.last_name[0] : ""}
        </div>
        <div>
          <h1 style={{ margin: 0, color: "#2C3E2D", fontSize: "28px" }}>
            {student.first_name} {student.last_name}
          </h1>
          <p style={{ margin: "4px 0", color: "#7A7A7A" }}>
            Student ID Code: {student.student_code || "N/A"}
          </p>
          <span
            style={{
              backgroundColor: "#EAE6DF",
              color: "#5A6B5D",
              padding: "4px 12px",
              borderRadius: "12px",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            ACTIVE
          </span>
        </div>
      </div>

      {/* Split Columns Grid System */}
      <div
        style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "30px" }}
      >
        {/* Left Side: Detail Forms Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Edit Profile Inputs Box */}
          <div
            style={{
              backgroundColor: "#FFF",
              padding: "30px",
              borderRadius: "16px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
            }}
          >
            <h3 style={{ margin: "0 0 20px 0", color: "#2C3E2D" }}>
              👤 Edit Profile Details
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
                marginBottom: "15px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "13px",
                    fontWeight: "bold",
                    color: "#555",
                  }}
                >
                  First Name
                </label>
                <input
                  type="text"
                  defaultValue={student.first_name}
                  disabled
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #E2E8F0",
                    backgroundColor: "#F8FAFC",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "13px",
                    fontWeight: "bold",
                    color: "#555",
                  }}
                >
                  Last Name
                </label>
                <input
                  type="text"
                  defaultValue={student.last_name}
                  disabled
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #E2E8F0",
                    backgroundColor: "#F8FAFC",
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontSize: "13px",
                  fontWeight: "bold",
                  color: "#555",
                }}
              >
                Email Address
              </label>
              <input
                type="email"
                defaultValue={student.email}
                disabled
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #E2E8F0",
                  backgroundColor: "#F8FAFC",
                }}
              />
            </div>
          </div>

          {/* Device Information Module */}
          <div
            style={{
              backgroundColor: "#FFF",
              padding: "30px",
              borderRadius: "16px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
            }}
          >
            <h3 style={{ margin: "0 0 20px 0", color: "#2C3E2D" }}>
              💻 Hardware Device Information
            </h3>
            {student.devices && student.devices.length > 0 ? (
              student.devices.map((device, index) => (
                <div
                  key={index}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "20px",
                    marginBottom: "10px",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "6px",
                        fontSize: "13px",
                        fontWeight: "bold",
                        color: "#555",
                      }}
                    >
                      Device Tag / Name
                    </label>
                    <input
                      type="text"
                      defaultValue={device.device_name || "Generic Device"}
                      disabled
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #E2E8F0",
                        backgroundColor: "#F8FAFC",
                      }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "6px",
                        fontSize: "13px",
                        fontWeight: "bold",
                        color: "#555",
                      }}
                    >
                      MAC Address Identity
                    </label>
                    <input
                      type="text"
                      defaultValue={device.mac_address}
                      disabled
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #E2E8F0",
                        backgroundColor: "#F8FAFC",
                        fontFamily: "monospace",
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: "#A0AEC0", margin: 0, fontSize: "14px" }}>
                No authorized hardware devices registered to this student node
                account.
              </p>
            )}
          </div>
        </div>

        {/* Right Side: Status Metrics Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Registry Verification Box */}
          <div
            style={{
              backgroundColor: "#D9C39E",
              padding: "24px",
              borderRadius: "16px",
              color: "#4A3B2C",
            }}
          >
            <h4 style={{ margin: "0 0 10px 0", fontSize: "16px" }}>
              Registry Status Summary
            </h4>
            <p
              style={{
                fontSize: "13px",
                margin: "0 0 15px 0",
                lineHeight: "1.4",
              }}
            >
              Profile parameters are synchronized. Mandatory logging keys must
              be maintained continuously for session validation tracking.
            </p>
            <div
              style={{
                fontSize: "12px",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              ✓ VERIFIED NETWORK IDENTITY
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;
