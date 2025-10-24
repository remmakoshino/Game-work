import React from 'react'

function App() {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎵 リズムゲーム 🎵</h1>
        <p style={{ fontSize: '1.5rem' }}>開発準備完了！</p>
        <p style={{ fontSize: '1rem', marginTop: '2rem', opacity: 0.8 }}>
          これから3Dキャラクターとゲームシステムを実装します
        </p>
      </div>
    </div>
  )
}

export default App
