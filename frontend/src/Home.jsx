import Footer from './Footer';
import Header from './Header';
import Slider from './Slider/Slider.jsx';
import About from './About/About.jsx';
import HomeCard from './Components/HomeCard.jsx';

function Home() {
  return (
    <>
      <Header />
      <Slider />
      <About />
      <HomeCard />
      <Footer />
    </>
  );
}

export default Home;
