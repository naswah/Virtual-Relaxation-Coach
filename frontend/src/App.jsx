import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Home from './Home';
import Faq from './FAQ/Faq';
import Emotion from './Emotion/Emotion';
import Header from './Header';
import Footer from './Footer';
import Profile from './Profile/Profile';
import Register from "./Register/Register";
import Login from "./Register/Login";
import AdminDashboard from './AdminDashboard';
import AddRecommendation from './Emotion/AddRecommendation';
import UserUploads from "./UserUploads";

function App() {
  const [user, setUser] = useState(null);

  // Function to update user state
  const updateUser = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    updateUser();

    // Listen for storage changes (when user logs in/out)
    const handleStorageChange = () => {
      updateUser();
    };

    window.addEventListener('storage', handleStorageChange);

    // Also listen for custom event when login happens in same tab
    window.addEventListener('userLogin', updateUser);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userLogin', updateUser);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/faq" element={
          <>
            <Header />
            {user?.role === "admin" ? <AdminDashboard /> : <Faq />}
            <Footer />
          </>
        } />

        <Route path="/emotion" element={
          <>
            <Header />
            {user?.role === "admin" ? <AddRecommendation /> : <Emotion />}
            <Footer />
          </>
        } />

        <Route path="/admin" element={
          <>
            <Header />
            <AdminDashboard />
            <Footer />
          </>
        } />

        <Route path="/profile" element={
          <>
            <Header />
            <Profile />
            <Footer />
          </>
        } />

        <Route path="/register" element={
          <>
            <Header />
            <Register />
            <Footer />
          </>
        } />

        <Route path="/uploads" element={<UserUploads />} />

        <Route path="/login" element={
          <>
            <Header />
            <Login setUser={setUser} />
            <Footer />
          </>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;