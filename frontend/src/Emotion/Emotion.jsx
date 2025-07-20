import "./Emotion.css";
import { useState } from "react";
import { detectEmotion } from "../services/emotionService";
import Recommendation from "./Recommendation";

const QUESTIONS = [
  "How do you feel about your energy right now?",
  "What emotion most describes your current thoughts?",
  "Which emotion affected you most today?",
  "What do you want ot feel?"
];
const OPTIONS = ["happy", "sad", "angry", "neutral", "surprise"];

function Emotion() {
  const [image, setImage]         = useState(null);
  const [aiEmotion, setAiEmotion] = useState("");
  const [answers, setAnswers]     = useState(Array(4).fill(""));
  const [recs, setRecs]           = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]; //suru ma user le select gareko file matra line
    if (!file) return; // if user cnacels, return

    setImage(URL.createObjectURL(file)); // user le select gareko image preview garna

    // stubbed model call
    const emotion = await detectEmotion(file);
    setAiEmotion(emotion);
  };

  const updateAnswer= (idx, val) =>{
    const next = [...answers]; //creating new array by copying the previous values
    next[idx]= val;
    setAnswers(next);
  };

  const submit = async() =>{
    if(answers.some(a => a === ""))
      return alert("You must answer the questions for recommendations!")

    const res = await fetch("http://localhost:5000/recommend", {
      method: "POST",
      headers:  { "Content-Type": "application/json" },
      body: JSON.stringify({ aiEmotion: aiEmotion || answers[0], answers }) 
    })

    const data = await res.json();
    setRecs(data.recommendations);
  };

  return(
    <div className= "Emotion">
      <h1>Detect your emotion</h1>

      {!image && ( //show only if image choose gareko chaina, if image is choosen, dont show it 
      <>

        <label htmlFor="fileUpload" className="file-label"> Choose an image </label>
        <input id="fileUpload" type="file" accept="image/*" onChange={handleImageUpload} className="file-input"/> 

      </>
      )}

      {image && <img src= {image} width="200"></img>}
      {aiEmotion && <h3>Detected Emotion: {aiEmotion}</h3>}

      {aiEmotion && QUESTIONS.map((question,index) => (
        
        <div key={index} style={{ display: "flex", alignItems: "center" }}>

          <p>{question}</p>
          {OPTIONS.map(option => (
            <label key={option}style={{ marginRight: "1rem"}}>
              <input type="radio" name={`question-${index}`} value={option} onChange={() => updateAnswer(index, option)} />
              {option}
            </label>
    ))}
  </div>
      ))}

      {aiEmotion &&
        <button onClick={submit} style={{ marginBottom: "1rem", marginTop:"1rem" }}> Get Recommendations </button>
      }

      {recs && <Recommendation recs={recs} />}

    </div>
  );

}

export default Emotion;