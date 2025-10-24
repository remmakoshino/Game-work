import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, Text } from '@react-three/drei'
import * as THREE from 'three'
import Character3D from './Character3D'
import { LANES, GAME_CONFIG } from '../utils/constants'
import { NoteManager } from '../game/NoteManager'
import { JudgmentSystem } from '../game/JudgmentSystem'

// 円形ノーツコンポーネント（アイドルゲーム風）
function Note({ lane, y, hit }) {
  const meshRef = useRef()
  const laneData = LANES[lane]

  useFrame(() => {
    if (meshRef.current && !hit) {
      meshRef.current.rotation.z += 0.05
    }
  })

  if (hit) return null

  return (
    <group position={[laneData.position, y, 0]}>
      <mesh ref={meshRef}>
        <cylinderGeometry args={[0.4, 0.4, 0.1, 32]} />
        <meshStandardMaterial
          color={laneData.color}
          emissive={laneData.color}
          emissiveIntensity={0.5}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>
      {/* 内側の星 */}
      <mesh position={[0, 0, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.2, 5]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  )
}

// 判定ライン（円形のターゲット）
function JudgmentLine() {
  return (
    <group position={[0, GAME_CONFIG.JUDGMENT_LINE_Y, 0]}>
      {Object.values(LANES).map((lane, idx) => (
        <group key={idx} position={[lane.position, 0, 0]}>
          {/* 外側の円 */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.45, 0.55, 32]} />
            <meshBasicMaterial color={lane.color} opacity={0.8} transparent />
          </mesh>
          {/* 内側の円 */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.4, 32]} />
            <meshBasicMaterial color={lane.color} opacity={0.2} transparent />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// レーン表示（ガイドライン）
function Lanes() {
  return (
    <group>
      {Object.values(LANES).map((lane, idx) => (
        <mesh key={idx} position={[lane.position, 0, -0.5]}>
          <planeGeometry args={[0.05, 30]} />
          <meshBasicMaterial color={lane.color} opacity={0.3} transparent />
        </mesh>
      ))}
    </group>
  )
}

// ヒットエフェクト
function HitEffect({ lane, show }) {
  const meshRef = useRef()
  const [scale, setScale] = useState(1)

  useEffect(() => {
    if (show) {
      setScale(1)
      const timer = setTimeout(() => setScale(0), 300)
      return () => clearTimeout(timer)
    }
  }, [show])

  if (!show) return null

  const laneData = LANES[lane]

  return (
    <mesh
      ref={meshRef}
      position={[laneData.position, GAME_CONFIG.JUDGMENT_LINE_Y, 0.2]}
      rotation={[Math.PI / 2, 0, 0]}
      scale={[scale * 1.5, scale * 1.5, 1]}
    >
      <ringGeometry args={[0.4, 0.6, 32]} />
      <meshBasicMaterial color="#ffffff" opacity={0.8 * scale} transparent />
    </mesh>
  )
}

// ゲームシーン本体
function GameSceneContent({ chartData, songTitle, difficulty, onGameEnd }) {
  const [notes, setNotes] = useState([])
  const [gameState, setGameState] = useState({
    score: 0,
    combo: 0,
    judgment: null,
    judgmentColor: '#ffffff'
  })
  const [isPlaying, setIsPlaying] = useState(false)
  const [hitEffects, setHitEffects] = useState([false, false, false, false])
  const [comboScale, setComboScale] = useState(1)
  
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

  // コンボ演出
  useEffect(() => {
    if (gameState.combo > 0) {
      setComboScale(1.2)
      const timer = setTimeout(() => setComboScale(1), 100)
      return () => clearTimeout(timer)
    }
  }, [gameState.combo])

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
        // ヒットエフェクト表示
        setHitEffects(prev => {
          const newEffects = [...prev]
          newEffects[laneIndex] = true
          setTimeout(() => {
            setHitEffects(p => {
              const ne = [...p]
              ne[laneIndex] = false
              return ne
            })
          }, 300)
          return newEffects
        })

        const result = noteManagerRef.current.hitNote(laneIndex)
        
        if (result.found) {
          const judgeResult = judgmentSystemRef.current.judge(result.timingError)
          
          const judgmentColors = {
            GREAT: '#FFD700',
            GOOD: '#90EE90',
            NORMAL: '#87CEEB',
            MISS: '#FF6B6B'
          }

          setGameState({
            score: judgeResult.score,
            combo: judgeResult.combo,
            judgment: judgeResult.judgment,
            judgmentColor: judgmentColors[judgeResult.judgment]
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
      
      // フルコンボ判定
      const totalNotes = chartData.notes.length
      const hitNotes = results.judgments.GREAT + results.judgments.GOOD + results.judgments.NORMAL
      results.isFullCombo = hitNotes === totalNotes
      results.totalNotes = totalNotes
      
      onGameEnd(results)
    }
  })

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[0, 0, 3]} intensity={1} color="#ff69b4" />
      <pointLight position={[-3, 2, 2]} intensity={0.5} color="#4ECDC4" />
      <pointLight position={[3, 2, 2]} intensity={0.5} color="#FFE66D" />
      
      <PerspectiveCamera makeDefault position={[0, -2, 10]} rotation={[0.2, 0, 0]} />
      
      <Character3D animation={isPlaying ? 'dance' : 'idle'} />
      <Lanes />
      <JudgmentLine />
      
      {notes.map(note => (
        <Note key={note.id} lane={note.lane} y={note.y} hit={note.hit} />
      ))}

      {/* ヒットエフェクト */}
      {hitEffects.map((show, idx) => (
        <HitEffect key={idx} lane={idx} show={show} />
      ))}

      {/* UI表示 */}
      <Text
        position={[-5, 9, 0]}
        fontSize={0.4}
        color="white"
        anchorX="left"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {songTitle}
      </Text>

      <Text
        position={[-5, 8.3, 0]}
        fontSize={0.3}
        color="#FFD700"
        anchorX="left"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {difficulty}
      </Text>
      
      <Text
        position={[5, 9, 0]}
        fontSize={0.5}
        color="white"
        anchorX="right"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {gameState.score}
      </Text>
      
      <Text
        position={[5, 8.2, 0]}
        fontSize={0.3}
        color="#87CEEB"
        anchorX="right"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        SCORE
      </Text>

      {/* コンボ表示 */}
      {gameState.combo > 0 && (
        <>
          <Text
            position={[0, 6, 0]}
            fontSize={1.2 * comboScale}
            color="#FFD700"
            outlineWidth={0.05}
            outlineColor="#000000"
          >
            {gameState.combo}
          </Text>
          <Text
            position={[0, 4.8, 0]}
            fontSize={0.5}
            color="white"
            outlineWidth={0.02}
            outlineColor="#000000"
          >
            COMBO
          </Text>
        </>
      )}

      {/* 判定表示 */}
      {gameState.judgment && (
        <Text
          position={[0, 1, 0]}
          fontSize={1.5}
          color={gameState.judgmentColor}
          outlineWidth={0.05}
          outlineColor="#000000"
        >
          {gameState.judgment}
        </Text>
      )}

      {/* スタート表示 */}
      {!isPlaying && (
        <Text
          position={[0, -1, 1]}
          fontSize={0.8}
          color="white"
          outlineWidth={0.03}
          outlineColor="#000000"
        >
          Press SPACE to Start
        </Text>
      )}
    </>
  )
}

export default function GameScene({ chartData, songTitle, difficulty, onGameEnd }) {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0a0a1a' }}>
      <Canvas>
        <GameSceneContent
          chartData={chartData}
          songTitle={songTitle}
          difficulty={difficulty}
          onGameEnd={onGameEnd}
        />
      </Canvas>
      
      {/* キーガイド */}
      <div style={{
        position: 'absolute',
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '20px'
      }}>
        {Object.entries(LANES).map(([idx, lane]) => (
          <div key={idx} style={{
            width: '70px',
            height: '70px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: lane.color,
            borderRadius: '50%',
            fontSize: '24px',
            fontWeight: 'bold',
            color: 'white',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
            border: '3px solid rgba(255,255,255,0.5)'
          }}>
            {lane.key.replace('Key', '')}
          </div>
        ))}
      </div>
    </div>
  )
}
