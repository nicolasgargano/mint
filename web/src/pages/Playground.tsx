import { OrbitControls } from "@react-three/drei"
import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import {
  BufferGeometry,
  Float32BufferAttribute,
  PlaneBufferGeometry,
} from "three"
import { noise } from "../util/noise"

export const Playground = () => {
  return (
    <Canvas>
      <Suspense fallback={null}>
        <PlaygroundScene />
      </Suspense>
    </Canvas>
  )
}

const PlaygroundScene = () => {
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
      <mesh
        position={[-1.2, 0, 0]}
        geometry={terrainGeometry(segments, segments)}
      >
        <meshPhysicalMaterial wireframe />
      </mesh>

      <mesh position={[0, 0, 0]} geometry={terrainGeometry(segments, segments)}>
        <meshPhysicalMaterial />
      </mesh>

      <lineSegments
        position={[1.2, 0, 0]}
        geometry={gridGeometry(segments, segments)}
      >
        <lineBasicMaterial />
      </lineSegments>
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

const gridGeometry = (widthSegments: number, depthSegments: number) => {
  const stepX = 1 / widthSegments
  const stepZ = 1 / depthSegments

  const halfSize = 0.5
  const vertices: number[] = []

  for (let x = -halfSize; x <= halfSize; x += stepX) {
    for (let z = -halfSize, countZ = 0; z <= halfSize; z += stepZ, countZ++) {
      const y = terrainNoise(x, 0, z)
      vertices.push(x, y, z)
      if (countZ > 0 && countZ < depthSegments) vertices.push(x, y, z)
    }
  }

  for (let z = -halfSize; z <= halfSize; z += stepZ) {
    for (let x = -halfSize, countX = 0; x <= halfSize; x += stepX, countX++) {
      const y = terrainNoise(x, 0, z)
      vertices.push(x, y, z)
      if (countX > 0 && countX < widthSegments) vertices.push(x, y, z)
    }
  }

  const geometry = new BufferGeometry()
  geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3))

  return geometry
}

const terrainNoise: (x: number, y: number, z: number) => number = noise
