import React from 'react';
import './HomeCard.css';
import { Link } from 'react-router-dom';

const cards = [
  {
    title: 'DETECT YOUR EMOTION',
    image: 'images/emotion.jpg',
    link: '/emotion',
  },
  {
    title: 'FAQs',
    image: 'images/FAQ.jpg',
    link: '/Faq',
  },
  {
    title: 'ABOUT VIRTUAL RELAXATION COACH',
    image: 'images/about.jpg',
    link: '/',
  },
];

function HomeCards() {
  return (
    <div className="card-container">
      {cards.map((card, index) => (
        <Link to={card.link} className="card" key={index}>
          <img src={card.image} alt={card.title} />
          <div className="card-title">{card.title}</div>
        </Link>
      ))}
    </div>
  );
}

export default HomeCards;