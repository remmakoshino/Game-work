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
    lastSpin: 0,
    walkPhase: 0,
    targetX: 0,
    currentX: 0,
    isWalking: false,
    isRunning: false,
    lastMovement: 0
  })

  // VRMモデルのロード
  useEffect(() => {
    const loader = new GLTFLoader()
    loader.register((parser) => new VRMLoaderPlugin(parser))

    loader.load(
      '/models/test-game.vrm',
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

  // 歩行・走行アニメーション
  const updateWalkRun = (vrm, time, animState) => {
    if (!vrm.humanoid) return
    
    const leftLeg = vrm.humanoid.getNormalizedBoneNode('leftUpperLeg')
    const rightLeg = vrm.humanoid.getNormalizedBoneNode('rightUpperLeg')
    const leftLowerLeg = vrm.humanoid.getNormalizedBoneNode('leftLowerLeg')
    const rightLowerLeg = vrm.humanoid.getNormalizedBoneNode('rightLowerLeg')
    const leftFoot = vrm.humanoid.getNormalizedBoneNode('leftFoot')
    const rightFoot = vrm.humanoid.getNormalizedBoneNode('rightFoot')
    const leftArm = vrm.humanoid.getNormalizedBoneNode('leftUpperArm')
    const rightArm = vrm.humanoid.getNormalizedBoneNode('rightUpperArm')
    const spine = vrm.humanoid.getNormalizedBoneNode('spine')
    
    const speed = animState.isRunning ? 8 : 4 // 走る時は2倍速
    const amplitude = animState.isRunning ? 0.8 : 0.5 // 走る時は振りが大きい
    const armSwing = animState.isRunning ? 0.6 : 0.4
    
    const walkCycle = (time * speed) % (Math.PI * 2)
    
    // 脚の動き
    if (leftLeg) {
      leftLeg.rotation.x = Math.sin(walkCycle) * amplitude
    }
    if (rightLeg) {
      rightLeg.rotation.x = Math.sin(walkCycle + Math.PI) * amplitude
    }
    
    // 膝の曲げ
    if (leftLowerLeg) {
      leftLowerLeg.rotation.x = Math.max(0, -Math.sin(walkCycle) * amplitude * 0.8)
    }
    if (rightLowerLeg) {
      rightLowerLeg.rotation.x = Math.max(0, -Math.sin(walkCycle + Math.PI) * amplitude * 0.8)
    }
    
    // 足首
    if (leftFoot) {
      leftFoot.rotation.x = Math.sin(walkCycle) * 0.3
    }
    if (rightFoot) {
      rightFoot.rotation.x = Math.sin(walkCycle + Math.PI) * 0.3
    }
    
    // 腕の振り
    if (leftArm) {
      leftArm.rotation.x = Math.sin(walkCycle + Math.PI) * armSwing
      leftArm.rotation.z = 0.2
    }
    if (rightArm) {
      rightArm.rotation.x = Math.sin(walkCycle) * armSwing
      rightArm.rotation.z = -0.2
    }
    
    // 体の前傾（走る時）
    if (spine && animState.isRunning) {
      spine.rotation.x = 0.2
    }
    
    // 上下の動き
    const bobAmount = animState.isRunning ? 0.15 : 0.08
    return Math.abs(Math.sin(walkCycle)) * bobAmount
  }

  // 横移動の管理
  const updateMovement = (vrm, time, animState) => {
    const movementInterval = 6.0 // 6秒ごとに移動パターン変更
    
    if (time - animState.lastMovement > movementInterval) {
      animState.lastMovement = time
      
      // ランダムに移動パターンを決定
      const pattern = Math.random()
      
      if (pattern < 0.3) {
        // 歩いて左へ
        animState.isWalking = true
        animState.isRunning = false
        animState.targetX = -2.5
      } else if (pattern < 0.6) {
        // 歩いて右へ
        animState.isWalking = true
        animState.isRunning = false
        animState.targetX = 2.5
      } else if (pattern < 0.75) {
        // 走って左へ
        animState.isWalking = true
        animState.isRunning = true
        animState.targetX = -3.0
      } else if (pattern < 0.9) {
        // 走って右へ
        animState.isWalking = true
        animState.isRunning = true
        animState.targetX = 3.0
      } else {
        // 中央に戻る
        animState.isWalking = true
        animState.isRunning = false
        animState.targetX = 0
      }
    }
    
    // 移動処理
    if (animState.isWalking) {
      const moveSpeed = animState.isRunning ? 0.08 : 0.04
      const diff = animState.targetX - animState.currentX
      
      if (Math.abs(diff) > 0.1) {
        // 移動方向を向く
        if (diff > 0) {
          vrm.scene.rotation.y = THREE.MathUtils.lerp(vrm.scene.rotation.y, Math.PI * 0.15, 0.1)
        } else {
          vrm.scene.rotation.y = THREE.MathUtils.lerp(vrm.scene.rotation.y, -Math.PI * 0.15, 0.1)
        }
        
        animState.currentX += Math.sign(diff) * moveSpeed
        vrm.scene.position.x = animState.currentX
      } else {
        // 到着したら停止して正面を向く
        animState.isWalking = false
        animState.isRunning = false
        vrm.scene.rotation.y = THREE.MathUtils.lerp(vrm.scene.rotation.y, 0, 0.1)
      }
    }
    
    return animState.isWalking
  }
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
      
      // 横移動チェック
      const isMoving = updateMovement(vrm, time, animState)
      
      if (isMoving) {
        // 歩行・走行中
        const walkBob = updateWalkRun(vrm, time, animState)
        vrm.scene.position.y = -1.5 + walkBob
        
        // 移動中も少し表情を
        updateBlink(vrm, time, animState)
        updateMouth(vrm, time, true)
        
        // 走行中の追加演出
        if (animState.isRunning) {
          setExpression(vrm, 'happy', 0.8)
          // 髪が流れる演出（頭を少し後ろに）
          if (vrm.humanoid) {
            const head = vrm.humanoid.getNormalizedBoneNode('head')
            if (head) {
              head.rotation.x = 0.1
            }
          }
        }
      } else {
        // ステージダンス中
        
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
      }
      
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
