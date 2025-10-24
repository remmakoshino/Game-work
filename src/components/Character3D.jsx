import React, { useEffect, useRef } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm'
import * as THREE from 'three'

export default function Character3D({ animation = 'idle' }) {
  const vrmRef = useRef()
  const mixerRef = useRef()
  const clockRef = useRef(new THREE.Clock())

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
        vrm.scene.position.set(0, -1, 0)
        
        // 簡単なアイドルアニメーション用のミキサー
        mixerRef.current = new THREE.AnimationMixer(vrm.scene)
      },
      undefined,
      (error) => console.error('VRM読み込みエラー:', error)
    )
  }, [])

  // アニメーション更新
  useFrame(() => {
    if (vrmRef.current && mixerRef.current) {
      const delta = clockRef.current.getDelta()
      mixerRef.current.update(delta)
      vrmRef.current.update(delta)

      // 簡単な上下アニメーション
      const time = clockRef.current.getElapsedTime()
      vrmRef.current.scene.position.y = -1 + Math.sin(time * 2) * 0.1
      vrmRef.current.scene.rotation.y = Math.sin(time * 0.5) * 0.1
    }
  })

  return vrmRef.current ? <primitive object={vrmRef.current.scene} /> : null
}
