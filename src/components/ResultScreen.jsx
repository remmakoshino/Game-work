import React, { useState, useEffect } from 'react'
import { DIFFICULTY_COLORS } from '../data/songList'

export default function ResultScreen({
  results,
  song,
  difficulty,
  highScore,
  isNewRecord,
  onRestart,
  onToMenu
}) {
  const [showFullCombo, setShowFullCombo] = useState(false)
  const [showNewRecord, setShowNewRecord] = useState(false)

  useEffect(() => {
    if (results.isFullCombo) {
      setTimeout(() => setShowFullCombo(true), 500)
    }
    if (isNewRecord) {
      setTimeout(() => setShowNewRecord(true), 1000)
    }
  }, [results.isFullCombo, isNewRecord])

  // 正確性の計算
  const accuracy = results.totalNotes > 0
    ? ((results.judgments.GREAT * 100 +
        results.judgments.GOOD * 70 +
        results.judgments.NORMAL * 40) /
       (results.totalNotes * 100) * 100).toFixed(2)
    : 0

  // ランク判定
  const getRank = (acc) => {
    if (acc >= 95) return { rank: 'S', color: '#FFD700' }
    if (acc >= 90) return { rank: 'A', color: '#C0C0C0' }
    if (acc >= 80) return { rank: 'B', color: '#CD7F32' }
    if (acc >= 70) return { rank: 'C', color: '#87CEEB' }
    return { rank: 'D', color: '#808080' }
  }

  const rankInfo = getRank(accuracy)

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      overflow: 'auto',
      position: 'relative',
      padding: 'clamp(10px, 2vw, 20px)'
    }}>
      {/* フルコンボエフェクト */}
      {showFullCombo && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          animation: 'fadeIn 0.5s',
          zIndex: 0
        }}>
          <div style={{
            position: 'absolute',
            top: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 'clamp(2rem, 8vw, 4rem)',
            fontWeight: 'bold',
            color: '#FFD700',
            textShadow: '0 0 20px #FFD700, 0 0 40px #FFD700',
            animation: 'bounce 1s infinite',
            textAlign: 'center',
            padding: '0 10px'
          }}>
            ✨ FULL COMBO ✨
          </div>
        </div>
      )}

      {/* 新記録エフェクト */}
      {showNewRecord && (
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 'clamp(1.5rem, 5vw, 2rem)',
          fontWeight: 'bold',
          color: '#FF69B4',
          textShadow: '0 0 15px #FF69B4',
          animation: 'pulse 1.5s infinite',
          zIndex: 10,
          textAlign: 'center',
          padding: '0 10px'
        }}>
          🎉 NEW RECORD 🎉
        </div>
      )}

      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        padding: 'clamp(30px, 6vw, 50px) clamp(20px, 6vw, 80px)',
        borderRadius: '25px',
        backdropFilter: 'blur(15px)',
        textAlign: 'center',
        maxWidth: '800px',
        width: '95%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        position: 'relative',
        zIndex: 1
      }}>
        <h1 style={{
          fontSize: 'clamp(2rem, 7vw, 3.5rem)',
          marginBottom: '10px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          RESULT
        </h1>

        {/* 楽曲情報 */}
        <div style={{
          marginBottom: 'clamp(20px, 4vw, 30px)',
          padding: 'clamp(10px, 2vw, 15px)',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '10px'
        }}>
          <div style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', marginBottom: '5px' }}>
            {song.image} {song.title}
          </div>
          <div style={{
            fontSize: 'clamp(1rem, 3vw, 1.2rem)',
            color: DIFFICULTY_COLORS[difficulty],
            fontWeight: 'bold'
          }}>
            {difficulty}
          </div>
        </div>

        {/* ランクとスコア */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth > 600 ? '1fr 2fr' : '1fr',
          gap: 'clamp(15px, 3vw, 30px)',
          marginBottom: 'clamp(20px, 4vw, 30px)'
        }}>
          {/* ランク */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: 'clamp(15px, 3vw, 20px)',
            borderRadius: '15px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div style={{
              fontSize: 'clamp(3rem, 10vw, 5rem)',
              fontWeight: 'bold',
              color: rankInfo.color,
              textShadow: `0 0 20px ${rankInfo.color}`,
              marginBottom: '10px'
            }}>
              {rankInfo.rank}
            </div>
            <div style={{ fontSize: 'clamp(0.8rem, 2vw, 1rem)', opacity: 0.7 }}>
              {accuracy}%
            </div>
          </div>

          {/* スコア */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: 'clamp(15px, 3vw, 20px)',
            borderRadius: '15px'
          }}>
            <div style={{
              fontSize: 'clamp(0.8rem, 2vw, 1rem)',
              opacity: 0.7,
              marginBottom: '10px'
            }}>
              SCORE
            </div>
            <div style={{
              fontSize: 'clamp(2rem, 7vw, 3.5rem)',
              fontWeight: 'bold',
              color: '#FFD700',
              marginBottom: '15px'
            }}>
              {results.score.toLocaleString()}
            </div>
            <div style={{
              fontSize: 'clamp(0.7rem, 2vw, 0.9rem)',
              opacity: 0.6
            }}>
              HIGH SCORE: {highScore.toLocaleString()}
            </div>
          </div>
        </div>

        {/* コンボ */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 'clamp(15px, 3vw, 30px)',
          marginBottom: 'clamp(20px, 4vw, 30px)'
        }}>
          <div style={{
            background: results.isFullCombo
              ? 'rgba(255, 215, 0, 0.2)'
              : 'rgba(255, 255, 255, 0.05)',
            padding: 'clamp(12px, 2.5vw, 15px) clamp(20px, 4vw, 30px)',
            borderRadius: '15px',
            border: results.isFullCombo ? '2px solid #FFD700' : 'none'
          }}>
            <div style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', opacity: 0.7, marginBottom: '5px' }}>
              MAX COMBO
            </div>
            <div style={{
              fontSize: 'clamp(1.5rem, 5vw, 2rem)',
              fontWeight: 'bold',
              color: results.isFullCombo ? '#FFD700' : '#FF69B4'
            }}>
              {results.maxCombo}
            </div>
          </div>
        </div>

        {/* 判定詳細 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth > 600 ? 'repeat(4, 1fr)' : 'repeat(2, 1fr)',
          gap: 'clamp(10px, 2vw, 15px)',
          marginBottom: 'clamp(30px, 5vw, 40px)'
        }}>
          <div style={{
            background: 'rgba(255, 215, 0, 0.2)',
            padding: 'clamp(10px, 2vw, 15px)',
            borderRadius: '12px',
            border: '2px solid rgba(255, 215, 0, 0.5)'
          }}>
            <div style={{
              fontSize: 'clamp(0.7rem, 2vw, 0.8rem)',
              marginBottom: '5px',
              color: '#FFD700',
              fontWeight: 'bold'
            }}>
              GREAT
            </div>
            <div style={{ fontSize: 'clamp(1.2rem, 4vw, 1.8rem)', fontWeight: 'bold' }}>
              {results.judgments.GREAT}
            </div>
          </div>
          <div style={{
            background: 'rgba(144, 238, 144, 0.2)',
            padding: 'clamp(10px, 2vw, 15px)',
            borderRadius: '12px',
            border: '2px solid rgba(144, 238, 144, 0.5)'
          }}>
            <div style={{
              fontSize: 'clamp(0.7rem, 2vw, 0.8rem)',
              marginBottom: '5px',
              color: '#90EE90',
              fontWeight: 'bold'
            }}>
              GOOD
            </div>
            <div style={{ fontSize: 'clamp(1.2rem, 4vw, 1.8rem)', fontWeight: 'bold' }}>
              {results.judgments.GOOD}
            </div>
          </div>
          <div style={{
            background: 'rgba(135, 206, 235, 0.2)',
            padding: 'clamp(10px, 2vw, 15px)',
            borderRadius: '12px',
            border: '2px solid rgba(135, 206, 235, 0.5)'
          }}>
            <div style={{
              fontSize: 'clamp(0.7rem, 2vw, 0.8rem)',
              marginBottom: '5px',
              color: '#87CEEB',
              fontWeight: 'bold'
            }}>
              NORMAL
            </div>
            <div style={{ fontSize: 'clamp(1.2rem, 4vw, 1.8rem)', fontWeight: 'bold' }}>
              {results.judgments.NORMAL}
            </div>
          </div>
          <div style={{
            background: 'rgba(255, 107, 107, 0.2)',
            padding: 'clamp(10px, 2vw, 15px)',
            borderRadius: '12px',
            border: '2px solid rgba(255, 107, 107, 0.5)'
          }}>
            <div style={{
              fontSize: 'clamp(0.7rem, 2vw, 0.8rem)',
              marginBottom: '5px',
              color: '#FF6B6B',
              fontWeight: 'bold'
            }}>
              MISS
            </div>
            <div style={{ fontSize: 'clamp(1.2rem, 4vw, 1.8rem)', fontWeight: 'bold' }}>
              {results.judgments.MISS}
            </div>
          </div>
        </div>

        {/* ボタン */}
        <div style={{
          display: 'flex',
          gap: 'clamp(10px, 3vw, 20px)',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={onRestart}
            style={{
              padding: 'clamp(12px, 2.5vw, 15px) clamp(30px, 5vw, 40px)',
              fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
              transition: 'transform 0.2s',
              touchAction: 'manipulation'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            🔄 RETRY
          </button>
          <button
            onClick={onToMenu}
            style={{
              padding: 'clamp(12px, 2.5vw, 15px) clamp(30px, 5vw, 40px)',
              fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
              background: 'rgba(255, 255, 255, 0.15)',
              color: 'white',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'transform 0.2s',
              touchAction: 'manipulation'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'scale(1.05)'
              e.target.style.background = 'rgba(255, 255, 255, 0.25)'
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'scale(1)'
              e.target.style.background = 'rgba(255, 255, 255, 0.15)'
            }}
          >
            🏠 MENU
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-20px); }
        }
        @keyframes pulse {
          0%, 100% { transform: translateX(-50%) scale(1); }
          50% { transform: translateX(-50%) scale(1.1); }
        }
      `}</style>
    </div>
  )
}
