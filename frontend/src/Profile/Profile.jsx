import { useEffect, useState } from "react";
import "./Profile.css";

function Profile() {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (storedUser) {
      setFormData({
        name: storedUser.name,
        email: storedUser.email,
        phone: storedUser.phone
      });
    }
  }, [storedUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/users/${storedUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Profile updated successfully!");
        localStorage.setItem("user", JSON.stringify(data)); // update local storage
        window.dispatchEvent(new Event("userLogin")); // trigger update in App/Header
      } else {
        setMessage(data.message || "Error updating profile");
      }
    } catch (err) {
      setMessage("Server error");
    }
  };

  return (
    <div className="profile-container">
      <h2>My Profile</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </label>
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange}/>
        </label>
        <label>
          Phone:
          <input type="text" name="phone" value={formData.phone} onChange={handleChange}/>
        </label>
        <button type="submit">Save Changes</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Profile;
