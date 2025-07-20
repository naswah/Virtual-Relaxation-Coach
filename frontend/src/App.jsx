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

function App() {

    const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
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
          }
        />


        <Route path="/emotion" element={
          <>
            <Header />
            <Emotion />
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

        <Route path="/login" element={
          <>
            <Header />
            <Login />
            <Footer />
          </>
        } />

      
      </Routes>
    </BrowserRouter>
  );
}

export default App;