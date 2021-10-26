import { OrbitControls } from "@react-three/drei"
import { Suspense, useCallback, useLayoutEffect, useRef } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import {
  Group,
  PointLight,
  PointLightHelper,
  SpotLight,
  SpotLightHelper,
  Vector2,
} from "three"
import { useControls } from "leva"
import { Terrain } from "../components/Terrain"
import { redish } from "../util/colors"
// @ts-ignore
import { BlendFunction, BlurPass, Resizer, KernelSize } from "postprocessing"
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
} from "@react-three/postprocessing"

export const Home = () => {
  return (
    <Canvas>
      <fog attach="fog" args={["black", 15, 20]} />
      <Suspense fallback={null}>
        <HomeScene />
      </Suspense>
      <EffectComposer>
        <Bloom
          intensity={1.0} // The bloom intensity.
          width={Resizer.AUTO_SIZE} // render width
          height={Resizer.AUTO_SIZE} // render height
          kernelSize={KernelSize.LARGE} // blur kernel size
          luminanceThreshold={0.9} // luminance threshold. Raise this value to mask out darker elements in the scene.
          luminanceSmoothing={0.025} // smoothness of the luminance threshold. Range is [0, 1]
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new Vector2(0.001, 0.001)}
        />
      </EffectComposer>
    </Canvas>
  )
}

const HomeScene = () => {
  const cameraControls = useControls("Camera Position", {
    height: 1,
    lookAt: -10,
  })

  const t = useThree()
  useLayoutEffect(() => {
    const cameraZ = 5
    t.camera.position.set(0, cameraControls.height, cameraZ)
    t.camera.lookAt(0, 0, cameraControls.lookAt - cameraZ - 10)
  }, [cameraControls])

  useLayoutEffect(() => {
    const light = new SpotLight(redish, 10, 100)
    light.position.set(0, 2, 5)
    light.lookAt(0, 0, 0)

    const helper = new SpotLightHelper(light)

    // t.scene.add(light)
    // t.scene.add(helper)

    // const dir = new DirectionalLight(redish, 1)
    // const dirHelper = new DirectionalLightHelper(dir)
    // dir.position.set(0, 2, -1)
    // dir.rotation.set(Math.PI / 2 - 0.25, 0, 0)
    // t.scene.add(dir)
    // t.scene.add(dirHelper)

    const point = new PointLight(redish, 1)
    const pointHelper = new PointLightHelper(point)
    point.position.copy(t.camera.position)
    t.scene.add(point)
    t.scene.add(pointHelper)

    return () => {
      // t.scene.remove(light, helper)
      // t.scene.remove(dir, dirHelper)
      t.scene.remove(point, pointHelper)
    }
  }, [])

  return (
    <>
      <ScrollingTerrain />
      <OrbitControls />
    </>
  )
}

const ScrollingTerrain = () => {
  const terrainDepth = 10
  const terrain1Ref = useRef<Group>()
  const terrain2Ref = useRef<Group>()
  const terrain3Ref = useRef<Group>()

  const moveTerrains = useCallback(() => {
    if (terrain1Ref.current) {
      terrain1Ref.current.position.z += 0.05
      if (terrain1Ref.current.position.z >= terrainDepth) {
        terrain1Ref.current.position.z = -terrainDepth * 2
        terrain1Ref.current.scale.z *= -1
      }
    }
    if (terrain2Ref.current) {
      terrain2Ref.current.position.z += 0.05
      if (terrain2Ref.current.position.z >= terrainDepth) {
        terrain2Ref.current.position.z = -terrainDepth * 2
        terrain2Ref.current.scale.z *= -1
      }
    }
    if (terrain3Ref.current) {
      terrain3Ref.current.position.z += 0.05
      if (terrain3Ref.current.position.z >= terrainDepth) {
        terrain3Ref.current.position.z = -terrainDepth * 2
        terrain3Ref.current.scale.z *= -1
      }
    }
  }, [terrainDepth])

  useFrame(moveTerrains)

  return (
    <>
      <Terrain
        color={redish}
        scale={[terrainDepth, 5, terrainDepth]}
        ref={terrain1Ref}
        position={[0, 0, 0]}
      />
      <Terrain
        color={redish}
        scale={[terrainDepth, 5, -terrainDepth]}
        ref={terrain2Ref}
        position={[0, 0, -terrainDepth]}
      />
      <Terrain
        color={redish}
        scale={[terrainDepth, 5, terrainDepth]}
        ref={terrain3Ref}
        position={[0, 0, -terrainDepth * 2]}
      />
    </>
  )
}
