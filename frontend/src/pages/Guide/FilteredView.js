import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

const FilteredView = () => {
  const { year } = useParams();
  const [groupedData, setGroupedData] = useState({}); // Properly initialized

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/guide/preference/view/${year}`);
        const preferences = res.data;

        // Group by domain using local variable
        const grouped = {};
        preferences.forEach((item) => {
          if (!grouped[item.domain]) {
            grouped[item.domain] = [];
          }
          grouped[item.domain].push({
            guideName: item.guideName,
            subDomain: item.subDomain,
          });
        });

        setGroupedData(grouped);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [year]);

  // Rest of the component remains unchanged
  const handleDownload = () => {
    window.open(`http://localhost:5000/api/guide/preference/download?year=${year}`, '_blank');
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
      {/* Header section */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <h3 style={{ 
          margin: 0,
          flex: 1,
          textAlign: 'center',
          fontSize: '1.8rem',
          color: '#2c3e50'
        }}>
          Preferences for {year}
        </h3>
        <button 
          onClick={handleDownload}
          style={{
            padding: '10px 25px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1rem',
            transition: 'background-color 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            ':hover': {
              backgroundColor: '#2980b9'
            }
          }}
        >
          📥 Download as Word
        </button>
      </div>

      {/* Data display */}
      {Object.keys(groupedData).length === 0 ? (
        <p style={{ textAlign: 'center', color: '#7f8c8d', fontSize: '1.1rem' }}>
          No preferences found.
        </p>
      ) : (
        Object.entries(groupedData).map(([domain, entries], index) => (
          <div key={index} style={{ marginBottom: '30px' }}>
            {/* Domain header */}
            <h5 style={{
              backgroundColor: '#f8f9fa',
              padding: '12px 20px',
              margin: '20px 0',
              borderRadius: '5px',
              border: '1px solid #e0e0e0',
              color: '#34495e'
            }}>
              {domain}
            </h5>
            
            {/* Table */}
            <div style={{ 
              overflowX: 'auto',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              borderRadius: '6px'
            }}>
              <table style={{ 
                width: '100%',
                borderCollapse: 'collapse',
                backgroundColor: 'white'
              }}>
                <colgroup>
                  <col style={{ width: '50%' }} />
                  <col style={{ width: '50%' }} />
                </colgroup>
                <thead>
                  <tr style={{ 
                    backgroundColor: '#f8f9fa',
                    borderBottom: '2px solid #e0e0e0'
                  }}>
                    <th style={{ padding: '15px', textAlign: 'left', color: '#2c3e50' }}>
                      Guide Name
                    </th>
                    <th style={{ padding: '15px', textAlign: 'left', color: '#2c3e50' }}>
                      Sub Domain
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry, i) => (
                    <tr key={i} style={{ 
                      borderBottom: '1px solid #e0e0e0',
                      ...(i === entries.length - 1 && { borderBottom: 'none' })
                    }}>
                      <td style={{ padding: '15px', color: '#34495e' }}>
                        {entry.guideName}
                      </td>
                      <td style={{ padding: '15px', color: '#34495e' }}>
                        {entry.subDomain}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default FilteredView;