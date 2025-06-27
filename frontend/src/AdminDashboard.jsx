import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('faqs');
  const [faqs, setFaqs] = useState([]);
  const [users, setUsers] = useState([]);
  const [newFAQ, setNewFAQ] = useState({ question: '', answer: '' });
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Check if user is admin
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Redirect if not admin
      if (parsedUser.role !== 'admin') {
        alert('Access denied. Admin privileges required.');
        window.location.href = '/';
        return;
      }
    } else {
      alert('Please login first.');
      window.location.href = '/login';
      return;
    }
  }, []);

  // Fetch FAQs
  const fetchFAQs = async () => {
    try {
      const response = await fetch('http://localhost:5000/faqs');
      const data = await response.json();
      setFaqs(data);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    }
  };

  // Fetch Users
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Add new FAQ
  const handleAddFAQ = async (e) => {
    e.preventDefault();
    if (!newFAQ.question.trim() || !newFAQ.answer.trim()) {
      alert('Please fill in both question and answer');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/faqs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newFAQ),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || 'FAQ added successfully!');
        setNewFAQ({ question: '', answer: '' });
        fetchFAQs(); // Refresh FAQ list
      } else {
        alert(data.message || 'Error adding FAQ');
      }
    } catch (error) {
      console.error('Error adding FAQ:', error);
      alert('Error adding FAQ');
    }
    setLoading(false);
  };

  // Delete FAQ
  const handleDeleteFAQ = async (id) => {
    if (window.confirm('Are you sure you want to delete this FAQ?')) {
      try {
        const response = await fetch(`http://localhost:5000/faqs/${id}`, {
          method: 'DELETE',
        });

        const data = await response.json();

        if (response.ok) {
          alert(data.message || 'FAQ deleted successfully!');
          fetchFAQs(); // Refresh FAQ list
        } else {
          alert(data.message || 'Error deleting FAQ');
        }
      } catch (error) {
        console.error('Error deleting FAQ:', error);
        alert('Error deleting FAQ');
      }
    }
  };

  // Delete User
  const handleDeleteUser = async (id, userEmail) => {
    if (window.confirm(`Are you sure you want to delete user: ${userEmail}?`)) {
      try {
        const response = await fetch(`http://localhost:5000/users/${id}`, {
          method: 'DELETE',
        });

        const data = await response.json();

        if (response.ok) {
          alert(data.message || 'User deleted successfully!');
          fetchUsers(); // Refresh user list
        } else {
          alert(data.message || 'Error deleting user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user');
      }
    }
  };


  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchFAQs();
      fetchUsers();
    }
  }, [user]);

  // Don't render anything if user is not loaded yet or not admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="admin-dashboard">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">

      <div className="dashboard-tabs">
        <button 
          className={activeTab === 'faqs' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('faqs')}
        >
          Manage FAQs
        </button>
        <button 
          className={activeTab === 'users' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('users')}
        >
          Manage Users
        </button>
      </div>

      {activeTab === 'faqs' && (
        <div className="tab-content">
          <div className="add-faq-section">
            <h2>Add New FAQ</h2>

            <form onSubmit={handleAddFAQ} className="faq-form">
              <div className="form-group">

                <label>Question:</label>
                <input
                  type="text"
                  value={newFAQ.question}
                  onChange={(e) => setNewFAQ({...newFAQ, question: e.target.value})}
                 
                  required
                />
              </div>
              <div className="form-group">
                <label>Answer:</label>
                <textarea
                  value={newFAQ.answer}
                  onChange={(e) => setNewFAQ({...newFAQ, answer: e.target.value})}
                  
                  rows="4"
                  required
                />
              </div>
              <button type="submit" disabled={loading} className="add-btn">
                {loading ? 'Adding...' : 'Add FAQ'}
              </button>
            </form>
          </div>

          <div className="faq-list-section">
            <h2>Existing FAQs</h2>
            <div className="faq-list">
              {faqs.map((faq) => (
                <div key={faq._id} className="faq-item">
                  <div className="faq-content">
                    <h3>{faq.question}</h3>
                    <p>{faq.answer}</p>
                  </div>
                  <button 
                    onClick={() => handleDeleteFAQ(faq._id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="tab-content">
          <div className="users-section">
            <h2>Registered Users</h2>
            <div className="users-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>
                        <span className={`role ${user.role}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        {user.role !== 'admin' && (
                          <button 
                            onClick={() => handleDeleteUser(user._id, user.email)}
                            className="delete-btn"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;