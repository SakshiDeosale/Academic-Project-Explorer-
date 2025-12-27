import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StudentPreference = () => {
  const [file, setFile] = useState(null);
  const [year, setYear] = useState('');
  const [division, setDivision] = useState('A');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [previewData, setPreviewData] = useState(null);
  const [editingFileId, setEditingFileId] = useState(null);
  const [editedYear, setEditedYear] = useState('');
  const [editedDivision, setEditedDivision] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const user = { isAdmin: true }; // Replace with actual auth logic

  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  const fetchUploadedFiles = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/student-preference');
      setUploadedFiles(res.data);
    } catch (err) {
      console.error('Error fetching files:', err);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file || !year) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('year', year);
    formData.append('division', division);

    try {
      await axios.post('http://localhost:5000/api/student-preference/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setFile(null);
      setYear('');
      setDivision('A');
      fetchUploadedFiles();
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Upload failed. Please try again.');
    }
  };

  const handlePreview = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/student-preference/${id}`);
      setPreviewData(res.data);
    } catch (err) {
      console.error('Error loading preview:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        await axios.delete(`http://localhost:5000/api/student-preference/${id}`);
        fetchUploadedFiles();
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  const handleEdit = (file) => {
    setEditingFileId(file._id);
    setEditedYear(file.year);
    setEditedDivision(file.division);
  };

  const handleSaveEdit = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/student-preference/${id}`, {
        year: editedYear,
        division: editedDivision,
      });
      setEditingFileId(null);
      fetchUploadedFiles();
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const groupedFiles = uploadedFiles.reduce((acc, file) => {
    const key = `${file.year}-${file.division}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(file);
    return acc;
  }, {});

  const handleDownload = (id) => {
    window.open(`http://localhost:5000/api/student-preference/download/${id}`, '_blank');
  };

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '1rem' }}>The Student Preference Form Link</h2>
      <p>
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSc-Mvg0qaY2xbzSZr0go0FZovNjiZcJnie7V5RLpuwDjxVQSA/viewform"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'underline', color: '#1d4ed8' }}
        >
          Open Google Form
        </a>
      </p>
      {user.isAdmin && (
        <>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>Upload Excel File</h3>
          <form onSubmit={handleFileUpload} style={{ marginBottom: '2rem' }}>
            <input
              style={{ border: '1px solid #ddd', padding: '0.5rem', marginBottom: '1rem', width: '100%', borderRadius: '0.375rem' }}
              type="text"
              placeholder="Academic Year (e.g. 2023-24)"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
            />
            <select
              style={{ border: '1px solid #ddd', padding: '0.5rem', marginBottom: '1rem', width: '100%', borderRadius: '0.375rem' }}
              value={division}
              onChange={(e) => setDivision(e.target.value)}
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>
            <input
              style={{ border: '1px solid #ddd', padding: '0.5rem', marginBottom: '1rem', width: '100%', borderRadius: '0.375rem' }}
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
            <button
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                border: 'none',
              }}
              type="submit"
            >
              Upload
            </button>
          </form>
        </>
      )}
      <input
        type="text"
        placeholder="Search by academic year (e.g., 2023-24)"
        style={{
          border: '1px solid #ddd',
          padding: '0.5rem',
          marginBottom: '1rem',
          width: '100%',
          borderRadius: '0.375rem',
        }}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div style={{ backgroundColor: '#f3f4f6', padding: '1rem', borderRadius: '0.375rem', marginBottom: '1.5rem' }}>
        {Object.entries(groupedFiles)
          .filter(([group]) => group.toLowerCase().includes(searchQuery.toLowerCase()))
          .map(([group, files]) => (
            <div key={group}>
              <h4 style={{ fontWeight: '600', marginBottom: '1rem' }}>Year-Division: {group}</h4>
              {files.map((file) => (
                <div key={file._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span
                    onClick={() => handlePreview(file._id)}
                    style={{ color: '#2563eb', textDecoration: 'underline', cursor: 'pointer' }}
                  >
                    {file.fileName}
                  </span>
                  {user.isAdmin && (
                    <div>
                      {editingFileId === file._id ? (
                        <>
                          <input
                            style={{ border: '1px solid #ddd', padding: '0.5rem', marginRight: '0.5rem', borderRadius: '0.375rem' }}
                            value={editedYear}
                            onChange={(e) => setEditedYear(e.target.value)}
                          />
                          <select
                            style={{ border: '1px solid #ddd', padding: '0.5rem', marginRight: '0.5rem', borderRadius: '0.375rem' }}
                            value={editedDivision}
                            onChange={(e) => setEditedDivision(e.target.value)}
                          >
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                          </select>
                          <button
                            style={{
                              backgroundColor: '#4CAF50',
                              color: 'white',
                              padding: '0.5rem 1rem',
                              borderRadius: '0.375rem',
                              cursor: 'pointer',
                              border: 'none',
                            }}
                            onClick={() => handleSaveEdit(file._id)}
                          >
                            Save
                          </button>
                        </>
                      ) : (
                        <>
                        <button
                          style={{
                            marginRight: '0.5rem',
                            backgroundColor: 'rgb(52, 152, 219)', // Blue for Edit
                            color: 'white',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.375rem',
                            cursor: 'pointer',
                            border: 'none',
                          }}
                          onClick={() => handleEdit(file)}
                        >
                          Edit
                        </button>
                        <button
                          style={{
                            marginRight: '0.5rem',
                            backgroundColor: '#ef4444', // Red for Delete
                            color: 'white',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.375rem',
                            cursor: 'pointer',
                            border: 'none',
                          }}
                          onClick={() => handleDelete(file._id)}
                        >
                          Delete
                        </button>
                        <button
                          style={{
                            backgroundColor: '#10b981', // Green for Download
                            color: 'white',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.375rem',
                            cursor: 'pointer',
                            border: 'none',
                          }}
                          onClick={() => handleDownload(file._id)}
                        >
                          Download
                        </button>
                      </>
                      
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
      </div>

      {previewData && (
        <div style={{ marginTop: '2rem' }}>
          <h3>File Preview</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {Object.keys(previewData[0]).map((key, idx) => (
                  <th key={idx} style={{ border: '1px solid #ddd', padding: '0.5rem', textAlign: 'left' }}>
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewData.map((row, i) => (
                <tr key={i}>
                  {Object.values(row).map((val, j) => (
                    <td key={j} style={{ border: '1px solid #ddd', padding: '0.5rem' }}>
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentPreference;
