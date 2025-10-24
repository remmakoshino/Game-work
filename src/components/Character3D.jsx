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
      },
      (progress) => {
        console.log('Loading:', (progress.loaded / progress.total * 100).toFixed(2) + '%')
      },
      (error) => console.error('VRM読み込みエラー:', error)
    )
  }, [])

  // アニメーション更新
  useFrame(() => {
    if (vrmRef.current && mixerRef.current) {
      const delta = clockRef.current.getDelta()
      const time = clockRef.current.getElapsedTime()
      
      mixerRef.current.update(delta)
      vrmRef.current.update(delta)

      if (animation === 'dance') {
        // ダンスアニメーション
        vrmRef.current.scene.position.y = -1.5 + Math.sin(time * 4) * 0.15
        vrmRef.current.scene.rotation.y = Math.sin(time * 2) * 0.2

        // 腕の動き（ボーンがある場合）
        if (vrmRef.current.humanoid) {
          const leftArm = vrmRef.current.humanoid.getNormalizedBoneNode('leftUpperArm')
          const rightArm = vrmRef.current.humanoid.getNormalizedBoneNode('rightUpperArm')
          
          if (leftArm) {
            leftArm.rotation.z = Math.sin(time * 4) * 0.5 + 0.3
            leftArm.rotation.x = Math.sin(time * 2) * 0.3
          }
          if (rightArm) {
            rightArm.rotation.z = -Math.sin(time * 4) * 0.5 - 0.3
            rightArm.rotation.x = Math.sin(time * 2 + Math.PI) * 0.3
          }

          // 頭の動き
          const head = vrmRef.current.humanoid.getNormalizedBoneNode('head')
          if (head) {
            head.rotation.y = Math.sin(time * 1.5) * 0.2
            head.rotation.z = Math.sin(time * 2) * 0.1
          }
        }
      } else {
        // アイドルアニメーション
        vrmRef.current.scene.position.y = -1.5 + Math.sin(time * 1.5) * 0.05
        vrmRef.current.scene.rotation.y = Math.sin(time * 0.5) * 0.05

        if (vrmRef.current.humanoid) {
          const head = vrmRef.current.humanoid.getNormalizedBoneNode('head')
          if (head) {
            head.rotation.y = Math.sin(time * 0.8) * 0.1
          }
        }
      }
    }
  })

  return isLoaded && vrmRef.current ? (
    <primitive object={vrmRef.current.scene} />
  ) : null
}
