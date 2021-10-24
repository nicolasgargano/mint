import SimplexNoise from "simplex-noise"

// Terrain
const simplexNoise = new SimplexNoise("seed")
const scale = 1

export const simplex = (x: number, z: number) => {
  return simplexNoise.noise2D(x * scale, z * scale) / 2 + 0.5
}

export const mask = (x: number, z: number) => {
  if (x >= 0.5) return smoothstep(x - 0.5 / 0.33)
  if (x <= -0.5) return smoothstep(x + 0.5 / -0.33)
  else return 0
}

export const terrainNoise = (x: number, z: number) => {
  const mult = quartic(x)
  const mask = simplex(x, z) * mult

  const s = 10
  return (mask * (simplex(x * s, z * s) + simplex(x * s, z * s) / 2)) / 1.5
}

// Primitives

export const square = (x: number) => x ** 2

export const quartic = (x: number) => x ** 4

export const ortic = (x: number) => x ** 8

export const smoothstep = (x: number) => x * x * ((x - 1) * -2 - 1)

export const fract = (x: number) => x - Math.floor(x)

export const dot = (x1: number, y1: number, x2: number, y2: number) =>
  x1 * x2 + y1 * y2

// Composed

export const random1D = (x: number) => fract(Math.sin(x) * 999)

export const random2D = (scale: number) => (x: number, z: number) =>
  fract(
    Math.sin(
      dot(
        x * scale,
        z * scale,
        12.9898 * 43758.5453123,
        78.233 * 43758.5453123,
      ),
    ),
  )
