import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Faq({ isAdmin }) {
  const [faqs, setFaqs] = useState([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/faqs')
      .then(response => setFaqs(response.data))
      .catch(error => console.error("Error fetching FAQs:", error));
  }, []);

  const handleAddFaq = async () => {
    if (!question || !answer) return alert("Please fill both fields");
    try {
      const res = await axios.post('http://localhost:5000/api/faqs', { question, answer });
      setFaqs([...faqs, res.data]);
      setQuestion('');
      setAnswer('');
    } catch (err) {
      console.error("Failed to add FAQ:", err);
    }
  };

  const handleDeleteFaq = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/faqs/${id}`);
      setFaqs(faqs.filter(faq => faq._id !== id));
    } catch (err) {
      console.error("Failed to delete FAQ:", err);
    }
  };

  return (
    <>
      <div style={{ padding: '20px' }}>
        <h1>Frequently Asked Questions</h1>

        {faqs.length === 0 ? (
          <p>No FAQs available.</p>
        ) : (
          <ul>
            {faqs.map((faq) => (
              <li key={faq._id} style={{ marginBottom: '15px' }}>
                <strong>Q:</strong> {faq.question}<br />
                <strong>A:</strong> {faq.answer}
                {isAdmin && (
                  <button onClick={() => handleDeleteFaq(faq._id)} style={{ marginLeft: '10px', color: 'red' }}>
                    Delete
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}

        {isAdmin && (
          <div style={{ marginTop: '30px' }}>
            <h3>Add New FAQ</h3>
            <input
              type="text"
              placeholder="Question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              style={{ display: 'block', marginBottom: '10px' }}
            />
            <input
              type="text"
              placeholder="Answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              style={{ display: 'block', marginBottom: '10px' }}
            />
            <button onClick={handleAddFaq}>Add FAQ</button>
          </div>
        )}
      </div>
    </>
  );
}

export default Faq;