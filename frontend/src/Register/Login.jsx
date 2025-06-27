import './Register.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = form;
    if (!email || !password) return alert("Both fields are required");

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok && data.user) {
         localStorage.setItem("user", JSON.stringify({
          email: data.user.email,
          name: data.user.name,
          role: data.user.role,
          phone: data.user.phone
        }));

        alert(data.message || "Login successful");

        if (data.user.role === 'admin') {
          navigate("/profile");
        } else {
          navigate("/profile");
        }
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      alert("Login failed");
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
              <input type="email" name="email" onChange={handleChange} value={form.email} />
            </div>

            <div className="field input">
              <label htmlFor="password">Password:</label>
              <input type="password" name="password" onChange={handleChange} value={form.password} />
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