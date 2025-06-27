import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
  path="/faq"
  element={
    (() => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.role === "admin") {
        return (
          <>
            <Header />
            <AdminDashboard />
            <Footer />
          </>
        );
      } else {
        return (
          <>
            <Header />
            <Faq />
            <Footer />
          </>
        );
      }
    })()
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