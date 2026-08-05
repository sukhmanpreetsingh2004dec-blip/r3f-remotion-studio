import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { easeInOut, easeOut, fadeIn } from '../utils/animation';

/**
 * PakistanGlobeScene — frame-accurate 3D Earth globe with Pakistan highlight.
 *
 * ALL animations are driven by useCurrentFrame() as required by Remotion.
 * No useFrame() or self-animating code is used.
 */
export const PakistanGlobeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const globeRef = useRef<THREE.Mesh>(null);
  const markerRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  // ─── Timing constants (in frames) ───────────────────────────────────────
  const ZOOM_START = 0;
  const ZOOM_END = fps * 2; // 0 → 2s: fast zoom from space
  const ROTATE_START = fps * 0.5;
  const ROTATE_END = fps * 3; // 0.5 → 3s: globe rotates to Pakistan
  const MARKER_START = fps * 2.5;
  const MARKER_END = fps * 4; // 2.5 → 4s: marker appears
  const RING_START = fps * 3;

  // ─── Camera Z position: wide space (30) → close up (4.5) ────────────────
  // NOTE: Camera is controlled at the ThreeCanvas level via perspectiveCamera prop
  // We instead animate the globe scale to simulate zoom
  const globeScale = easeInOut(frame, ZOOM_START, ZOOM_END, 0.3, 1.0);

  // ─── Globe rotation: Y axis spins to center Pakistan (~60° longitude) ───
  const globeRotationY = easeInOut(frame, ROTATE_START, ROTATE_END, 0, -Math.PI * 0.35);

  // ─── Subtle auto-spin after rotation completes (very slow) ──────────────
  const autoSpin = frame > ROTATE_END ? (frame - ROTATE_END) * 0.002 : 0;

  // ─── Marker scale: spring-in appearance ─────────────────────────────────
  const markerScale = frame >= MARKER_START
    ? easeOut(frame, MARKER_START, MARKER_END, 0, 1)
    : 0;

  // ─── Ring pulse: expand outward ──────────────────────────────────────────
  const ringProgress = frame >= RING_START
    ? ((frame - RING_START) % (fps * 1.2)) / (fps * 1.2)
    : 0;
  const ringScale = 1 + ringProgress * 2.5;
  const ringOpacity = frame >= RING_START ? (1 - ringProgress) * 0.8 : 0;

  // ─── Globe fade in ───────────────────────────────────────────────────────
  const globeOpacity = fadeIn(frame, 0, fps * 0.5);

  // ─── Memoized geometry ───────────────────────────────────────────────────
  const globeGeometry = useMemo(() => new THREE.SphereGeometry(1.5, 64, 64), []);
  const markerGeometry = useMemo(() => new THREE.ConeGeometry(0.04, 0.15, 8), []);
  const ringGeometry = useMemo(() => new THREE.RingGeometry(0.06, 0.09, 32), []);

  // ─── Pakistan coordinates on sphere surface ───────────────────────────────
  // lat: 30.3753°N, lon: 69.3451°E → convert to 3D point on unit sphere r=1.5
  const lat = (30.3753 * Math.PI) / 180;
  const lon = (69.3451 * Math.PI) / 180;
  const markerX = 1.52 * Math.cos(lat) * Math.sin(lon);
  const markerY = 1.52 * Math.sin(lat);
  const markerZ = 1.52 * Math.cos(lat) * Math.cos(lon);

  return (
    <group>
      {/* ── Earth Globe ───────────────────────────────────────────────── */}
      <mesh
        ref={globeRef}
        geometry={globeGeometry}
        rotation={[0, globeRotationY + autoSpin, 0]}
        scale={[globeScale, globeScale, globeScale]}
      >
        <meshStandardMaterial
          color="#1a6fba"
          roughness={0.7}
          metalness={0.1}
          transparent
          opacity={globeOpacity}
        />
      </mesh>

      {/* ── Pakistan continent highlight ──────────────────────────────── */}
      <mesh
        rotation={[0, globeRotationY + autoSpin, 0]}
        scale={[globeScale, globeScale, globeScale]}
      >
        <sphereGeometry args={[1.502, 64, 64, lon - 0.25, 0.5, Math.PI / 2 - lat - 0.2, 0.4]} />
        <meshStandardMaterial
          color="#2ecc71"
          roughness={0.6}
          metalness={0.05}
          transparent
          opacity={globeOpacity * 0.85}
        />
      </mesh>

      {/* ── Pakistan Marker pin ───────────────────────────────────────── */}
      <group
        position={[
          markerX * globeScale,
          markerY * globeScale,
          markerZ * globeScale,
        ]}
        rotation={[0, globeRotationY + autoSpin, 0]}
        scale={[markerScale, markerScale, markerScale]}
      >
        <mesh ref={markerRef} geometry={markerGeometry} rotation={[Math.PI, 0, 0]}>
          <meshStandardMaterial color="#e74c3c" roughness={0.3} metalness={0.5} />
        </mesh>

        {/* Marker base sphere */}
        <mesh position={[0, -0.08, 0]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color="#e74c3c" roughness={0.3} metalness={0.5} emissive="#e74c3c" emissiveIntensity={0.3} />
        </mesh>
      </group>

      {/* ── Pulse ring around Pakistan ────────────────────────────────── */}
      <mesh
        ref={ringRef}
        position={[
          markerX * globeScale,
          markerY * globeScale,
          markerZ * globeScale,
        ]}
        rotation={[0, globeRotationY + autoSpin, 0]}
        scale={[ringScale * markerScale, ringScale * markerScale, 1]}
        geometry={ringGeometry}
      >
        <meshBasicMaterial
          color="#e74c3c"
          side={THREE.DoubleSide}
          transparent
          opacity={ringOpacity * markerScale}
        />
      </mesh>
    </group>
  );
};
