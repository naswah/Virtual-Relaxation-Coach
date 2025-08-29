import React from 'react';
import './HomeCard.css';
import { Link } from 'react-router-dom';

function HomeCards() {
  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === 'admin';

  // Dynamic cards based on user role
  const cards = [
    {
      title: isAdmin ? 'ADD RECOMMENDATIONS' : 'DETECT YOUR EMOTION',
      image: 'images/emotion.jpg',
      link: isAdmin ? '/admin' : '/emotion',
    },
    {
      title: 'FAQs',
      image: 'images/FAQ.jpg',
      link: isAdmin ? '/admin' : '/faq',
    },
    {
      title: 'ABOUT VRC',
      image: 'images/about.jpg',
      link: '#section1',
    },
    {
      title: 'View Uploaded Pictures',
      image: 'images/gallery.jpg',
      link: '/uploads',
      hidden: isAdmin
    },
  ];

  return (
    <div className="card-container">
     {cards
  .filter(card => !card.hidden)
  .map((card, index) => (
    card.link.startsWith('#') ? (
      <a href={card.link} className="card" key={index}>
        <img src={card.image} alt={card.title} />
        <div className="card-title">{card.title}</div>
      </a>
    ) : (
      <Link to={card.link} className="card" key={index}>
        <img src={card.image} alt={card.title} />
        <div className="card-title">{card.title}</div>
      </Link>
    )
  ))
}

    </div>
  );
}

export default HomeCards; 
// homecard