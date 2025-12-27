import React from 'react';
import { Link } from 'react-router-dom';

const GuidePreference = () => {
  return (
    <div style={{
      textAlign: 'center',
      padding: '2rem',
      marginTop: '50px'
    }}>
      <h2 style={{
        color: '#2c3e50',
        marginBottom: '2rem',
        fontSize: '2rem',
        fontWeight: '600'
      }}>
        Guide Preference
      </h2>
      
      <div style={{
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        {/* Add Button - Green for positive action */}
        <Link 
          to="/guide/preference/add" 
          style={{
            padding: '12px 24px',
            backgroundColor: '#2ecc71',  // Fresh green
            color: 'white',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'all 0.2s ease',
            border: '2px solid #27ae60',
            fontSize: '1rem',
            ':hover': {
              backgroundColor: '#27ae60',  // Darker green on hover
              transform: 'translateY(-1px)'
            }
          }}>
          ➕ Add Preference
        </Link>
        
        {/* View Button - Blue for informational action */}
        <Link 
          to="/guide/preference/view" 
          style={{
            padding: '12px 24px',
            backgroundColor: '#3498db',  // Professional blue
            color: 'white',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'all 0.2s ease',
            border: '2px solid #2980b9',
            fontSize: '1rem',
            ':hover': {
              backgroundColor: 'blue',  // Darker blue on hover
              transform: 'translateY(-1px)'
            }
          }}>
          📄 View Preference
        </Link>
      </div>
    </div>
  );
};

export default GuidePreference;