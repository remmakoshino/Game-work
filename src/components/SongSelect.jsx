import React, { useState } from 'react'
import { DIFFICULTY_COLORS } from '../data/songList'

export default function SongSelect({ songs, onSelect, onBack, getHighScore }) {
  const [selectedSong, setSelectedSong] = useState(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState('EASY')

  const handleSongClick = (song) => {
    setSelectedSong(song)
    // 利用可能な難易度を自動選択
    if (song.difficulties.NORMAL) {
      setSelectedDifficulty('NORMAL')
    } else if (song.difficulties.EASY) {
      setSelectedDifficulty('EASY')
    }
  }

  const handleStart = () => {
    if (selectedSong && selectedSong.difficulties[selectedDifficulty]) {
      onSelect(selectedSong, selectedDifficulty)
    }
  }

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      overflow: 'auto',
      padding: '40px'
    }}>
      <button
        onClick={onBack}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          padding: '10px 20px',
          fontSize: '1rem',
          background: 'rgba(255, 255, 255, 0.2)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        ← BACK
      </button>

      <h1 style={{
        textAlign: 'center',
        fontSize: '3rem',
        marginBottom: '40px',
        textShadow: '0 4px 6px rgba(0,0,0,0.3)'
      }}>
        🎵 SELECT SONG 🎵
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '30px',
        maxWidth: '1200px',
        margin: '0 auto 40px'
      }}>
        {songs.map((song) => (
          <div
            key={song.id}
            onClick={() => handleSongClick(song)}
            style={{
              background: selectedSong?.id === song.id
                ? 'rgba(102, 126, 234, 0.4)'
                : 'rgba(255, 255, 255, 0.1)',
              padding: '30px',
              borderRadius: '15px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              border: selectedSong?.id === song.id
                ? '3px solid #667eea'
                : '3px solid transparent',
              backdropFilter: 'blur(10px)',
              transform: selectedSong?.id === song.id ? 'scale(1.05)' : 'scale(1)'
            }}
            onMouseOver={(e) => {
              if (selectedSong?.id !== song.id) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'
              }
            }}
            onMouseOut={(e) => {
              if (selectedSong?.id !== song.id) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <div style={{
              fontSize: '5rem',
              textAlign: 'center',
              marginBottom: '15px'
            }}>
              {song.image}
            </div>
            <h2 style={{
              fontSize: '1.8rem',
              marginBottom: '10px',
              textAlign: 'center'
            }}>
              {song.title}
            </h2>
            <p style={{
              fontSize: '1.2rem',
              opacity: 0.7,
              textAlign: 'center',
              marginBottom: '15px'
            }}>
              {song.artist}
            </p>
            <p style={{
              fontSize: '1rem',
              opacity: 0.6,
              textAlign: 'center'
            }}>
              BPM: {song.bpm}
            </p>

            {/* ハイスコア表示 */}
            <div style={{
              marginTop: '20px',
              display: 'flex',
              justifyContent: 'space-around',
              fontSize: '0.9rem'
            }}>
              {Object.keys(song.difficulties).map((diff) => {
                if (!song.difficulties[diff]) return null
                const highScore = getHighScore(song.id, diff)
                return (
                  <div key={diff} style={{ textAlign: 'center' }}>
                    <div style={{
                      color: DIFFICULTY_COLORS[diff],
                      fontWeight: 'bold',
                      marginBottom: '5px'
                    }}>
                      {diff}
                    </div>
                    <div style={{ opacity: 0.8 }}>
                      {highScore > 0 ? highScore : '---'}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 難易度選択とスタートボタン */}
      {selectedSong && (
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '30px',
          borderRadius: '15px',
          backdropFilter: 'blur(10px)'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            SELECT DIFFICULTY
          </h3>
          <div style={{
            display: 'flex',
            gap: '15px',
            justifyContent: 'center',
            marginBottom: '30px'
          }}>
            {['EASY', 'NORMAL', 'HARD'].map((diff) => {
              const isAvailable = selectedSong.difficulties[diff]
              const isSelected = selectedDifficulty === diff
              return (
                <button
                  key={diff}
                  disabled={!isAvailable}
                  onClick={() => setSelectedDifficulty(diff)}
                  style={{
                    padding: '15px 30px',
                    fontSize: '1.3rem',
                    background: isSelected
                      ? DIFFICULTY_COLORS[diff]
                      : isAvailable
                      ? 'rgba(255, 255, 255, 0.2)'
                      : 'rgba(100, 100, 100, 0.2)',
                    color: isAvailable ? 'white' : '#666',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: isAvailable ? 'pointer' : 'not-allowed',
                    fontWeight: 'bold',
                    transition: 'transform 0.2s',
                    transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                    opacity: isAvailable ? 1 : 0.5
                  }}
                  onMouseOver={(e) => {
                    if (isAvailable && !isSelected) {
                      e.target.style.transform = 'scale(1.05)'
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isSelected) {
                      e.target.style.transform = 'scale(1)'
                    }
                  }}
                >
                  {diff}
                </button>
              )
            })}
          </div>

          <button
            onClick={handleStart}
            style={{
              width: '100%',
              padding: '20px',
              fontSize: '2rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '15px',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            START GAME
          </button>
        </div>
      )}
    </div>
  )
}
