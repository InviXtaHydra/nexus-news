import { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, type ThreeEvent } from '@react-three/fiber'
import { useReducedMotion } from 'framer-motion'
import * as THREE from 'three'
import type { ArticleWithMeta } from '../../types/news'
import { useIsLowPowerDevice } from '../../hooks/useMediaQuery'
import { useInView } from '../../hooks/useInView'

const DEG = Math.PI / 180
const RADIUS = 1.6

function latLngToVector(lat: number, lng: number, r = RADIUS): THREE.Vector3 {
  const phi = (90 - lat) * DEG
  const theta = (lng + 180) * DEG
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta))
}

/** Latitude rings and meridians as one line-segment geometry. */
function useGraticule() {
  return useMemo(() => {
    const pts: number[] = []
    const push = (a: THREE.Vector3, b: THREE.Vector3) => pts.push(a.x, a.y, a.z, b.x, b.y, b.z)
    for (let lat = -75; lat <= 75; lat += 15) {
      for (let lng = -180; lng < 180; lng += 5) push(latLngToVector(lat, lng), latLngToVector(lat, lng + 5))
    }
    for (let lng = -180; lng < 180; lng += 20) {
      for (let lat = -90; lat < 90; lat += 5) push(latLngToVector(lat, lng), latLngToVector(lat + 5, lng))
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
    return g
  }, [])
}

interface MarkerProps {
  story: ArticleWithMeta
  active: boolean
  onSelect: (id: string) => void
}

function Marker({ story, active, onSelect }: MarkerProps) {
  const ring = useRef<THREE.Mesh>(null)
  const { lat, lng } = story.location!
  const position = useMemo(() => latLngToVector(lat, lng), [lat, lng])
  // Orient the pulse ring flat against the globe surface.
  const quaternion = useMemo(
    () => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), position.clone().normalize()),
    [position],
  )

  useFrame((state) => {
    const m = ring.current
    if (!m) return
    const t = (state.clock.elapsedTime * 0.8 + lat) % 1
    m.scale.setScalar(1 + t * 2.2)
    ;(m.material as THREE.MeshBasicMaterial).opacity = (1 - t) * (active ? 0.9 : 0.5)
  })

  const color = active ? '#c4b5fd' : '#60a5fa'

  return (
    <group position={position} quaternion={quaternion}>
      <mesh
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation()
          onSelect(story.id)
        }}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = '')}
      >
        <sphereGeometry args={[active ? 0.055 : 0.04, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh ref={ring}>
        <ringGeometry args={[0.05, 0.065, 32]} />
        <meshBasicMaterial color={color} transparent side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  )
}

interface GlobeProps {
  stories: ArticleWithMeta[]
  activeId: string | null
  onSelect: (id: string) => void
}

function Globe({ stories, activeId, onSelect, instant }: GlobeProps & { instant: boolean }) {
  const spin = useRef<THREE.Group>(null)
  const tilt = useRef<THREE.Group>(null)
  const graticule = useGraticule()
  const active = stories.find((s) => s.id === activeId)

  useFrame((_, delta) => {
    const s = spin.current
    const t = tilt.current
    if (!s || !t) return
    // Reduced motion: no idle spin, and selections snap instead of easing.
    const ease = instant ? 1 : Math.min(1, delta * 3)
    if (!active?.location) {
      if (!instant) s.rotation.y += delta * 0.12
      t.rotation.x = THREE.MathUtils.lerp(t.rotation.x, 0.25, instant ? 1 : 0.05)
      return
    }
    // Turn the selected story to face the camera, taking the shortest path.
    const p = latLngToVector(active.location.lat, active.location.lng)
    const target = -Math.atan2(p.x, p.z)
    const diff = Math.atan2(Math.sin(target - s.rotation.y), Math.cos(target - s.rotation.y))
    s.rotation.y += diff * ease
    t.rotation.x = THREE.MathUtils.lerp(t.rotation.x, active.location.lat * DEG * 0.8, ease)
  })

  return (
    <group ref={tilt}>
      <group ref={spin}>
        <mesh>
          <sphereGeometry args={[RADIUS * 0.995, 64, 64]} />
          <meshStandardMaterial color="#0b1430" roughness={0.9} metalness={0.1} />
        </mesh>
        <lineSegments geometry={graticule}>
          <lineBasicMaterial color="#3b82f6" transparent opacity={0.22} />
        </lineSegments>
        {stories.map((s) => (
          <Marker key={s.id} story={s} active={s.id === activeId} onSelect={onSelect} />
        ))}
      </group>
      {/* Soft atmospheric rim */}
      <mesh scale={1.12}>
        <sphereGeometry args={[RADIUS, 48, 48]} />
        <meshBasicMaterial color="#6366f1" transparent opacity={0.08} side={THREE.BackSide} depthWrite={false} />
      </mesh>
    </group>
  )
}

export default function NewsGlobe(props: GlobeProps) {
  const container = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const lowPower = useIsLowPowerDevice()
  const inView = useInView(container)
  const [ready, setReady] = useState(false)

  return (
    <div
      ref={container}
      className={`size-full transition-opacity duration-1000 ${ready ? 'opacity-100' : 'opacity-0'}`}
    >
      <Canvas
        frameloop={reduceMotion ? 'demand' : inView ? 'always' : 'never'}
        dpr={lowPower ? [1, 1.25] : [1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        camera={{ position: [0, 0, 5.2], fov: 40 }}
        onCreated={() => setReady(true)}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 2, 4]} intensity={1.6} color="#93c5fd" />
        <Globe {...props} instant={!!reduceMotion} />
      </Canvas>
    </div>
  )
}
