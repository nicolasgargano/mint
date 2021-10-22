import { Box, OrbitControls } from "@react-three/drei"
import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"

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
      <Box />
      <OrbitControls />
    </>
  )
}
