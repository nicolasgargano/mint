import { Canvas, MeshProps } from "@react-three/fiber"
import { FC, Suspense, useLayoutEffect, useRef } from "react"
import { terrainGeometry } from "../components/Terrain"
import {
  fract,
  mask,
  ortic,
  quartic,
  random2D,
  simplex,
  smoothstep,
  terrainNoise,
} from "../util/terrain-noise"
import { OrbitControls, Plane, Sphere, Text } from "@react-three/drei"
import { useControls } from "leva"
import {
  DataTexture,
  DoubleSide,
  MathUtils,
  MeshBasicMaterial,
  RGBFormat,
} from "three"
import SimplexNoise from "simplex-noise"
import { redish } from "../util/colors"

export const Noise = () => {
  return (
    <Canvas>
      <Suspense fallback={null}>
        <NoiseScene />
      </Suspense>
      <OrbitControls />
    </Canvas>
  )
}

const NoiseScene = () => {
  const { sx, sz } = useControls("noise", {
    sx: { value: 24, step: 1, min: 1 },
    sz: { value: 24, step: 1, min: 1 },
  })

  return (
    <>
      <group>
        <mesh geometry={terrainGeometry(sx, sz, terrainNoise)}>
          <meshBasicMaterial wireframe color={redish} />
        </mesh>
      </group>
      <group rotation={[0, Math.PI, Math.PI]} position={[0, 1, -2]}>
        <NoisePreview segments={[sx + 1, sz + 1]} noise={terrainNoise} />
      </group>
      <group rotation={[0, Math.PI, Math.PI]} position={[-1.5, 1, -2]}>
        <NoisePreview segments={[sx + 1, sz + 1]} noise={simplex} />
      </group>
      <group rotation={[0, Math.PI, Math.PI]} position={[1.5, 1, -2]}>
        <NoisePreview segments={[sx + 1, sz + 1]} noise={mask} />
      </group>
    </>
  )
}

const NoisePreview: FC<
  MeshProps & {
    segments: [number, number]
    noise: (x: number, z: number) => number
  }
> = ({ noise, segments }) => {
  const noisePlaneRef = useRef<MeshBasicMaterial>()

  useLayoutEffect(() => {
    // create a buffer with color data

    const width = segments[0]
    const height = segments[1]

    const size = width * height
    const data = new Uint8Array(3 * size)

    for (let i = 0; i < size; i++) {
      const stride = i * 3
      const x = i % width
      const z = Math.floor(i / width)

      const nx = MathUtils.mapLinear(x, 0, width - 1, -1, 1)
      const nz = MathUtils.mapLinear(z, 0, height - 1, -1, 1)
      const n = noise(nx, nz)

      const c = n * 255

      data[stride] = c
      data[stride + 1] = c
      data[stride + 2] = c
    }

    // used the buffer to create a DataTexture

    const texture = new DataTexture(data, width, height, RGBFormat)
    if (noisePlaneRef.current) noisePlaneRef.current.map = texture
  })

  return (
    <>
      <Plane>
        <meshBasicMaterial side={DoubleSide} ref={noisePlaneRef} />
      </Plane>
    </>
  )
}
