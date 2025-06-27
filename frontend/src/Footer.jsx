import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-left">
        <img src="images/logo.png" alt="Logo" />
      </div>

      <div className="footer-center">
        <Link to="/">Home</Link>
        <Link to="/faq">FAQs</Link>
        <Link to="/upload">Upload Images</Link>
        <Link to="/profile">Profile</Link>
      </div>

      <div className="footer-right">
        <p>Info: Used solely for<br />educational purpose only.</p>
        <p>&copy; {new Date().getFullYear()} Virtual Relaxation Coach</p>
      </div>
    </footer>
  );
}

export default Footer;
