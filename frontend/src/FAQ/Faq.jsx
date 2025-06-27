import React, { useState, useEffect } from 'react';
import './Faq.css';
import AdminDashboard from '../AdminDashboard';

const Faq = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState({});
  const [user, setUser] = useState(null);


  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // If user is admin, show AdminDashboard instead of FAQ
  if (user && user.role === 'admin') {
    return <AdminDashboard />;
  }

  // Fetch FAQs from database
  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/faqs');
      if (response.ok) {
        const data = await response.json();
        setFaqs(data);
      } else {
        console.error('Failed to fetch FAQs');
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  const toggleExpand = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (loading) {
    return (
      <div className="faq-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading FAQs...</p>
        </div>
      </div>
    );
  }

 return (
    <div className="faq-container">
      <h1>Frequently Asked Questions</h1>

      {faqs.length === 0 ? (
        <div className="no-faqs">
          <h3>No FAQs available at the moment</h3>
          <p>Please check back later for updates.</p>
        </div>
      ) : (
        
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div key={faq._id} className={`faq-block ${index % 2 === 0 ? 'blue-bg' : 'green-bg'}`}>
              <p className="faq-question">{index + 1}. {faq.question}</p>
              <p className="faq-answer">{faq.answer}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Faq;