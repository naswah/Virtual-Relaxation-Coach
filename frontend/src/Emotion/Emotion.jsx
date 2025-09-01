import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { detectEmotion } from "../services/emotionService";
import Recommendation from "./Recommendation";
import "./Emotion.css";

const QUESTIONS = [
  "How do you feel about your energy right now?",
  "What emotion most describes your current thoughts?",
  "Which emotion affected you most today?",
  "What was your emotion an hour ago?"
];

const OPTIONS = ["happy", "sad", "angry", "neutral", "surprise", "fear"];

function Emotion() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [mode, setMode] = useState(null); // "camera", "image", "questions"
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [aiEmotion, setAiEmotion] = useState("");
  const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(""));
  const [recs, setRecs] = useState(null);

  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);

  // Automatically open file picker when mode is "image"
  useEffect(() => {
    if (mode === "image" && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [mode]);

  // Capture webcam photo
  const capturePhoto = async () => {
    const screenshot = webcamRef.current.getScreenshot();
    if (!screenshot) return;

    setImage(screenshot);

    const byteString = atob(screenshot.split(",")[1]);
    const mimeString = screenshot.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
    const blob = new Blob([ab], { type: mimeString });
    const capturedFile = new File([blob], "capture.jpg", { type: mimeString });

    setFile(capturedFile);

    const emotion = await detectEmotion(capturedFile);
    setAiEmotion(emotion);

    if (user?._id) {
      const formData = new FormData();
      formData.append("image", capturedFile);
      formData.append("emotion", emotion);
      try {
        await axios.post(`http://localhost:5000/upload/${user._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } catch (err) {
        console.error("Upload failed:", err.response?.data || err.message);
      }
    }
  };

  // Handle uploaded image
  const handleImageUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setImage(URL.createObjectURL(selectedFile));
    setFile(selectedFile);

    const emotion = await detectEmotion(selectedFile);
    setAiEmotion(emotion);

    if (user?._id) {
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("emotion", emotion);
      try {
        await axios.post(`http://localhost:5000/upload/${user._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } catch (err) {
        console.error("Upload failed:", err.response?.data || err.message);
      }
    }
  };

  // Update answer for questions
  const updateAnswer = (idx, val) => {
    const next = [...answers];
    next[idx] = val;
    setAnswers(next);
  };

  // Submit for recommendations
  const submit = async () => {
    if (mode === "questions" && answers.some(a => a === "")) {
      return alert("You must answer all questions for recommendations!");
    }

    try {
      const res = await fetch("http://localhost:5000/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aiEmotion: mode === "image" || mode === "camera" ? aiEmotion : null,
          answers: mode === "questions" ? answers : []
        })
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

      {!mode && (
        <div style={{ marginBottom: "1rem" }}>
          <button onClick={() => setMode("image")}>Upload Photo</button>
          <button onClick={() => setMode("camera")} style={{ marginLeft: "1rem" }}>
            Capture with Camera
          </button>
          <button onClick={() => setMode("questions")} style={{ marginLeft: "1rem" }}>
            Through Questions
          </button>
        </div>
      )}

      {/* IMAGE UPLOAD MODE */}
      {mode === "image" && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
          {image && <img src={image} width="200" alt="Uploaded Preview" />}
          {aiEmotion && <h3>Detected Emotion: {aiEmotion}</h3>}
          {aiEmotion && (
            <button onClick={submit} style={{ marginTop: "1rem" }}>
              Get Recommendations
            </button>
          )}
        </>
      )}

      {/* CAMERA MODE */}
      {mode === "camera" && (
        <>
          {!image ? (
            <>
              <Webcam ref={webcamRef} screenshotFormat="image/jpeg" width={320} height={240} />
              <button onClick={capturePhoto} style={{ marginTop: "1rem" }}>
                Capture Photo
              </button>
            </>
          ) : (
            <>
              <img src={image} width="200" alt="Captured Preview" />
              {aiEmotion && <h3>Detected Emotion: {aiEmotion}</h3>}
              {aiEmotion && (
                <button onClick={submit} style={{ marginTop: "1rem" }}>
                  Get Recommendations
                </button>
              )}
            </>
          )}
        </>
      )}

      {/* QUESTIONS MODE */}
      {mode === "questions" && (
        <>
          {QUESTIONS.map((question, index) => (
            <div key={index} style={{ marginTop: "1rem" }}>
              <p>{question}</p>
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
          <button onClick={submit} style={{ marginTop: "1rem" }}>
            Get Recommendations
          </button>
        </>
      )}

      {recs && <Recommendation recs={recs} />}
    </div>
  );
}

export default Emotion;