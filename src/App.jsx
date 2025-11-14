import React, { useState, useEffect } from 'react'
import GameScene from './components/GameScene'
import ResultScreen from './components/ResultScreen'
import SongSelect from './components/SongSelect'
import { SONGS } from './data/songList'

// ハイスコア管理
const loadHighScores = () => {
  const saved = localStorage.getItem('rhythmGameHighScores')
  return saved ? JSON.parse(saved) : {}
}

const saveHighScore = (songId, difficulty, score) => {
  const highScores = loadHighScores()
  const key = `${songId}-${difficulty}`
  
  if (!highScores[key] || highScores[key] < score) {
    highScores[key] = score
    localStorage.setItem('rhythmGameHighScores', JSON.stringify(highScores))
    return true // 新記録
  }
  return false
}

const getHighScore = (songId, difficulty) => {
  const highScores = loadHighScores()
  const key = `${songId}-${difficulty}`
  return highScores[key] || 0
}

function App() {
  const [gameState, setGameState] = useState('menu') // 'menu', 'songSelect', 'playing', 'result'
  const [selectedSong, setSelectedSong] = useState(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState('EASY')
  const [results, setResults] = useState(null)
  const [isNewRecord, setIsNewRecord] = useState(false)

  const handleSongSelect = (song, difficulty) => {
    setSelectedSong(song)
    setSelectedDifficulty(difficulty)
    setGameState('playing')
  }

  const handleGameEnd = (gameResults) => {
    const newRecord = saveHighScore(
      selectedSong.id,
      selectedDifficulty,
      gameResults.score
    )
    setIsNewRecord(newRecord)
    setResults(gameResults)
    setGameState('result')
  }

  const handleRestart = () => {
    setGameState('songSelect')
    setResults(null)
    setIsNewRecord(false)
  }

  const handleToMenu = () => {
    setGameState('menu')
    setSelectedSong(null)
    setResults(null)
    setIsNewRecord(false)
  }

  if (gameState === 'result' && results) {
    const highScore = getHighScore(selectedSong.id, selectedDifficulty)
    return (
      <ResultScreen
        results={results}
        song={selectedSong}
        difficulty={selectedDifficulty}
        highScore={highScore}
        isNewRecord={isNewRecord}
        onRestart={handleRestart}
        onToMenu={handleToMenu}
      />
    )
  }

  if (gameState === 'playing') {
    const chartData = selectedSong.difficulties[selectedDifficulty]
    return (
      <GameScene
        chartData={chartData}
        songTitle={selectedSong.title}
        difficulty={selectedDifficulty}
        onGameEnd={handleGameEnd}
      />
    )
  }

  if (gameState === 'songSelect') {
    return (
      <SongSelect
        songs={SONGS}
        onSelect={handleSongSelect}
        onBack={handleToMenu}
        getHighScore={getHighScore}
      />
    )
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
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '600px' }}>
        <h1 style={{
          fontSize: 'clamp(2rem, 8vw, 4rem)',
          marginBottom: '1.5rem',
          textShadow: '0 4px 6px rgba(0,0,0,0.3)',
          animation: 'pulse 2s infinite'
        }}>
          🎵 リズムゲーム 🎵
        </h1>
        <p style={{ 
          fontSize: 'clamp(1rem, 3vw, 1.5rem)', 
          marginBottom: '2rem', 
          opacity: 0.9,
          padding: '0 10px'
        }}>
          ピンクツインテールの女の子とリズムに乗ろう！
        </p>
        <button
          onClick={() => setGameState('songSelect')}
          style={{
            padding: 'clamp(15px, 3vw, 20px) clamp(40px, 8vw, 60px)',
            fontSize: 'clamp(1.5rem, 5vw, 2rem)',
            background: 'rgba(255, 255, 255, 0.9)',
            color: '#667eea',
            border: 'none',
            borderRadius: '15px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
            transition: 'transform 0.2s',
            touchAction: 'manipulation'
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          onTouchStart={(e) => e.target.style.transform = 'scale(1.1)'}
          onTouchEnd={(e) => e.target.style.transform = 'scale(1)'}
        >
          START
        </button>
        <div style={{ 
          marginTop: '2rem', 
          fontSize: 'clamp(0.8rem, 2vw, 1rem)', 
          opacity: 0.7,
          padding: '0 10px'
        }}>
          <p>PC: D / F / J / K キー</p>
          <p>スマホ: タップで操作</p>
          <p>ゲーム中スペース/タップでスタート</p>
        </div>
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  )
}

export default App
