import { useState, useEffect } from "react";
import './AddRecommendation.css';

function AddRecommendation() {
  const [form, setForm] = useState({
    pose_name: "",
    type: "yoga",
    emotion: "happy",
    description: "",
    pose_picture: "",
    youtube_link: "",
    locked: false
  });

  const [poses, setPoses] = useState([]);

  const fetchPoses = async () => {
    try {
      const res = await fetch("http://localhost:5000/yoga/all");
      const data = await res.json();
      console.log("Fetched poses:", data);
      setPoses(data);
    } catch (err) {
      console.error("Failed to fetch poses", err);
    }
  };

  useEffect(() => {
    fetchPoses();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/yoga/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const msg = await res.text();
      alert(msg);
      setForm({
        pose_name: "",
        type: "yoga",
        emotion: "happy",
        description: "",
        pose_picture: "",
        youtube_link: "",
        locked: false
      });
      fetchPoses();
    } catch (err) {
      alert("Error adding pose");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this pose?")) return;

    try {
      const res = await fetch(`http://localhost:5000/yoga/delete/${id}`, {
        method: "DELETE"
      });
      const msg = await res.text();
      alert(msg);
      fetchPoses();
    } catch (err) {
      alert("Error deleting pose");
    }
  };

  return (
    <div className="add-recommendation">
      <h2 className="add-recommendation__title">Add Yoga/Facial Pose (Admin)</h2>

      <form onSubmit={handleSubmit} className="add-recommendation__form">
        <div className="form-group">
          <label>Name:</label>
          <input type="text" name="pose_name" value={form.pose_name} onChange={handleChange} required/>
        </div>

        <div className="form-group">
          <label>Type:</label>
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="yoga">Yoga</option>
            <option value="facialexpression">Facial</option>
          </select>
        </div>

        <div className="form-group">
          <label>Emotion:</label>
          <select name="emotion" value={form.emotion} onChange={handleChange}>
            <option value="happy">Happy</option>
            <option value="sad">Sad</option>
            <option value="angry">Angry</option>
            <option value="neutral">Neutral</option>
            <option value="fear">Fear</option>
            <option value="surprise">Surprise</option>
          </select>
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description" value={form.description} onChange={handleChange} required
          />
        </div>

        <div className="form-group">
          <label>Image URL:</label>
          <input type="text" name="pose_picture" value={form.pose_picture} onChange={handleChange} required />
        </div>

        <div className="form-group checkbox-group">
          <label>Locked:</label>
          <input type="checkbox" name="locked" checked={form.locked} onChange={handleChange}/>
        </div>

        <div className="form-group">
          <label>YouTube Link:</label>
          <input type="text" name="youtube_link" value={form.youtube_link} onChange={handleChange}/>
        </div>

        <div className="form-group">
          <button type="submit" className="btn-submit">Add Pose</button>
        </div>
      </form>

      <h3 className="add-recommendation__subtitle">Existing Poses</h3>

      <div className="pose-list">
        {poses.length === 0 ? (
          <p>No poses found.</p>
        ) : (
          poses.map((pose) => (
            <div key={pose._id} className="pose-card">
              <h3>{pose.pose_name}</h3>
              <p>{pose.description}</p>
              <img src={pose.pose_picture} alt={pose.pose_name} />

              {!pose.locked && (
                <button onClick={() => handleDelete(pose._id)}>Delete</button>
              )}

              {pose.locked && <p style={{ color: "red" }}>Locked</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AddRecommendation;