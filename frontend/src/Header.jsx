import { Link } from 'react-router-dom';

function Header(){
  return(
  
    <header>
      <div className="nav">
        <div className="logo">
          <img src="images/logo.png" alt="no img" />
        </div>
        <div className="aclass">
          <Link to="/">Home</Link>
          <Link to="/Faq">FAQs</Link>
          <Link to="/emotion">Emotion Detection</Link>
          <Link to="/profile">Profile</Link>
        </div>
      </div>
    </header>

  );
}
export default Header;