import './Register.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = form;
    if (!email || !password) {
      alert("Both fields are required");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok && data.user) {
        // Save complete user info INCLUDING _id
        const userInfo = {
          _id: data.user._id,
          email: data.user.email,
          name: data.user.name,
          role: data.user.role,
          phone: data.user.phone,
        };

        localStorage.setItem("user", JSON.stringify(userInfo));

        // Trigger custom event so App.jsx updates user state
        window.dispatchEvent(new CustomEvent('userLogin'));

        alert(data.message || "Login successful");

        // Small delay to ensure state update, then redirect
        setTimeout(() => {
          if (data.user.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/profile");
          }
        }, 100);

      } else {
        alert(data.message || "Invalid email or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <>
      <h2>Login</h2>
      <div className="container">
        <div className="box form-box">
          <form onSubmit={handleSubmit}>
            <div className="field input">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field input">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <input type="submit" className="btn" value="Login" />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;