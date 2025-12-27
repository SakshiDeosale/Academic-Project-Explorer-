import React from 'react';
import { Link } from 'react-router-dom';

const GuideMain = () => {
  return (
    <div style={{ 
      textAlign: 'center', 
      marginTop: '3rem',
      padding: '0 15px'
    }}>
      <h2 style={{ 
        marginBottom: '1.5rem', 
        color: '#2c3e50'
      }}>
        Guide Section
      </h2>
      
      <Link 
        to="/guide/preference" 
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#3498db',
          color: 'white',
          borderRadius: '0.375rem',
          textDecoration: 'none',
          fontSize: '1.25rem',
          transition: 'background-color 0.2s',
          border: 'none',
          cursor: 'pointer',
          ':hover': {
            backgroundColor: '#2980b9'
          }
        }}
      >
        📘 Guide Preference
      </Link>
    </div>
  );
};

export default GuideMain;