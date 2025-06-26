import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:5000/api/admin/users")
      .then(res => setUsers(res.data))
      .catch(err => console.error("Error loading users", err));
  }, [refresh]);

  const handleDeleteUser = async (username) => {
    if (window.confirm(`Are you sure you want to delete ${username}?`)) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/users/${username}`);
        setRefresh(!refresh);
      } catch (err) {
        console.error("Failed to delete user:", err);
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Admin Dashboard</h2>

      <h3>Registered Users</h3>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul>
          {users.map(user => (
            <li key={user._id} style={{ marginBottom: '10px' }}>
              <strong>{user.name}</strong> ({user.email})
              <button
                onClick={() => handleDeleteUser(user.name)}
                style={{ marginLeft: '10px', color: 'red' }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminDashboard;
