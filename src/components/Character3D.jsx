import React, { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm'
import * as THREE from 'three'

export default function Character3D({ animation = 'idle' }) {
  const vrmRef = useRef()
  const mixerRef = useRef()
  const clockRef = useRef(new THREE.Clock())
  const [isLoaded, setIsLoaded] = useState(false)
  
  // アニメーション状態管理
  const animStateRef = useRef({
    blinkTimer: 0,
    winkTimer: 0,
    mouthTimer: 0,
    jumpPhase: 0,
    spinTimer: 0,
    dancePattern: 0,
    lastBlink: 0,
    lastWink: 0,
    lastSpin: 0
  })

  // VRMモデルのロード
  useEffect(() => {
    const loader = new GLTFLoader()
    loader.register((parser) => new VRMLoaderPlugin(parser))

    loader.load(
      '/public/models/test-game.vrm',
      (gltf) => {
        const vrm = gltf.userData.vrm
        VRMUtils.removeUnnecessaryJoints(gltf.scene)
        
        vrmRef.current = vrm
        vrm.scene.position.set(0, -1.5, -2)
        vrm.scene.scale.set(1, 1, 1)
        
        mixerRef.current = new THREE.AnimationMixer(vrm.scene)
        setIsLoaded(true)
        
        console.log('VRM Loaded. Available expressions:', 
          vrm.expressionManager ? Object.keys(vrm.expressionManager.expressionMap) : 'None')
      },
      (progress) => {
        console.log('Loading:', (progress.loaded / progress.total * 100).toFixed(2) + '%')
      },
      (error) => console.error('VRM読み込みエラー:', error)
    )
  }, [])

  // 表情制御関数
  const setExpression = (vrm, expressionName, weight) => {
    if (!vrm.expressionManager) return
    
    try {
      const expression = vrm.expressionManager.getExpression(expressionName)
      if (expression) {
        vrm.expressionManager.setValue(expressionName, weight)
      }
    } catch (e) {
      // Expression not available
    }
  }

  // まばたきアニメーション
  const updateBlink = (vrm, time, animState) => {
    const blinkInterval = 3.0 // 3秒ごとにまばたき
    
    if (time - animState.lastBlink > blinkInterval) {
      animState.lastBlink = time
      animState.blinkTimer = 0.3 // まばたき時間
    }
    
    if (animState.blinkTimer > 0) {
      const blinkProgress = (0.3 - animState.blinkTimer) / 0.3
      const blinkWeight = blinkProgress < 0.5 
        ? blinkProgress * 2 
        : (1 - blinkProgress) * 2
      
      setExpression(vrm, 'blink', blinkWeight)
      setExpression(vrm, 'blinkLeft', blinkWeight)
      setExpression(vrm, 'blinkRight', blinkWeight)
      animState.blinkTimer -= 0.016
    } else {
      setExpression(vrm, 'blink', 0)
      setExpression(vrm, 'blinkLeft', 0)
      setExpression(vrm, 'blinkRight', 0)
    }
  }

  // ウィンクアニメーション（ランダム）
  const updateWink = (vrm, time, animState) => {
    const winkInterval = 8.0 // 8秒ごとにウィンク
    
    if (time - animState.lastWink > winkInterval && Math.random() > 0.5) {
      animState.lastWink = time
      animState.winkTimer = 0.5
    }
    
    if (animState.winkTimer > 0) {
      const winkProgress = (0.5 - animState.winkTimer) / 0.5
      const winkWeight = winkProgress < 0.5 
        ? winkProgress * 2 
        : (1 - winkProgress) * 2
      
      // 右目ウィンク
      setExpression(vrm, 'blinkRight', winkWeight)
      setExpression(vrm, 'happy', winkWeight * 0.5)
      animState.winkTimer -= 0.016
    }
  }

  // 口パクアニメーション（リズムに合わせて）
  const updateMouth = (vrm, time, isDancing) => {
    if (isDancing) {
      // 4拍子のリズムで口パク
      const beat = (time * 2) % 1
      const mouthWeight = Math.sin(beat * Math.PI * 2) * 0.5 + 0.5
      
      setExpression(vrm, 'aa', mouthWeight * 0.6)
      setExpression(vrm, 'oh', mouthWeight * 0.3)
      
      // たまに笑顔
      if (Math.floor(time * 2) % 8 === 0) {
        setExpression(vrm, 'happy', 0.7)
      } else {
        setExpression(vrm, 'happy', 0.3)
      }
    } else {
      setExpression(vrm, 'aa', 0)
      setExpression(vrm, 'happy', 0.2)
    }
  }

  // ジャンプアニメーション
  const updateJump = (time, baseY) => {
    const jumpCycle = (time * 2) % 4 // 4秒サイクル
    
    if (jumpCycle < 0.3) {
      // ジャンプ上昇
      const jumpProgress = jumpCycle / 0.3
      return baseY + Math.sin(jumpProgress * Math.PI) * 0.5
    } else if (jumpCycle > 3.5) {
      // 小さいジャンプ予備動作
      return baseY - 0.05
    }
    
    // 通常の上下動
    return baseY + Math.sin(time * 4) * 0.1
  }

  // 回転アニメーション（決め）
  const updateSpin = (vrm, time, animState) => {
    const spinInterval = 12.0 // 12秒ごとに回転
    
    if (time - animState.lastSpin > spinInterval) {
      animState.lastSpin = time
      animState.spinTimer = 1.0 // 1秒で一回転
    }
    
    if (animState.spinTimer > 0) {
      const spinProgress = 1.0 - animState.spinTimer
      const spinRotation = spinProgress * Math.PI * 2
      
      vrm.scene.rotation.y = spinRotation
      
      // 回転中は腕を広げる
      if (vrm.humanoid) {
        const leftArm = vrm.humanoid.getNormalizedBoneNode('leftUpperArm')
        const rightArm = vrm.humanoid.getNormalizedBoneNode('rightUpperArm')
        
        if (leftArm) {
          leftArm.rotation.z = 0.5 + Math.sin(spinProgress * Math.PI) * 0.3
        }
        if (rightArm) {
          rightArm.rotation.z = -0.5 - Math.sin(spinProgress * Math.PI) * 0.3
        }
      }
      
      animState.spinTimer -= 0.016
      return true
    }
    
    return false
  }

  // アイドルダンスの振り付けパターン
  const updateIdolDance = (vrm, time, animState) => {
    const beat = time * 2 // BPM 120相当
    const pattern = Math.floor(beat / 4) % 6 // 6パターンのループ
    
    if (!vrm.humanoid) return
    
    const leftArm = vrm.humanoid.getNormalizedBoneNode('leftUpperArm')
    const rightArm = vrm.humanoid.getNormalizedBoneNode('rightUpperArm')
    const leftLowerArm = vrm.humanoid.getNormalizedBoneNode('leftLowerArm')
    const rightLowerArm = vrm.humanoid.getNormalizedBoneNode('rightLowerArm')
    const leftHand = vrm.humanoid.getNormalizedBoneNode('leftHand')
    const rightHand = vrm.humanoid.getNormalizedBoneNode('rightHand')
    const head = vrm.humanoid.getNormalizedBoneNode('head')
    const spine = vrm.humanoid.getNormalizedBoneNode('spine')
    const hips = vrm.humanoid.getNormalizedBoneNode('hips')
    
    const localBeat = beat % 4
    const t = localBeat / 4 // 0-1の進行度
    
    switch (pattern) {
      case 0: // 両手を上げる
        if (leftArm) {
          leftArm.rotation.z = 0.3 + Math.sin(beat * Math.PI) * 0.3
          leftArm.rotation.x = -1.0 + Math.sin(beat * Math.PI) * 0.3
        }
        if (rightArm) {
          rightArm.rotation.z = -0.3 - Math.sin(beat * Math.PI) * 0.3
          rightArm.rotation.x = -1.0 + Math.sin(beat * Math.PI) * 0.3
        }
        if (leftLowerArm) leftLowerArm.rotation.y = -0.5
        if (rightLowerArm) rightLowerArm.rotation.y = 0.5
        break
        
      case 1: // ハートポーズ
        if (leftArm) {
          leftArm.rotation.z = 0.8
          leftArm.rotation.x = -0.5
          leftArm.rotation.y = 0.3
        }
        if (rightArm) {
          rightArm.rotation.z = -0.8
          rightArm.rotation.x = -0.5
          rightArm.rotation.y = -0.3
        }
        if (leftLowerArm) leftLowerArm.rotation.y = -1.0
        if (rightLowerArm) rightLowerArm.rotation.y = 1.0
        if (head) head.rotation.z = Math.sin(beat * Math.PI) * 0.15
        break
        
      case 2: // 片手を上げてウェーブ
        if (leftArm) {
          leftArm.rotation.z = 0.3 + Math.sin(beat * Math.PI * 2) * 0.4
          leftArm.rotation.x = -1.5
        }
        if (rightArm) {
          rightArm.rotation.z = -0.5
          rightArm.rotation.x = 0.3
        }
        if (leftLowerArm) leftLowerArm.rotation.y = Math.sin(beat * Math.PI * 2) * -0.5
        break
        
      case 3: // 腰を振る
        if (leftArm) {
          leftArm.rotation.z = 0.5
          leftArm.rotation.x = 0.5
        }
        if (rightArm) {
          rightArm.rotation.z = -0.5
          rightArm.rotation.x = 0.5
        }
        if (hips) {
          hips.rotation.y = Math.sin(beat * Math.PI * 2) * 0.3
          hips.rotation.z = Math.sin(beat * Math.PI * 2) * 0.2
        }
        break
        
      case 4: // 指差しポーズ
        if (leftArm) {
          leftArm.rotation.z = 0.3
          leftArm.rotation.x = 0.3
          leftArm.rotation.y = -0.5
        }
        if (rightArm) {
          rightArm.rotation.z = -0.8
          rightArm.rotation.x = -0.3
          rightArm.rotation.y = Math.sin(beat * Math.PI) * 0.3
        }
        if (rightLowerArm) rightLowerArm.rotation.y = 0.3
        break
        
      case 5: // ツインテール揺らし（頭を振る）
        if (leftArm) {
          leftArm.rotation.z = 0.5 + Math.sin(beat * Math.PI * 4) * 0.2
          leftArm.rotation.x = 0.3
        }
        if (rightArm) {
          rightArm.rotation.z = -0.5 - Math.sin(beat * Math.PI * 4) * 0.2
          rightArm.rotation.x = 0.3
        }
        if (head) {
          head.rotation.y = Math.sin(beat * Math.PI * 2) * 0.4
          head.rotation.z = Math.sin(beat * Math.PI * 4) * 0.2
        }
        break
    }
    
    // 全体的な体の揺れ
    if (spine) {
      spine.rotation.y = Math.sin(beat * Math.PI) * 0.1
      spine.rotation.z = Math.sin(beat * Math.PI * 2) * 0.05
    }
    
    // 頭の動き（振り付けに合わせて）
    if (head && pattern !== 5) {
      head.rotation.y = Math.sin(beat * Math.PI) * 0.15
      head.rotation.x = Math.sin(beat * Math.PI * 2) * 0.05
    }
    
    // 手の動き
    if (leftHand) {
      leftHand.rotation.z = Math.sin(beat * Math.PI * 2) * 0.2
    }
    if (rightHand) {
      rightHand.rotation.z = -Math.sin(beat * Math.PI * 2) * 0.2
    }
  }

  // アイドルモーション（待機）
  const updateIdleMotion = (vrm, time) => {
    if (!vrm.humanoid) return
    
    const head = vrm.humanoid.getNormalizedBoneNode('head')
    const spine = vrm.humanoid.getNormalizedBoneNode('spine')
    const leftArm = vrm.humanoid.getNormalizedBoneNode('leftUpperArm')
    const rightArm = vrm.humanoid.getNormalizedBoneNode('rightUpperArm')
    
    // ゆっくりとした呼吸
    if (spine) {
      spine.rotation.x = Math.sin(time * 1.5) * 0.02
    }
    
    // 自然な頭の動き
    if (head) {
      head.rotation.y = Math.sin(time * 0.7) * 0.1
      head.rotation.x = Math.sin(time * 0.5) * 0.03
    }
    
    // リラックスした腕
    if (leftArm) {
      leftArm.rotation.z = 0.1 + Math.sin(time * 0.8) * 0.05
    }
    if (rightArm) {
      rightArm.rotation.z = -0.1 - Math.sin(time * 0.8) * 0.05
    }
  }

  // メインアニメーションループ
  useFrame(() => {
    if (!vrmRef.current || !mixerRef.current) return
    
    const delta = clockRef.current.getDelta()
    const time = clockRef.current.getElapsedTime()
    const vrm = vrmRef.current
    const animState = animStateRef.current
    
    mixerRef.current.update(delta)
    vrm.update(delta)

    // 回転演出チェック
    const isSpinning = updateSpin(vrm, time, animState)

    if (animation === 'dance' && !isSpinning) {
      // ダンスモード
      
      // ジャンプ
      vrm.scene.position.y = updateJump(time, -1.5)
      
      // 体の向き（基本正面、時々振り向く）
      const turnCycle = Math.floor(time * 2) % 16
      if (turnCycle < 2) {
        vrm.scene.rotation.y = Math.sin(time * Math.PI * 4) * 0.3
      } else {
        vrm.scene.rotation.y = Math.sin(time * 0.5) * 0.1
      }
      
      // アイドルダンスの振り付け
      updateIdolDance(vrm, time, animState)
      
      // 表情
      updateBlink(vrm, time, animState)
      updateWink(vrm, time, animState)
      updateMouth(vrm, time, true)
      
    } else if (!isSpinning) {
      // アイドルモード
      vrm.scene.position.y = -1.5 + Math.sin(time * 1.5) * 0.05
      vrm.scene.rotation.y = Math.sin(time * 0.5) * 0.05
      
      updateIdleMotion(vrm, time)
      updateBlink(vrm, time, animState)
      updateMouth(vrm, time, false)
    }
  })

  return isLoaded && vrmRef.current ? (
    <primitive object={vrmRef.current.scene} />
  ) : null
}
