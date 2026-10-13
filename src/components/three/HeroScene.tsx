import { useMemo, useRef, type ReactNode } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useReducedMotion } from 'framer-motion'
import * as THREE from 'three'
import { useIsLowPowerDevice } from '../../hooks/useMediaQuery'
import { useInView } from '../../hooks/useInView'

type ShapeKind = 'icosahedron' | 'torus' | 'octahedron' | 'torusKnot' | 'dodecahedron'

interface ShapeSpec {
  kind: ShapeKind
  position: [number, number, number]
  scale: number
  color: string
  speed: number
  wireframe?: boolean
}

const SHAPES: ShapeSpec[] = [
  { kind: 'icosahedron', position: [3.4, 1.1, -1], scale: 1.15, color: '#3b82f6', speed: 0.6, wireframe: true },
  { kind: 'torus', position: [4.6, -1.5, -2.5], scale: 0.75, color: '#8b5cf6', speed: 0.45 },
  { kind: 'octahedron', position: [1.6, -1.9, 0.2], scale: 0.5, color: '#60a5fa', speed: 0.8 },
  { kind: 'torusKnot', position: [-4.2, 2.2, -3.5], scale: 0.5, color: '#a78bfa', speed: 0.35 },
  { kind: 'dodecahedron', position: [6.2, 2.4, -4], scale: 0.6, color: '#3b82f6', speed: 0.5, wireframe: true },
  { kind: 'octahedron', position: [-2.4, -2.4, -2.5], scale: 0.4, color: '#8b5cf6', speed: 0.7, wireframe: true },
]

function Geometry({ kind }: { kind: ShapeKind }) {
  switch (kind) {
    case 'icosahedron':
      return <icosahedronGeometry args={[1, 1]} />
    case 'torus':
      return <torusGeometry args={[1, 0.32, 24, 64]} />
    case 'octahedron':
      return <octahedronGeometry args={[1, 0]} />
    case 'torusKnot':
      return <torusKnotGeometry args={[1, 0.28, 96, 16]} />
    case 'dodecahedron':
      return <dodecahedronGeometry args={[1, 0]} />
  }
}

function FloatingShape({ spec, index }: { spec: ShapeSpec; index: number }) {
  const ref = useRef<THREE.Mesh>(null)
  const baseY = spec.position[1]

  useFrame((state, delta) => {
    const mesh = ref.current
    if (!mesh) return
    const t = state.clock.elapsedTime
    mesh.rotation.x += delta * spec.speed * 0.25
    mesh.rotation.y += delta * spec.speed * 0.35
    mesh.position.y = baseY + Math.sin(t * spec.speed + index) * 0.22
  })

  return (
    <mesh ref={ref} position={spec.position} scale={spec.scale}>
      <Geometry kind={spec.kind} />
      {spec.wireframe ? (
        <meshBasicMaterial color={spec.color} wireframe transparent opacity={0.45} />
      ) : (
        <meshStandardMaterial
          color={spec.color}
          emissive={spec.color}
          emissiveIntensity={0.35}
          metalness={0.6}
          roughness={0.25}
          transparent
          opacity={0.85}
        />
      )}
    </mesh>
  )
}

function Particles({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      // Deterministic spread
      const rx = (Math.sin(i * 12.9898) * 43758.5453) % 1
      const ry = (Math.sin((i + 1) * 78.233) * 43758.5453) % 1
      const rz = (Math.sin((i + 2) * 45.164) * 43758.5453) % 1
      arr[i * 3] = (rx - 0.5) * 22
      arr[i * 3 + 1] = (ry - 0.5) * 10
      arr[i * 3 + 2] = -Math.abs(rz) * 8
    }
    return arr
  }, [count])

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.01
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#93c5fd" transparent opacity={0.7} sizeAttenuation depthWrite={false} />
    </points>
  )
}

/** Eases the whole scene toward the pointer for a gentle parallax. */
function PointerRig({ children }: { children: ReactNode }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((state) => {
    const g = ref.current
    if (!g) return
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, state.pointer.x * 0.12, 0.04)
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -state.pointer.y * 0.08, 0.04)
  })
  return <group ref={ref}>{children}</group>
}

export default function HeroScene() {
  const container = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const lowPower = useIsLowPowerDevice()
  const inView = useInView(container)

  // Mobile keeps two shapes and fewer particles; reduced motion renders a still frame.
  const shapes = lowPower ? SHAPES.slice(0, 2) : SHAPES
  const frameloop = reduceMotion ? 'demand' : inView ? 'always' : 'never'

  return (
    <div ref={container} className="absolute inset-0" aria-hidden>
      <Canvas
        frameloop={frameloop}
        dpr={lowPower ? [1, 1.25] : [1, 1.75]}
        gl={{ antialias: !lowPower, alpha: true, powerPreference: 'low-power' }}
        camera={{ position: [0, 0, 8], fov: 45 }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[6, 4, 4]} intensity={40} color="#3b82f6" />
        <pointLight position={[-6, -3, 2]} intensity={30} color="#8b5cf6" />
        <PointerRig>
          {shapes.map((s, i) => (
            <FloatingShape key={i} spec={s} index={i} />
          ))}
          <Particles count={lowPower ? 90 : 260} />
        </PointerRig>
      </Canvas>
    </div>
  )
}
