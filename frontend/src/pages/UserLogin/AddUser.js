import React, { useState, useEffect, useCallback } from 'react';
import { Form, Button, Alert, Table } from 'react-bootstrap';
import { FiEye, FiEyeOff, FiTrash2 } from 'react-icons/fi';
import axios from 'axios';

const AddUser = () => {
  // State declarations (unchanged)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('12345678');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showUsers, setShowUsers] = useState(false);
  const [users, setUsers] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [deleteSuccessMessage, setDeleteSuccessMessage] = useState('');
  const [deleteErrorMessage, setDeleteErrorMessage] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);

  // All backend-related code remains unchanged
  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users/list');
      setUsers(response.data.users);
      setDeleteSuccessMessage('');
      setDeleteErrorMessage('');
      setSelectedUsers([]);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch users');
    }
  }, []);

  useEffect(() => {
    if (showUsers) {
      fetchUsers();
    }
  }, [showUsers, fetchUsers]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users/add', { email, password });
      setSuccess(true);
      setError('');
      setEmail('');
      setPassword('12345678');
      if (showUsers) fetchUsers();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add user');
      setSuccess(false);
    }
  };

  const handleCheckboxChange = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleDeleteSelectedUsers = async () => {
    if (selectedUsers.length === 0) {
      setDeleteErrorMessage('Please select at least one user to delete');
      setTimeout(() => setDeleteErrorMessage(''), 3000);
      return;
    }

    try {
      await Promise.all(
        selectedUsers.map(userId =>
          axios.delete(`http://localhost:5000/api/users/delete/${userId}`)
        )
      );
      setDeleteSuccessMessage(`${selectedUsers.length} user(s) deleted successfully`);
      await fetchUsers();
      setSelectedUsers([]);
    } catch (err) {
      setDeleteErrorMessage(err.response?.data?.error || 'Failed to delete selected users');
    }

    setTimeout(() => {
      setDeleteSuccessMessage('');
      setDeleteErrorMessage('');
    }, 3000);
  };

  // Inline styles
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      padding: '30px',
      background: '#f8f9fa',
      minHeight: '100vh'
    },
    authBox: {
      background: '#fff',
      padding: '40px',
      borderRadius: '16px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
      width: '900px',
      maxWidth: '800px',
      transition: 'all 0.3s ease-in-out',
      overflowX: 'auto'
    },
    title: {
      textAlign: 'center',
      marginBottom: '35px',
      fontSize: '32px',
      fontWeight: '500',
      fontstyle: 'Segoe UI', 
      color: '#343a40'
    },
    input: {
      width: '380px',
      height: '40px',
      padding: '14px 18px',
      fontSize: '17px',
      border: '1px solid #ced4da',
      borderRadius: '8px',
      transition: 'border-color 0.3s ease'
    },
    button: {
      width: '200px',
      padding: '10px 20px',
      fontSize: '17px',
      borderRadius: '12px',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      textTransform: 'uppercase',
      letterSpacing: '0.6px',
      border: 'none',
      backgroundColor: 'rgb(52, 152, 219)',
      color: 'white',
      margin: '10px'
    },
    passwordToggle: {
      background: 'none',
      border: 'none',
      position: 'absolute',
      right: '15px',
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: '20px',
      color: '#495057'
    },
    tableHeader: {
      padding: '12px',
      backgroundColor: '#f8f9fa',
      borderBottom: '2px solid #dee2e6'
    },
    tableCell: {
      padding: '12px',
      verticalAlign: 'middle'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.authBox}>
        <h2 style={styles.title}>User Management</h2>

        {showUsers ? (
          <div style={{ margin: '20px 0' }}>
            <div style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h4 style={{ color: '#343a40' }}>Registered Users</h4>
              <Button 
                onClick={() => setShowUsers(false)}
                style={{ ...styles.button, backgroundColor: '#6c757d' }}
              >
                Hide Users
              </Button>
            </div>

            {deleteSuccessMessage && <Alert variant="success">{deleteSuccessMessage}</Alert>}
            {deleteErrorMessage && <Alert variant="danger">{deleteErrorMessage}</Alert>}

            <div style={{ marginBottom: '20px' }}>
              <Button
                onClick={handleDeleteSelectedUsers}
                disabled={selectedUsers.length === 0}
                style={{ ...styles.button, backgroundColor: '#dc3545' }}
              >
                <FiTrash2 /> Delete  ({selectedUsers.length})
              </Button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <Table bordered hover>
                <thead>
                  <tr>
                    <th style={styles.tableHeader}>Select</th>
                    <th style={styles.tableHeader}>Email</th>
                    <th style={styles.tableHeader}>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map(user => (
                      <tr key={user._id}>
                        <td style={styles.tableCell}>
                          <Form.Check
                            type="checkbox"
                            checked={selectedUsers.includes(user._id)}
                            onChange={() => handleCheckboxChange(user._id)}
                          />
                        </td>
                        <td style={styles.tableCell}>{user.email}</td>
                        <td style={styles.tableCell}>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" style={{ ...styles.tableCell, textAlign: 'center' }}>
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </div>
        ) : (
          <>
            {success && <Alert variant="success">User added successfully!</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group style={{ marginBottom: '20px' }}>
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  required
                  style={styles.input}
                />
              </Form.Group>

              <Form.Group style={{ marginBottom: '20px' }}>
                <Form.Label>Password</Form.Label>
                <div style={{ position: 'relative' }}>
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Set password"
                    required
                    style={styles.input}
                  />
                  <button
                    type="button"
                    style={styles.passwordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </Form.Group>

              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Button 
                  type="submit" 
                  style={styles.button}
                >
                  Add User
                </Button>
              </div>
            </Form>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <Button
                onClick={() => setShowUsers(true)}
                style={styles.button}
              >
                View All Users
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AddUser;