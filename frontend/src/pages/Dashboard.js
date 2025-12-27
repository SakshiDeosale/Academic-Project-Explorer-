import React from 'react';
import college2 from '../assets/College4.jpg';

function Dashboard() {
  return (
    <div style={{
      minHeight: '100vh',
      overflow: 'hidden',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4vh 4vw',
      boxSizing: 'border-box',
    }}>
      {/* Background Image */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `url(${college2})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(10px) brightness(0.6)',
        zIndex: 0,
      }} />

      {/* Title */}
      <h1 style={{
        color: '#ffffff',
        fontSize: '3rem',
        textAlign: 'center',
        marginBottom: 'calc(4vh + 1.5cm)', // Adjusted marginBottom
        fontWeight: '700',
        letterSpacing: '-1.5px',
        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
        position: 'relative',
        zIndex: 2,
      }}>
        Academic Project Explorer
      </h1>

      {/* Main Image */}
      <div style={{
        width: '95vw',
        maxWidth: '1000px',
        position: 'relative',
        perspective: 1000,
        transformStyle: 'preserve-3d',
        zIndex: 1,
      }}>
        <div style={{
          borderRadius: '8px',
          overflow: 'hidden',
          transform: 'translateZ(15px) rotateY(3deg)',
          boxShadow: `
            0 20px 40px rgba(0,0,0,0.3),
            0 0 50px rgba(0,0,0,0.1) inset,
            6px 6px 15px rgba(0,0,0,0.35),
            -3px -3px 8px rgba(255,255,255,0.2)
          `,
          transition: 'all 0.3s ease-in-out',
          height: 'auto',
          position: 'relative',
        }}>
          <img
            src={college2}
            alt="University Campus Focus"
            style={{
              display: 'block',
              width: '100%',
              height: 'auto', // Maintain original width
              maxHeight: '60vh', // Increased maximum height, adjust as needed.
              objectFit: 'cover',
              borderRadius: '8px',
              filter: 'contrast(1.05) saturate(1.1)',
            }}
          />
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '60px',
            background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 100%)',
            borderRadius: '0 0 8px 8px',
          }} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;