import { Link } from 'react-router-dom';

function Footer(){
  return(
    <footer>
      <p><img src="images/logo.png" alt="no img"/></p>
      <Link to="/">Home</Link>
      <Link to="/faq">FAQs</Link>
      <Link to="/emotion">Emotion Detection</Link>
      <Link to="/profile">Profile</Link>
      <br />
      <p>&copy; {new Date().getFullYear()} Virtual Relaxation Coach</p>
    </footer>
  );
}
export default Footer;
