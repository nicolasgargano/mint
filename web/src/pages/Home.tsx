import { OrbitControls } from "@react-three/drei"
import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { PlaneBufferGeometry } from "three"
import { noise } from "../util/noise"

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
  return (
    <>
      <ambientLight />
      <Terrain />
      <OrbitControls />
    </>
  )
}

const segments = 4

const Terrain = () => {
  return (
    <group>
      <mesh position={[0, 0, 0]} geometry={terrainGeometry(segments, segments)}>
        <meshPhysicalMaterial />
      </mesh>
    </group>
  )
}

const terrainGeometry = (widthSegments: number, depthSegments: number) => {
  const geometry = new PlaneBufferGeometry(1, 1, widthSegments, depthSegments)
  geometry.rotateX(-Math.PI / 2)

  for (let i = 0; i < geometry.attributes.position.count; i++) {
    const x = geometry.attributes.position.getX(i)
    const z = geometry.attributes.position.getZ(i)

    const y = terrainNoise(x, 0, z)
    geometry.attributes.position.setY(i, y)
  }

  geometry.computeTangents()
  geometry.computeVertexNormals()
  return geometry
}

const terrainNoise: (x: number, y: number, z: number) => number = noise
