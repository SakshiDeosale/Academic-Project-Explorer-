import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Notices() {
  // All original state and functionality remains unchanged
  const [file, setFile] = useState(null);
  const [year, setYear] = useState('');
  const [notices, setNotices] = useState([]);
  const [message, setMessage] = useState('');
  const [searchYear, setSearchYear] = useState('');

  const fetchNotices = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/notices');
      setNotices(res.data);
    } catch (err) {
      console.error('Error fetching notices', err);
    }
  };

  useEffect(() => { fetchNotices(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !year) {
      setMessage("Year and file are required!");
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('year', year);
    try {
      await axios.post('http://localhost:5000/api/notices/upload', formData);
      fetchNotices();
      setMessage('Uploaded successfully!');
      setYear('');
      setFile(null);
    } catch (err) {
      setMessage('Error uploading file');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/notices/${id}`);
      fetchNotices();
      setMessage('Notice deleted successfully');
    } catch (err) {
      setMessage('Error deleting notice');
    }
  };

  const filteredNotices = notices.filter(notice =>
    notice.year.toLowerCase().includes(searchYear.toLowerCase())
  );

  return (
    <div style={{
      maxWidth: '800px',
      margin: '2rem auto',
      padding: '2rem',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      fontFamily: 'Segoe UI, sans-serif'
    }}>
      {/* Header */}
      <h1 style={{
        textAlign: 'center',
        color: '#2c3e50',
        marginBottom: '2rem',
        fontSize: '2rem',
        fontWeight: '600',
        letterSpacing: '-0.5px'
      }}>
        Notices & Circulars
      </h1>

      {/* Upload Form */}
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input
            type="text"
            value={year}
            placeholder="Enter Academic Year"
            onChange={(e) => setYear(e.target.value)}
            style={{
              flex: 1,
              padding: '0.8rem',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '1rem',
              ':focus': {
                outline: 'none',
                borderColor: '#3498db'
              }
            }}
          />
          <label style={{
            flex: 1,
            padding: '0.8rem',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            cursor: 'pointer',
            backgroundColor: file ? '#f0f8ff' : 'white',
            transition: 'all 0.2s'
          }}>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              accept=".pdf"
              style={{ display: 'none' }}
            />
            <span style={{ color: file ? '#3498db' : '#7f8c8d' }}>
              {file ? file.name : 'Choose PDF File'}
            </span>
          </label>
        </div>

        <button type="submit" style={{
          padding: '1rem',
          backgroundColor: '#3498db',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s',
          ':hover': {
            backgroundColor: '#2980b9',
            transform: 'translateY(-1px)'
          }
        }}>
           Upload Notice
        </button>
      </form>

      {/* Status Messages */}
      {message && (
        <div style={{
          padding: '1rem',
          marginBottom: '1.5rem',
          backgroundColor: message.includes('Error') ? '#fee2e2' : '#dcfce7',
          color: message.includes('Error') ? '#b91c1c' : '#166534',
          borderRadius: '8px',
          border: `2px solid ${message.includes('Error') ? '#fecaca' : '#bbf7d0'}`
        }}>
          {message}
        </div>
      )}

      {/* Search Bar */}
      <div style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="🔍 Search by academic year"
          value={searchYear}
          onChange={(e) => setSearchYear(e.target.value)}
          style={{
            width: '100%',
            padding: '0.8rem',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '1rem',
            ':focus': {
              outline: 'none',
              borderColor: '#3498db'
            }
          }}
        />
      </div>

      {/* Notices List */}
      <div>
        <h3 style={{
          color: '#2c3e50',
          marginBottom: '1.5rem',
          fontSize: '1.25rem',
          fontWeight: '600'
        }}>
          Uploaded Notices
        </h3>
        
        {filteredNotices.length > 0 ? (
          <div style={{
            display: 'grid',
            gap: '1rem'
          }}>
            {filteredNotices.map(notice => (
              <div key={notice._id} style={{
                padding: '1rem',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                border: '2px solid #f1f5f9',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <span style={{
                    display: 'block',
                    color: '#2c3e50',
                    fontWeight: '500',
                    marginBottom: '0.5rem'
                  }}>
                    {notice.year}
                  </span>
                  <a
                    href={`http://localhost:5000${notice.fileUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#3498db',
                      color: 'white',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      transition: 'all 0.2s',
                      ':hover': {
                        backgroundColor: '#2980b9'
                      }
                    }}
                  >
                     View Notice
                  </a>
                </div>
                <button 
                  onClick={() => handleDelete(notice._id)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    ':hover': {
                      backgroundColor: '#dc2626'
                    }
                  }}
                >
                   Delete
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p style={{
            color: '#64748b',
            textAlign: 'center',
            padding: '2rem'
          }}>
            No notices found for "{searchYear}"
          </p>
        )}
      </div>
    </div>
  );
}

export default Notices;