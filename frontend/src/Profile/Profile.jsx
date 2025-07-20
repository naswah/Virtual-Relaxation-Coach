import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import './Profile.css';

function Profile() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user"); 
    setIsLoggedIn(!!user); // Convert to boolean
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user"); 
    setIsLoggedIn(false);            
    navigate("/login");              

    window.location.reload();
  };

  return (
    <div className="ProfilePage">
      <h2>Welcome to VRC</h2>

      <button className="buttonn" onClick={() => navigate("/register")}>
        Register
      </button>

      {isLoggedIn ? (
        <button className="buttonn" onClick={handleLogout}>
          Logout
        </button>
      ) : (
        <button className="buttonn" onClick={() => navigate("/login")}>
          Login
        </button>
      )}
    </div>
  );
}

export default Profile;