import React, { useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const ViewPreference = () => {
  const [year, setYear] = useState('');
  const navigate = useNavigate();

  const handleGo = () => {
    if (year) {
      navigate(`/guide/preference/view/${year}`);
    }
  };

  return (
    <div style={{
      maxWidth: '600px',
      margin: '40px auto',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h3 style={{
        color: '#2c3e50',
        marginBottom: '30px',
        fontSize: '1.8rem'
      }}>
        View Guide Preferences
      </h3>
      
      <div style={{
        display: 'flex',
        gap: '10px',
        justifyContent: 'center'
      }}>
        <input 
          type="text"
          placeholder="Enter Academic Year (e.g. 2023-24)"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          style={{
            width: '300px',  // Reduced by ~2cm (from typical 400px)
            padding: '10px 15px',
            borderRadius: '5px',
            border: '1px solid #bdc3c7',
            fontSize: '1rem'
          }}
        />
        
        <button 
          onClick={handleGo}
          style={{
            padding: '10px 25px',
            backgroundColor: '#3498db',  // Matching view button blue
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1rem',
            transition: 'background-color 0.2s',
            ':hover': {
              backgroundColor: '#2980b9'
            }
          }}
        >
          Go
        </button>
      </div>
    </div>
  );
};

export default ViewPreference;