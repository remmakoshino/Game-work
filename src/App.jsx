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
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{
          fontSize: '4rem',
          marginBottom: '2rem',
          textShadow: '0 4px 6px rgba(0,0,0,0.3)',
          animation: 'pulse 2s infinite'
        }}>
          🎵 リズムゲーム 🎵
        </h1>
        <p style={{ fontSize: '1.5rem', marginBottom: '3rem', opacity: 0.9 }}>
          ピンクツインテールの女の子とリズムに乗ろう！
        </p>
        <button
          onClick={() => setGameState('songSelect')}
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
