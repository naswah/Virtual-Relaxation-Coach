import React, { useState } from 'react';
import './Slider.css';

const images = [
  'images/yoga2.jpg',
  'images/yoga3.jpg',
  'images/yogaa.jpg',
  'images/YOGA4.jpg',
];

function Slider() {
  const [index, setIndex] = useState(0);

  const goNext = () => {
    setIndex((index + 1) % images.length);
  };

  const goPrev = () => {
    setIndex(index === 0 ? images.length - 1 : index - 1);
  };

  return (
    <div className="slider-container">
      <img src={images[index]} alt="Slide" className="slider-image" />

      <button className="nav-button prev" onClick={goPrev}>
        &#10094;
      </button>

      <button className="nav-button next" onClick={goNext}>
        &#10095;
      </button>

    </div>
  );
}

export default Slider;