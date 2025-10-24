import React, { useState } from 'react'
import GameScene from './components/GameScene'
import ResultScreen from './components/ResultScreen'
import chartData from './charts/sample-chart.json'

function App() {
  const [gameState, setGameState] = useState('menu') // 'menu', 'playing', 'result'
  const [results, setResults] = useState(null)

  const handleStart = () => {
    setGameState('playing')
  }

  const handleGameEnd = (gameResults) => {
    setResults(gameResults)
    setGameState('result')
  }

  const handleRestart = () => {
    setGameState('menu')
    setResults(null)
  }

  if (gameState === 'result' && results) {
    return <ResultScreen results={results} onRestart={handleRestart} />
  }

  if (gameState === 'playing') {
    return <GameScene chartData={chartData} onGameEnd={handleGameEnd} />
  }

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
        <h1 style={{ fontSize: '4rem', marginBottom: '2rem', textShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
          🎵 リズムゲーム 🎵
        </h1>
        <p style={{ fontSize: '1.5rem', marginBottom: '3rem', opacity: 0.9 }}>
          ピンクツインテールの女の子とリズムに乗ろう！
        </p>
        <button
          onClick={handleStart}
          style={{
            padding: '20px 60px',
            fontSize: '2rem',
            background: 'rgba(255, 255, 255, 0.9)',
            color: '#667eea',
            border: 'none',
            borderRadius: '15px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
            transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          START
        </button>
        <div style={{ marginTop: '3rem', fontSize: '1rem', opacity: 0.7 }}>
          <p>操作キー: D / F / J / K</p>
          <p>ゲーム中スペースキーでスタート</p>
        </div>
      </div>
    </div>
  )
}

export default App
