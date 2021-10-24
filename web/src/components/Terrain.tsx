import {
  BufferGeometry,
  Float32BufferAttribute,
  PlaneBufferGeometry,
} from "three"
import { terrainNoise } from "../util/terrain-noise"
import React, { ReactNode } from "react"
import { GroupProps } from "@react-three/fiber"

export const Terrain = React.forwardRef<
  ReactNode,
  GroupProps & { color: number }
>(({ color, ...props }, ref) => {
  return (
    <group ref={ref} {...props}>
      <mesh geometry={terrainGeometry(24, 24, terrainNoise)}>
        <meshPhysicalMaterial metalness={1} roughness={0} flatShading />
      </mesh>
      <lineSegments geometry={gridGeometry(24, 24)}>
        <lineBasicMaterial color={color} linewidth={10} />
      </lineSegments>
    </group>
  )
})

export const terrainGeometry = (
  widthSegments: number,
  depthSegments: number,
  noise: (x: number, z: number) => number,
) => {
  const geometry = new PlaneBufferGeometry(1, 1, widthSegments, depthSegments)
  geometry.rotateX(-Math.PI / 2)

  for (let i = 0; i < geometry.attributes.position.count; i++) {
    const x = geometry.attributes.position.getX(i) * 2
    const z = geometry.attributes.position.getZ(i) * 2

    const y = noise(x, z)
    geometry.attributes.position.setY(i, y)
  }

  geometry.computeTangents()
  geometry.computeVertexNormals()
  return geometry
}

export const gridGeometry = (widthSegments: number, depthSegments: number) => {
  const stepX = 1 / widthSegments
  const stepZ = 1 / depthSegments

  const hs = 0.5
  const vertices: number[] = []

  for (let x = -hs, countX = 0; countX <= widthSegments; x += stepX, countX++) {
    for (let z = -hs, cZ = 0; cZ <= depthSegments; z += stepZ, cZ++) {
      const applyNoise =
        countX >= widthSegments / 2 && countX <= widthSegments / 2
      const y = applyNoise ? 0 : terrainNoise(x * 2, z * 2)
      vertices.push(x, y, z)
      if (cZ > 0 && cZ < depthSegments) vertices.push(x, y, z)
    }
  }

  for (let z = -hs, countZ = 0; countZ <= depthSegments; z += stepZ, countZ++) {
    for (
      let x = -hs, countX = 0;
      countX <= widthSegments;
      x += stepX, countX++
    ) {
      const applyNoise =
        countX >= widthSegments / 2 && countX <= widthSegments / 2
      const y = applyNoise ? 0 : terrainNoise(x * 2, z * 2)
      vertices.push(x, y, z)
      if (countX > 0 && countX < widthSegments) vertices.push(x, y, z)
    }
  }

  // pipe(
  //   vertices,
  //   array.chunksOf(3),
  //   array.chunksOf(2),
  //   array.map(
  //     ([[a, b, c], [x, y, z]]) =>
  //       `(${a.toFixed(2).padStart(5, "0")}, ${b
  //         .toFixed(2)
  //         .padStart(5, "0")}, ${c.toFixed(2).padStart(5, "0")}) -> (${x
  //         .toFixed(2)
  //         .padStart(5, "0")}, ${y.toFixed(2).padStart(5, "0")}, ${z
  //         .toFixed(2)
  //         .padStart(5, "0")})`,
  //   ),
  //   console.log,
  // )

  const geometry = new BufferGeometry()
  geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3))

  return geometry
}
