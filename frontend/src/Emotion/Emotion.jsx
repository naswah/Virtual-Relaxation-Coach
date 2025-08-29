// Emotion.jsx
import "./Emotion.css";
import { useState } from "react";
import axios from "axios";
import { detectEmotion } from "../services/emotionService";
import Recommendation from "./Recommendation";

const QUESTIONS = [
  "How do you feel about your energy right now?",
  "What emotion most describes your current thoughts?",
  "Which emotion affected you most today?",
  "What do you want to feel?"
];

const OPTIONS = ["happy", "sad", "angry", "neutral", "surprise"];

function Emotion() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [aiEmotion, setAiEmotion] = useState("");
  const [answers, setAnswers] = useState(Array(4).fill(""));
  const [recs, setRecs] = useState(null);

    const fetchImage = async (userId, index) => {
    try {
      const res = await axios.get(`http://localhost:5000/image/${userId}/${index}`, {
        responseType: "blob" // important for binary data
      });
      const url = URL.createObjectURL(res.data);
      setImage(url);
    } catch (err) {
      console.error("Error fetching image:", err);
    }
  };

  const updateAnswer = (idx, val) => {
    const next = [...answers];
    next[idx] = val;
    setAnswers(next);
  };

  const handleImageUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setImage(URL.createObjectURL(selectedFile));
    setFile(selectedFile);

    // Detect emotion first
    const emotion = await detectEmotion(selectedFile);
    setAiEmotion(emotion);
    console.log("Detected emotion:", emotion);

    // Upload to backend
    if (user?._id) {
      const formData = new FormData();
      formData.append("image", selectedFile); // key must match Multer
      formData.append("emotion", emotion);

      try {
        const res = await axios.post(
          `http://localhost:5000/upload/${user._id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" }
          }
        );
        console.log("Upload successful:", res.data);
      } catch (err) {
        console.error("Upload failed:", err.response?.data || err.message);
      }
    }
  };

  const submit = async () => {
    if (answers.some(a => a === "")) {
      return alert("You must answer all questions for recommendations!");
    }

    try {
      const res = await fetch("http://localhost:5000/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aiEmotion: aiEmotion || answers[0], answers })
      });

      const data = await res.json();
      setRecs(data.recommendations);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
    }
  };

  return (
    <div className="Emotion">
      <h1>Detect your emotion</h1>

      {!image && (
        <>
          <label htmlFor="fileUpload" className="file-label">
            Choose an image
          </label>
          <input
            id="fileUpload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="file-input"
          />
        </>
      )}

      {image && <img src={image} width="200" alt="Uploaded Preview" />}
      {aiEmotion && <h3>Detected Emotion: {aiEmotion}</h3>}

      {aiEmotion && QUESTIONS.map((question, index) => (
        <div key={index} style={{ display: "flex", alignItems: "center", marginTop: "0.5rem" }}>
          <p style={{ marginRight: "1rem" }}>{question}</p>
          {OPTIONS.map(option => (
            <label key={option} style={{ marginRight: "1rem" }}>
              <input
                type="radio"
                name={`question-${index}`}
                value={option}
                onChange={() => updateAnswer(index, option)}
              />
              {option}
            </label>
          ))}
        </div>
      ))}

      {aiEmotion && (
        <button
          onClick={submit}
          style={{ marginTop: "1rem", marginBottom: "1rem" }}
        >
          Get Recommendations
        </button>
      )}

      {recs && <Recommendation recs={recs} />}
    </div>
  );
}

export default Emotion;