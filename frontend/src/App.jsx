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
        {/* Home page without layout */}
        <Route path="/" element={<Home />} />

        {/* FAQ Page */}
        <Route path="/faq" element={
          <>
            <Header />
            <Faq isAdmin={true} /> {/* Or set this based on login */}
            <Footer />
          </>
        } />

        {/* Emotion Detection */}
        <Route path="/emotion" element={
          <>
            <Header />
            <Emotion />
            <Footer />
          </>
        } />

        {/* User Profile */}
        <Route path="/profile" element={
          <>
            <Header />
            <Profile />
            <Footer />
          </>
        } />

        {/* Registration Page */}
        <Route path="/register" element={
          <>
            <Header />
            <Register />
            <Footer />
          </>
        } />

        {/* Login Page */}
        <Route path="/login" element={
          <>
            <Header />
            <Login />
            <Footer />
          </>
        } />

        {/* Admin Dashboard (only for admins) */}
        <Route path="/admin" element={
          <>
            <Header />
            <AdminDashboard />
            <Footer />
          </>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;