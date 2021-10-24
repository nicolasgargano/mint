import { OrbitControls } from "@react-three/drei"
import { Suspense, useLayoutEffect, useRef } from "react"
import { Canvas, useThree } from "@react-three/fiber"
import { RectAreaLight, SpotLight, SpotLightHelper } from "three"
import { terrainNoise } from "../util/terrain-noise"
import { gridGeometry, terrainGeometry } from "../components/Terrain"
import { useControls } from "leva"
import { redish } from "../util/colors"
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper"
import { TransformControls } from "three/examples/jsm/controls/TransformControls"

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
  const three = useThree()

  useLayoutEffect(() => {
    // const light = new RectAreaLight(redish, 10, 1, 1)
    // light.position.set(0, 2, 0)
    // light.lookAt(0, 0, 0)
    //
    // const helper = new RectAreaLightHelper(light)
    //
    // three.scene.add(light)
    // three.scene.add(helper)

    const light = new SpotLight(redish, 10, 100)
    light.position.set(0, 2, 0)
    light.lookAt(0, 0, 0)

    const helper = new SpotLightHelper(light)
    const transform = new TransformControls(three.camera, three.gl.domElement)
    transform.attach(light)

    three.scene.add(light)
    three.scene.add(helper)
    three.scene.add(transform)
  })

  return (
    <>
      <Terrain />
      <OrbitControls />
    </>
  )
}

const Terrain = () => {
  const { segments } = useControls("Segments", {
    segments: { value: 5, min: 1, step: 1 },
  })

  return (
    <group>
      <mesh
        position={[-1.2, 0, 0]}
        geometry={terrainGeometry(segments, segments, terrainNoise)}
      >
        <meshPhysicalMaterial wireframe />
      </mesh>

      <group scale={1}>
        <mesh geometry={terrainGeometry(segments, segments, terrainNoise)}>
          <meshPhysicalMaterial flatShading metalness={1} roughness={0} />
        </mesh>
        <lineSegments
          position={[0, 0.001, 0]}
          geometry={gridGeometry(segments, segments)}
        >
          <lineBasicMaterial color={redish} />
        </lineSegments>
      </group>

      <lineSegments
        position={[1.2, 0, 0]}
        geometry={gridGeometry(segments, segments)}
      >
        <lineBasicMaterial />
      </lineSegments>
    </group>
  )
}
