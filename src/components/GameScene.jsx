import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Text } from '@react-three/drei'
import * as THREE from 'three'
import Character3D from './Character3D'
import { LANES, GAME_CONFIG } from '../utils/constants'
import { NoteManager } from '../game/NoteManager'
import { JudgmentSystem } from '../game/JudgmentSystem'

// ノーツコンポーネント
function Note({ lane, y }) {
  const meshRef = useRef()
  const laneData = LANES[lane]

  return (
    <mesh ref={meshRef} position={[laneData.position, y, 0]}>
      <boxGeometry args={[GAME_CONFIG.NOTE_SIZE, 0.2, 0.5]} />
      <meshStandardMaterial color={laneData.color} emissive={laneData.color} emissiveIntensity={0.5} />
    </mesh>
  )
}

// 判定ライン
function JudgmentLine() {
  return (
    <group position={[0, GAME_CONFIG.JUDGMENT_LINE_Y, 0]}>
      <mesh>
        <planeGeometry args={[6, 0.1]} />
        <meshBasicMaterial color="#ffffff" opacity={0.8} transparent />
      </mesh>
      {Object.values(LANES).map((lane, idx) => (
        <mesh key={idx} position={[lane.position, 0, 0.1]}>
          <boxGeometry args={[1, 0.15, 0.1]} />
          <meshBasicMaterial color={lane.color} opacity={0.6} transparent />
        </mesh>
      ))}
    </group>
  )
}

// レーン表示
function Lanes() {
  return (
    <group>
      {Object.values(LANES).map((lane, idx) => (
        <mesh key={idx} position={[lane.position, 0, -0.5]}>
          <planeGeometry args={[0.9, 30]} />
          <meshBasicMaterial color={lane.color} opacity={0.1} transparent />
        </mesh>
      ))}
    </group>
  )
}

// ゲームシーン本体
function GameSceneContent({ chartData, onGameEnd }) {
  const [notes, setNotes] = useState([])
  const [gameState, setGameState] = useState({
    score: 0,
    combo: 0,
    judgment: null
  })
  const [isPlaying, setIsPlaying] = useState(false)
  
  const noteManagerRef = useRef(null)
  const judgmentSystemRef = useRef(null)
  const startTimeRef = useRef(null)
  const judgmentTimerRef = useRef(null)

  useEffect(() => {
    noteManagerRef.current = new NoteManager(chartData)
    judgmentSystemRef.current = new JudgmentSystem()
  }, [chartData])

  // ゲーム開始
  const startGame = () => {
    setIsPlaying(true)
    startTimeRef.current = Date.now()
    noteManagerRef.current.reset()
    judgmentSystemRef.current.reset()
  }

  // キー入力処理
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isPlaying) {
        if (e.code === 'Space') {
          startGame()
        }
        return
      }

      const laneIndex = Object.values(LANES).findIndex(lane => lane.key === e.code)
      if (laneIndex !== -1) {
        const result = noteManagerRef.current.hitNote(laneIndex)
        
        if (result.found) {
          const judgeResult = judgmentSystemRef.current.judge(result.timingError)
          
          setGameState({
            score: judgeResult.score,
            combo: judgeResult.combo,
            judgment: judgeResult.judgment
          })

          // 判定表示を一定時間後に消す
          if (judgmentTimerRef.current) clearTimeout(judgmentTimerRef.current)
          judgmentTimerRef.current = setTimeout(() => {
            setGameState(prev => ({ ...prev, judgment: null }))
          }, 500)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      if (judgmentTimerRef.current) clearTimeout(judgmentTimerRef.current)
    }
  }, [isPlaying])

  // ゲームループ
  useFrame(() => {
    if (!isPlaying || !noteManagerRef.current) return

    const currentTime = Date.now() - startTimeRef.current
    const activeNotes = noteManagerRef.current.update(0, currentTime)
    setNotes(activeNotes)

    // ゲーム終了判定
    if (currentTime > chartData.duration && activeNotes.length === 0) {
      setIsPlaying(false)
      const results = judgmentSystemRef.current.getResults()
      onGameEnd(results)
    }
  })

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[0, 2, 2]} intensity={0.5} color="#ff69b4" />
      
      <PerspectiveCamera makeDefault position={[0, 0, 12]} />
      
      <Character3D />
      <Lanes />
      <JudgmentLine />
      
      {notes.map(note => (
        <Note key={note.id} lane={note.lane} y={note.y} />
      ))}

      {/* スコア表示 */}
      <Text
        position={[-4, 8, 0]}
        fontSize={0.5}
        color="white"
        anchorX="left"
      >
        SCORE: {gameState.score}
      </Text>
      
      <Text
        position={[4, 8, 0]}
        fontSize={0.5}
        color="white"
        anchorX="right"
      >
        COMBO: {gameState.combo}
      </Text>

      {/* 判定表示 */}
      {gameState.judgment && (
        <Text
          position={[0, 2, 0]}
          fontSize={1}
          color={
            gameState.judgment === 'GREAT' ? '#FFD700' :
            gameState.judgment === 'GOOD' ? '#90EE90' :
            gameState.judgment === 'NORMAL' ? '#87CEEB' : '#FF6B6B'
          }
        >
          {gameState.judgment}
        </Text>
      )}

      {/* スタート表示 */}
      {!isPlaying && (
        <Text
          position={[0, 0, 2]}
          fontSize={0.8}
          color="white"
        >
          Press SPACE to Start
        </Text>
      )}
    </>
  )
}

export default function GameScene({ chartData, onGameEnd }) {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#1a1a2e' }}>
      <Canvas>
        <GameSceneContent chartData={chartData} onGameEnd={onGameEnd} />
      </Canvas>
      
      {/* キーガイド */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '20px',
        color: 'white',
        fontWeight: 'bold'
      }}>
        {Object.entries(LANES).map(([idx, lane]) => (
          <div key={idx} style={{
            padding: '10px 20px',
            background: lane.color,
            borderRadius: '8px',
            fontSize: '20px'
          }}>
            {lane.key.replace('Key', '')}
          </div>
        ))}
      </div>
    </div>
  )
}
