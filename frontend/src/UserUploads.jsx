import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";

const UserUploads = () => {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchUploads = async () => {
      if (!user || !user._id) {
        setError("Please log in to view your uploads.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`http://localhost:5000/my-uploads/${user._id}`);
        setUploads(res.data);
      } catch (err) {
        console.error("Error fetching uploads:", err);
        setError("Failed to fetch your uploads. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUploads();
  }, [user]);

  if (!user) {
    return (
      <>
        <Header />
        <div style={{ padding: "2rem", textAlign: "center", minHeight: "60vh" }}>
          <h2>Access Denied</h2>
          <p>Please log in to view your uploads.</p>
          <a href="/login" style={{ color: "#007bff", textDecoration: "underline" }}>
            Go to Login
          </a>
        </div>
        <Footer />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Header />
        <div style={{ padding: "2rem", textAlign: "center", minHeight: "60vh" }}>
          <p>Loading your uploads...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div style={{ padding: "2rem", textAlign: "center", minHeight: "60vh" }}>
          <p style={{ color: "red" }}>{error}</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div style={{ padding: "2rem", minHeight: "60vh" }}>
        <h2 style={{ textAlign: "center", marginBottom: "2rem", color: "#333" }}>
          Your Emotion Detection History
        </h2>

        {uploads.length === 0 ? (
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "1.1rem", color: "#666" }}>No uploads found.</p>
            <p style={{ color: "#999", marginTop: "0.5rem" }}>
              Upload some photos in the emotion detection section to see them here!
            </p>
            <a 
              href="/emotion" 
              style={{ 
                display: "inline-block",
                marginTop: "1rem",
                padding: "0.5rem 1rem",
                backgroundColor: "#007bff",
                color: "white",
                textDecoration: "none",
                borderRadius: "5px"
              }}
            >
              Detect Emotions
            </a>
          </div>
        ) : (
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", 
            gap: "1.5rem" 
          }}>
            {uploads.map((upload, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  overflow: "hidden",
                  backgroundColor: "white",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  transition: "transform 0.2s, box-shadow 0.2s"
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                }}
              >
                <div style={{ position: "relative" }}>
                  <img
                    src={`http://localhost:5000${upload.imageUrl}`}
                    alt={`Upload showing ${upload.emotion}`}
                    style={{ 
                      width: "100%", 
                      height: "200px", 
                      objectFit: "cover" 
                    }}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <div 
                    style={{ 
                      display: "none",
                      width: "100%", 
                      height: "200px", 
                      backgroundColor: "#f8f9fa",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "#6c757d"
                    }}
                  >
                    Failed to load image
                  </div>
                  <div style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    backgroundColor: "#007bff",
                    color: "white",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "0.85rem",
                    fontWeight: "bold",
                    textTransform: "capitalize"
                  }}>
                    {upload.emotion}
                  </div>
                </div>
                <div style={{ padding: "1rem" }}>
                  <p style={{ 
                    textAlign: "center", 
                    margin: "0",
                    fontWeight: "500",
                    color: "#333"
                  }}>
                    Detected Emotion: <span style={{ 
                      color: "#007bff", 
                      textTransform: "capitalize",
                      fontWeight: "bold"
                    }}>
                      {upload.emotion}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default UserUploads;