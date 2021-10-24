import {
  Box,
  Icosahedron,
  OrbitControls,
  Plane,
  Tetrahedron,
} from "@react-three/drei"
import { Suspense, useLayoutEffect, useRef } from "react"
import { Canvas, useThree } from "@react-three/fiber"
import { DirectionalLight } from "three"
import { useControls } from "leva"
import { array, nonEmptyArray } from "fp-ts"

export const Home = () => {
  return (
    <Canvas>
      <Suspense fallback={null}>
        <HomeScene />
      </Suspense>
    </Canvas>
  )
}

const HomeScene = () => {
  const directionalLightRef = useRef<DirectionalLight>()

  const cameraControls = useControls("Camera Position", {
    height: 1,
    lookAt: -10,
  })

  const state = useThree()
  useLayoutEffect(() => {
    state.camera.position.set(0, cameraControls.height, 5)
    state.camera.lookAt(0, 0, cameraControls.lookAt)
  })

  return (
    <>
      <directionalLight ref={directionalLightRef} position={[0, 4, 10]} />
      {directionalLightRef.current && (
        <directionalLightHelper args={[directionalLightRef.current]} />
      )}
      <ScrollingTerrain />
      {/*<OrbitControls />*/}
    </>
  )
}

const ScrollingTerrain = () => {
  const planeControls = useControls("Plane Controls", {
    size: 20,
    divisions: { value: 24, min: 10, max: 100, step: 2 },
  })

  return (
    <group>
      <gridHelper
        args={[planeControls.size, planeControls.divisions, redish, redish]}
      />
      <Plane
        args={[50, 50]}
        position={[0, -0.00001, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <meshBasicMaterial color={"black"} />
      </Plane>
      {nonEmptyArray.range(0, 10).map((_, i) => (
        <>
          <Icosahedron scale={[1, 3, 1]} position={[-5, 0, (i - 5) * 2]}>
            <meshPhysicalMaterial
              metalness={1}
              roughness={0}
              color={0x440000}
            />
          </Icosahedron>
          <Icosahedron scale={[1, 3, 1]} position={[-5, 0, (i - 5) * 2]}>
            <meshBasicMaterial wireframe color={redish} />
          </Icosahedron>
          <Icosahedron scale={[1, 3, 1]} position={[5, 0, (i - 5) * 2]}>
            <meshPhysicalMaterial
              metalness={1}
              roughness={0}
              color={0x440000}
            />
          </Icosahedron>
          <Icosahedron scale={[1, 3, 1]} position={[5, 0, (i - 5) * 2]}>
            <meshBasicMaterial wireframe color={redish} />
          </Icosahedron>
        </>
      ))}
    </group>
  )
}
