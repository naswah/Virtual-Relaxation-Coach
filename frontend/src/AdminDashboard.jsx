import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('faqs');
  const [faqs, setFaqs] = useState([]);
  const [users, setUsers] = useState([]);
  const [newFAQ, setNewFAQ] = useState({ question: '', answer: '' });
  const [loading, setLoading] = useState(false);

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user'));

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

      const data = await response.text();

      if (response.ok) {
        alert(data || 'FAQ added successfully!');
        setNewFAQ({ question: '', answer: '' });
        fetchFAQs(); // Refresh FAQ list
      } else {
        alert(data || 'Error adding FAQ');
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

        const data = await response.text();

        if (response.ok) {
          alert(data || 'FAQ deleted successfully!');
          fetchFAQs(); // Refresh FAQ list
        } else {
          alert(data || 'Error deleting FAQ');
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

        const data = await response.text();

        if (response.ok) {
          alert(data || 'User deleted successfully!');
          fetchUsers(); // Refresh user list
        } else {
          alert(data || 'Error deleting user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user');
      }
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchFAQs();
    fetchUsers();
  }, []);

  // Show access denied if not admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="admin-dashboard">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Access Denied</h2>
          <p>Admin privileges required to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user?.name}!</p>

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
                  placeholder="Enter FAQ question"
                  required
                />
              </div>
              <div className="form-group">
                <label>Answer:</label>
                <textarea
                  value={newFAQ.answer}
                  onChange={(e) => setNewFAQ({...newFAQ, answer: e.target.value})}
                  placeholder="Enter FAQ answer"
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
            <h2>Existing FAQs ({faqs.length})</h2>
            <div className="faq-list">
              {faqs.length === 0 ? (
                <p>No FAQs found.</p>
              ) : (
                faqs.map((faq) => (
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
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="tab-content">
          <div className="users-section">
            <h2>Registered Users ({users.length})</h2>
            <div className="users-table">
              {users.length === 0 ? (
                <p>No users found.</p>
              ) : (
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
                    {users.map((userItem) => (
                      <tr key={userItem._id}>
                        <td>{userItem.name}</td>
                        <td>{userItem.email}</td>
                        <td>{userItem.phone}</td>
                        <td>
                          <span className={`role ${userItem.role}`}>
                            {userItem.role}
                          </span>
                        </td>
                        <td>
                          {userItem.role !== 'admin' && (
                            <button 
                              onClick={() => handleDeleteUser(userItem._id, userItem.email)}
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
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;