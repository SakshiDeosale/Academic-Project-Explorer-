import React, { useState } from 'react';
import api from '../../services/api';

const AddPreference = () => {
  const [guideName, setGuideName] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [preferences, setPreferences] = useState([
    { domain: '', subDomain: '' },
    { domain: '', subDomain: '' },
    { domain: '', subDomain: '' },
    { domain: '', subDomain: '' }
  ]);

  const handleChange = (index, field, value) => {
    const updated = [...preferences];
    updated[index][field] = value;
    setPreferences(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validPreferences = preferences.filter(
      (p) => p.domain.trim() !== '' && p.subDomain.trim() !== ''
    );

    if (validPreferences.length === 0) {
      return alert('Please fill at least one preference.');
    }

    const payload = validPreferences.map((p) => ({
      guideName,
      academicYear,
      domain: p.domain,
      subDomain: p.subDomain,
    }));

    await api.post('/guide/preference', payload);
    alert('Preferences submitted!');
  };

  const domainOptions = [
    "Artificial Intelligence, Machine Learning, Deep Learning",
    "Data Science",
    "IoT, Hardware",
    "Computer Network & Network Security",
    "Cyber Security and Blockchain",
    "AR/VR",
    "Web Tech, DevOps",
    "BI, Data Mining",
    "Image Processing",
    "Mobile App Development",
  ];

  return (
    <div style={{ width: '80%', margin: '0 auto', marginTop: '20px' }}>
      <h3 style={{ marginBottom: '20px', textAlign: 'center' }}>Add Guide Preferences</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="guideName"
          placeholder="Guide Name"
          style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ccc' }}
          value={guideName}
          onChange={(e) => setGuideName(e.target.value)}
          required
        />

        <input
          type="text"
          name="academicYear"
          placeholder="Academic Year (e.g., 2023–2024)"
          style={{ width: '100%', padding: '10px', marginBottom: '25px', borderRadius: '5px', border: '1px solid #ccc' }}
          value={academicYear}
          onChange={(e) => setAcademicYear(e.target.value)}
          required
        />

        {preferences.map((pref, index) => (
          <div key={index} style={{
            width: '100%',
            border: '1px solid #ccc',
            padding: '20px',
            marginBottom: '20px',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9'
          }}>
            <h5 style={{ marginBottom: '15px' }}>Preference {index + 1}</h5>

            <select
              style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ccc' }}
              value={pref.domain}
              onChange={(e) => handleChange(index, 'domain', e.target.value)}
            >
              <option value="">Select Domain</option>
              {domainOptions.map((d, i) => (
                <option key={i} value={d}>{d}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Sub Domain"
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
              value={pref.subDomain}
              onChange={(e) => handleChange(index, 'subDomain', e.target.value)}
            />
          </div>
        ))}

        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddPreference;
