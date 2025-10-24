import React from 'react'

export default function ResultScreen({ results, onRestart }) {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        padding: '40px 60px',
        borderRadius: '20px',
        backdropFilter: 'blur(10px)',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '30px', color: '#FFD700' }}>
          🎵 RESULT 🎵
        </h1>
        
        <div style={{ fontSize: '2rem', marginBottom: '20px' }}>
          SCORE: <span style={{ color: '#FFD700' }}>{results.score}</span>
        </div>
        
        <div style={{ fontSize: '1.5rem', marginBottom: '30px' }}>
          MAX COMBO: <span style={{ color: '#FF69B4' }}>{results.maxCombo}</span>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '15px',
          marginBottom: '40px',
          fontSize: '1.2rem'
        }}>
          <div style={{ background: 'rgba(255, 215, 0, 0.2)', padding: '10px', borderRadius: '10px' }}>
            GREAT: {results.judgments.GREAT}
          </div>
          <div style={{ background: 'rgba(144, 238, 144, 0.2)', padding: '10px', borderRadius: '10px' }}>
            GOOD: {results.judgments.GOOD}
          </div>
          <div style={{ background: 'rgba(135, 206, 235, 0.2)', padding: '10px', borderRadius: '10px' }}>
            NORMAL: {results.judgments.NORMAL}
          </div>
          <div style={{ background: 'rgba(255, 107, 107, 0.2)', padding: '10px', borderRadius: '10px' }}>
            MISS: {results.judgments.MISS}
          </div>
        </div>
        
        <button
          onClick={onRestart}
          style={{
            padding: '15px 40px',
            fontSize: '1.5rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          RETRY
        </button>
      </div>
    </div>
  )
}
